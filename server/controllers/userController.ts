import { Request, Response } from "express";
import { Clerk, ClerkOptions } from "@clerk/clerk-sdk-node";
import { db } from "../firebaseAdmin";
import admin from "firebase-admin";

// Register a new user
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { emailAddress, password, isManager } = req.body;
    // after creating the user in Clerk, we store the user's data in Firestore
    const result = await createUser(emailAddress, password, isManager);
    if (result) {
      await db.collection("users").doc(result.user.id).set({
        emailAddress,
        isManager,
        currentBookings: [],
        pastTrips: [],
      });
    }
    res.status(200).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to register user:", errorMessage);
    res.status(500).json({ message: "Failed to register user", error: errorMessage });
  }
};

// grab the clerk api key for env
const clerkApiKey: string = process.env.CLERK_SECRET_KEY!;
if (!clerkApiKey) {
  process.exit(1);
}

// Initialize Clerk
const clerk = Clerk({ secretKey: clerkApiKey } as ClerkOptions);

// Create a new user using Clerk
const createUser = async (emailAddress: string, password: string, isManager: boolean) => {
  try {
    const user = await clerk.users.createUser({
      emailAddress: [emailAddress],
      password,
      publicMetadata: { isManager },
    });

    return { user };
  } catch (error: unknown) {
    console.error("Failed to create user:", error);
    throw error;
  }
};

// Book a bicycle
export const bookBicycle = async (req: Request, res: Response) => {
  const { bicycleId, userId, date } = req.body;

  try {
    const bikeRef = db.collection("bicycles").doc(bicycleId);
    const userRef = db.collection("users").doc(userId);

    const bikeDoc = await bikeRef.get();

    if (!bikeDoc.exists) {
      return res.status(404).send({ message: "Bicycle not found" });
    }

    const bikeData = bikeDoc.data();
    if (!bikeData.isAvailable || bikeData.needsRepair === "true") {
      return res.status(400).send({ message: "Bicycle is not available" });
    }

    const booking = { bicycleId, date };

    await userRef.update({
      currentBookings: admin.firestore.FieldValue.arrayUnion(booking),
    });

    await db.collection("bicycles").doc(bicycleId).update({
      isAvailable: false,
      currentUid: userId,
      currentBookingDate: date,
    });

    res.status(200).send({ success: true });
  } catch (error: unknown) {
    console.error("Failed to book bicycle:", error);
    res.status(500).send("Failed to book bicycle");
  }
};

// Fetch all user's trips
export const fetchTrips = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const user = await db.collection("users").doc(userId).get();
    const data = user.data();
    res.json(data);
  } catch (error: unknown) {
    console.error("Failed to fetch trips:", error);
    res.status(500).send("Failed to fetch trips");
  }
};

// Cancel a booking
export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const { bicycleId, userId } = req.body;
    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.data();

    if (!userData) {
      throw new Error("User not found");
    }

    const { currentBookings } = userData;

    const bookingToRemove = currentBookings.find((booking: any) => booking.bicycleId === bicycleId);

    if (!bookingToRemove) {
      throw new Error("Booking not found");
    }

    await db
      .collection("users")
      .doc(userId)
      .update({
        currentBookings: admin.firestore.FieldValue.arrayRemove(bookingToRemove),
      });

    await db.collection("bicycles").doc(bicycleId).update({
      isAvailable: true,
      currentUid: null,
      currentBookingDate: null,
    });

    res.status(200).send({ success: true });
  } catch (error) {
    console.error("Failed to cancel booking:", error);
    res.status(500).send("Failed to cancel booking");
  }
};

// Check if booking is expired if yes move it to past trips to be displayed in the trips page and user to rate it or mark it as needing repair
function isBookingExpired(bookingDate: string) {
  const bookingDateTime = new Date(bookingDate).getTime();
  const currentTime = Date.now();
  const twentyFourHoursInMs = 24 * 60 * 60 * 1000;

  return currentTime - bookingDateTime > twentyFourHoursInMs;
}

// Update booking to move expired bookings to past trips
export const updateBooking = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.data();

    if (!userData) {
      throw new Error("User not found");
    }

    const { currentBookings, pastTrips = [] } = userData;

    const newCurrentBookings = [];
    const newPastTrips = [...pastTrips];

    for (const booking of currentBookings) {
      if (isBookingExpired(booking.date)) {
        newPastTrips.push(booking);
      } else {
        newCurrentBookings.push(booking);
      }
    }

    await db.collection("users").doc(userId).update({
      currentBookings: newCurrentBookings,
      pastTrips: newPastTrips,
    });

    res.status(200).send({ success: true });
  } catch (error) {
    console.error("Failed to update booking:", error);
    res.status(500).send("Failed to update booking");
  }
};

// Rate a bicycle after a trip
export const rateBicycle = async (req: Request, res: Response) => {
  try {
    const { bicycleId, userId, rating } = req.body;

    const bicycleRef = db.collection("bicycles").doc(bicycleId);
    const bicycleDoc = await bicycleRef.get();

    if (!bicycleDoc.exists) {
      return res.status(404).send({ message: "Bicycle not found" });
    }

    let bicycleData = bicycleDoc.data();

    if (!bicycleData.ratings) {
      bicycleData.ratings = [];
    }

    const existingRatingIndex = bicycleData.ratings.findIndex((rating: any) => rating.userId === userId);

    if (existingRatingIndex !== -1) {
      bicycleData.ratings[existingRatingIndex].rating = rating;
    } else {
      bicycleData.ratings.push({ userId, rating });
    }

    const totalRatings = bicycleData.ratings.reduce((acc: any, curr: any) => acc + curr.rating, 0);
    const averageRating = totalRatings / bicycleData.ratings.length;

    await bicycleRef.update({
      ratings: bicycleData.ratings,
      averageRating: averageRating,
    });

    res.status(200).send({ success: true, message: "Rating updated successfully" });
  } catch (error) {
    console.error("Failed to rate bicycle:", error);
    res.status(500).send("Failed to rate bicycle");
  }
};

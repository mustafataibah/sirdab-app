import { Request, Response } from "express";
import { db } from "../firebaseAdmin";
import { clerkClient } from "@clerk/clerk-sdk-node";

// Fetch all users
export const fetchUsers = async (req: Request, res: Response) => {
  try {
    const usersRef = db.collection("users");
    const snapshot = await usersRef.get();
    const users: any[] = [];
    snapshot.forEach((doc: any) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    res.json(users);
  } catch (error: any) {
    console.error("Failed to fetch users:", error);
    res.status(500).send("Failed to fetch users");
  }
};

// Add a bicycle
export const addBicycle = async (req: Request, res: Response) => {
  const { model, color, location, ratings, isAvailable } = req.body;
  try {
    const docRef = await db.collection("bicycles").add({
      model,
      color,
      location,
      ratings: ratings || [],
      averageRating: 0,
      isAvailable,
      pastBookings: [],
      currentUid: "",
      currentBookingDate: "",
      needsRepair: "false",
      createdAt: new Date(),
    });
    res.status(201).send({ success: true, id: docRef.id, message: "Bicycle added successfully!" });
  } catch (error: any) {
    console.error("Failed to add bicycle:", error);
    res.status(500).send("Failed to add bicycle");
  }
};

// Fetch all bicycles
export const fetchBicycles = async (req: Request, res: Response) => {
  try {
    const bicyclesRef = db.collection("bicycles");
    const snapshot = await bicyclesRef.get();
    const bicycles: any[] = [];
    snapshot.forEach((doc: any) => {
      bicycles.push({ id: doc.id, ...doc.data() });
    });
    res.json(bicycles);
  } catch (error: any) {
    console.error("Failed to fetch bicycles:", error);
    res.status(500).send("Failed to fetch bicycles");
  }
};

// Delete a user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    await db.collection("users").doc(id).delete();
    await clerkClient.users.deleteUser(id);
    res.send({ success: true, message: "User deleted successfully!" });
  } catch (error: any) {
    console.error("Failed to delete user:", error);
    res.status(500).send("Failed to delete user");
  }
};

// Change user role
export const changeRole = async (req: Request, res: Response) => {
  try {
    const { id, isManager } = req.body;

    await db.collection("users").doc(id).update({
      isManager,
    });
    await clerkClient.users.updateUserMetadata(id, {
      publicMetadata: {
        isManager,
      },
    });
    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Failed to change role:", error);
    res.status(500).send("Failed to change role");
  }
};

// Update a bicycle
export const updateBicycle = async (req: Request, res: Response) => {
  const { id, model, color, location, isAvailable } = req.body;
  try {
    await db.collection("bicycles").doc(id).update({
      model,
      color,
      location,
      isAvailable,
    });
    res.status(200).send({ success: true, message: "Bicycle updated successfully!" });
  } catch (error: any) {
    console.error("Failed to update bicycle:", error);
    res.status(500).send("Failed to update bicycle");
  }
};

// Delete a bicycle
export const deleteBicycle = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    await db.collection("bicycles").doc(id).delete();
    res.status(200).send({ success: true, message: "Bicycle updated successfully!" });
  } catch (error: any) {
    console.error("Failed to delete bicycle:", error);
    res.status(500).send("Failed to delete bicycle");
  }
};

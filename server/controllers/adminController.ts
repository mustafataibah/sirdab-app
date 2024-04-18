import { Request, Response } from "express";
import { db } from "../firebase/firebaseAdmin";

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

export const addBicycle = async (req: Request, res: Response) => {
  const { model, color, location, rating, isAvailable } = req.body;
  try {
    const docRef = await db.collection("bicycles").add({
      model,
      color,
      location,
      rating,
      isAvailable,
      createdAt: new Date(),
    });
    res.status(201).send({ success: true, id: docRef.id, message: "Bicycle added successfully!" });
  } catch (error: any) {
    console.error("Failed to add bicycle:", error);
    res.status(500).send("Failed to add bicycle");
  }
};

export const fetchBicycles = async (req: Request, res: Response) => {
  try {
    const usersRef = db.collection("bicycles");
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

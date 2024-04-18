import { Request, Response } from "express";
import { Clerk, ClerkOptions } from "@clerk/clerk-sdk-node";
import { db } from "../firebase/firebaseAdmin";

export const registerUser = async (req: Request, res: Response) => {
  console.log("Called registerUser");
  try {
    const { emailAddress, password, isManager } = req.body;
    console.log("Inside registerUser:", emailAddress, password, isManager);
    const result = await createUser(emailAddress, password, isManager);
    console.log("Result:", result);
    if (result) {
      await db.collection("users").doc(result.user.id).set({
        emailAddress,
        isManager,
      });
    }
    res.status(200).json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to register user:", errorMessage);
    res.status(500).json({ message: "Failed to register user", error: errorMessage });
  }
};

const clerkApiKey: string = process.env.CLERK_SECRET_KEY!;
if (!clerkApiKey) {
  console.log("No Clerk API key found in env");
  process.exit(1);
}

const clerk = Clerk({ secretKey: clerkApiKey } as ClerkOptions);

const createUser = async (emailAddress: string, password: string, isManager: boolean) => {
  console.log("Called createUser");
  try {
    const user = await clerk.users.createUser({
      emailAddress: [emailAddress],
      password,
      publicMetadata: { isManager },
    });

    console.log("Created user:", user);

    return { user };
  } catch (error: unknown) {
    console.error("Failed to create user:", error);
    throw error;
  }
};

// import { Clerk, ClerkOptions } from "@clerk/clerk-sdk-node";

// const clerkApiKey: string = process.env.CLERK_SECRET_KEY!;
// if (!clerkApiKey) {
//   console.log("No Clerk API key found in env");
//   process.exit(1);
// }

// const clerk = Clerk({ secretKey: clerkApiKey } as ClerkOptions);

// export const createUser = async (emailAddress: string, password: string, isManager: boolean) => {
//   console.log("Called createUser");
//   try {
//     const user = await clerk.users.createUser({
//       emailAddress: [emailAddress],
//       password,
//       publicMetadata: { isManager },
//     });

//     console.log("Created user:", user);

//     return { user };
//   } catch (error: unknown) {
//     console.error("Failed to create user:", error);
//     throw error;
//   }
// };

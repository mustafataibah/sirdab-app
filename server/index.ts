require("dotenv").config();
import express from "express";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";

// Express Server
const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/api", userRoutes); // user routes
app.use("/admin", adminRoutes); // admin routes

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

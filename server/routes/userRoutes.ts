import express from "express";
import {
  registerUser,
  bookBicycle,
  fetchTrips,
  cancelBooking,
  updateBooking,
  rateBicycle,
} from "../controllers/userController";

// Express Router
const router = express.Router();

router.post("/register", registerUser);
router.post("/bookBicycle", bookBicycle);
router.get("/fetchTrips", fetchTrips);
router.post("/cancelBooking", cancelBooking);
router.post("/updateBooking", updateBooking);
router.post("/rateBicycle", rateBicycle);

export default router;

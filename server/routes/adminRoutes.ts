import express from "express";
import {
  fetchUsers,
  addBicycle,
  fetchBicycles,
  deleteUser,
  changeRole,
  updateBicycle,
  deleteBicycle,
} from "../controllers/adminController";

// Express Router
const router = express.Router();

router.get("/fetchUsers", fetchUsers);
router.post("/addBicycle", addBicycle);
router.get("/fetchBicycles", fetchBicycles);
router.delete("/deleteUser", deleteUser);
router.post("/changeRole", changeRole);
router.post("/updateBicycle", updateBicycle);
router.delete("/deleteBicycle", deleteBicycle);

export default router;

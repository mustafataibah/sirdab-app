import express from "express";
import { fetchUsers, addBicycle, fetchBicycles } from "../controllers/adminController";

const router = express.Router();

router.get("/fetchUsers", fetchUsers);
router.post("/addBicycle", addBicycle);
router.get("/fetchBicycles", fetchBicycles);

export default router;

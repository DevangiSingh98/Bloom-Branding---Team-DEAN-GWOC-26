import express from "express";
import { createEnquiry } from "../controllers/enquirycontroller.js";

const router = express.Router();
router.post("/", createEnquiry);

export default router;

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import enquiryRoutes from "./routes/enquiryRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/bloom");

app.use("/api/enquiries", enquiryRoutes);

app.listen(5000, () => console.log("Backend running on 5000"));

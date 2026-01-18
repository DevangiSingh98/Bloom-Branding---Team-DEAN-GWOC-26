
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const siteImageSchema = new mongoose.Schema({
    home_blooming: { type: String, default: "" },
    navbar_logo: { type: String, default: "" },
    menu_home: { type: String, default: "" },
    menu_ourstory: { type: String, default: "" },
    menu_services: { type: String, default: "" },
    menu_work: { type: String, default: "" },
    menu_contact: { type: String, default: "" },
    // Add other fields if necessary
}, { collection: 'site_images' }); // FORCE collection name

const SiteImage = mongoose.model('SiteImage', siteImageSchema);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const seedImages = async () => {
    await connectDB();

    try {
        // Check if exists
        const existing = await SiteImage.findOne();
        if (existing) {
            console.log("Site Images already exist. Updating...");
            existing.home_blooming = existing.home_blooming || "/images/bloomingthebrand.png";
            existing.navbar_logo = existing.navbar_logo || "/images/Full-Logo.png";
            existing.menu_home = existing.menu_home || "/images/home.png";
            existing.menu_ourstory = existing.menu_ourstory || "/images/ourstory.png";
            existing.menu_services = existing.menu_services || "/images/services.png";
            existing.menu_work = existing.menu_work || "/images/Ourwork.png";
            existing.menu_contact = existing.menu_contact || "/images/tele.png";
            await existing.save();
            console.log("Updated existing Site Images.");
        } else {
            console.log("Creating new Site Images document...");
            await SiteImage.create({
                home_blooming: "/images/bloomingthebrand.png",
                navbar_logo: "/images/Full-Logo.png",
                menu_home: "/images/home.png",
                menu_ourstory: "/images/ourstory.png",
                menu_services: "/images/services.png",
                menu_work: "/images/Ourwork.png",
                menu_contact: "/images/tele.png"
            });
            console.log("Created Site Images.");
        }

        console.log("Seeding Completed!");
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedImages();

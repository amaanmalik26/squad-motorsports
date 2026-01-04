import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Configure Multer (Memory storage)
const upload = multer({ storage: multer.memoryStorage() });

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: '*', // Allow your frontend to talk to this backend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly allow DELETE
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// --- ROUTES ---

// 8. UPLOAD IMAGE (Admin Only)
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Convert buffer to base64 for Cloudinary
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'squad-motorsports'
    });

    res.json({ url: result.secure_url });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ error: "Image upload failed" });
  }
});

// 1. GET ALL BIKES (Public)
app.get('/api/bikes', async (req, res) => {
  try {
    const bikes = await prisma.bike.findMany({
      orderBy: { createdAt: 'desc' } // Newest first
    });
    res.json(bikes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch bikes" });
  }
});

// 9. UPDATE BIKE (Admin Only)
app.put('/api/bikes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, brand, price, year, engine, power, description, images, status } = req.body;

    const updatedBike = await prisma.bike.update({
      where: { id: Number(id) },
      data: {
        name,
        brand,
        price: Number(price),
        year: Number(year),
        engine,
        power,
        description,
        images, // Array of strings
        status
      }
    });

    res.json(updatedBike);
  } catch (error) {
    console.error("Update failed:", error);
    res.status(500).json({ error: "Failed to update bike" });
  }
});

// 2. GET SINGLE BIKE (Public)
app.get('/api/bikes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const bike = await prisma.bike.findUnique({
      where: { id: Number(id) }
    });
    
    if (!bike) {
        res.status(404).json({ error: "Bike not found" });
        return; 
    }
    
    res.json(bike);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bike details" });
  }
});

// 3. CREATE INQUIRY (Public - Form Submission)
app.post('/api/inquiries', async (req, res) => {
  try {
    const { name, email, phone, message, bikeId } = req.body;
    
    // Validate inputs
    if (!name || !email || !message) {
      res.status(400).json({ error: "Name, email, and message are required." });
      return; 
    }

    // Save to Database
    const newInquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        phone,
        message,
        bikeId: bikeId ? Number(bikeId) : null
      }
    });

    res.status(201).json({ success: true, inquiry: newInquiry });
  } catch (error) {
    console.error("Inquiry Error:", error);
    res.status(500).json({ error: "Failed to submit inquiry." });
  }
});

app.post('/api/bikes', async (req, res) => {
  try {
    const { name, brand, price, year, engine, power, description, images, status } = req.body;

    const newBike = await prisma.bike.create({
      data: {
        name,
        brand,
        price: Number(price),
        year: Number(year),
        engine,
        power,
        description,
        images, 
        status
      }
    });

    res.json(newBike);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add bike" });
  }
});

// 5. GET INQUIRIES (Admin Dashboard)
app.get('/api/inquiries', async (req, res) => {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch inquiries" });
  }
});

// 6. DELETE BIKE (Admin Action)
app.delete('/api/bikes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.bike.delete({ where: { id: Number(id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete bike" });
  }
});

export default app;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

// 4. ADMIN LOGIN (Public)
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;

  // HARDCODED ADMIN FOR NOW (To avoid seeding users)
  // In a real app, you would fetch from prisma.admin.findUnique()
  const ADMIN_EMAIL = "admin@squad.com";
  const ADMIN_PASS = "admin123";

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASS) {
     res.status(401).json({ error: "Invalid credentials" });
     return;
  }

  // Generate Token
  const token = jwt.sign(
    { email: ADMIN_EMAIL, role: 'admin' }, 
    process.env.JWT_SECRET as string, 
    { expiresIn: '1d' }
  );

  res.json({ success: true, token });
});
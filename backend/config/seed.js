const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/User");
const Table = require("../models/Table");

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB for seeding...");

  await User.deleteMany({});
  await Table.deleteMany({});

  // Create admin
  await User.create({
    name: "Nitish Kumar",
    email: "nitish@spiceofindia.com",
    password: "nitish123",
    phone: "+91 6204387500",
    role: "admin",
  });

  // Create sample users
  await User.create([
    {
      name: "Jagriti",
      email: "jagriti@gmail.com",
      password: "user123",
      phone: "+91 98765 11111",
      role: "user",
    },
    {
      name: "Deepak",
      email: "deepak@gmail.com",
      password: "user123",
      phone: "+91 98765 22222",
      role: "user",
    },
    {
      name: "Saurav",
      email: "saurav@gmail.com",
      password: "user123",
      phone: "+91 98765 33333",
      role: "user",
    },
    {
      name: "Sameer",
      email: "sameer@gmail.com",
      password: "user123",
      phone: "+91 98765 44444",
      role: "user",
    },
    {
      name: "Aryan",
      email: "aryan@gmail.com",
      password: "user123",
      phone: "+91 98765 55555",
      role: "user",
    },
    {
      name: "Ravi",
      email: "ravi@gmail.com",
      password: "user123",
      phone: "+91 98765 66666",
      role: "user",
    },
    {
      name: "Shivang",
      email: "shivang@gmail.com",
      password: "user123",
      phone: "+91 98765 77777",
      role: "user",
    },
    {
      name: "Suraj",
      email: "suraj@gmail.com",
      password: "user123",
      phone: "+91 98765 88888",
      role: "user",
    },
    {
      name: "Nicky",
      email: "nicky@gmail.com",
      password: "user123",
      phone: "+91 98765 99999",
      role: "user",
    },
  ]);

  // Create tables
  const tables = [
    {
      tableNumber: 1,
      seats: 2,
      section: "Window",
      description: "Cozy window seat with garden view",
    },
    {
      tableNumber: 2,
      seats: 2,
      section: "Window",
      description: "Romantic corner table",
    },
    {
      tableNumber: 3,
      seats: 4,
      section: "Main Hall",
      description: "Central main hall table",
    },
    {
      tableNumber: 4,
      seats: 4,
      section: "Main Hall",
      description: "Near the live kitchen",
    },
    {
      tableNumber: 5,
      seats: 4,
      section: "Main Hall",
      description: "Quiet side of main hall",
    },
    {
      tableNumber: 6,
      seats: 6,
      section: "Family",
      description: "Large family dining area",
    },
    {
      tableNumber: 7,
      seats: 6,
      section: "Family",
      description: "Family booth with high chairs",
    },
    {
      tableNumber: 8,
      seats: 8,
      section: "Banquet",
      description: "Private banquet table for events",
    },
    {
      tableNumber: 9,
      seats: 2,
      section: "Garden",
      description: "Outdoor garden seating",
    },
    {
      tableNumber: 10,
      seats: 4,
      section: "Garden",
      description: "Under the neem tree",
    },
    {
      tableNumber: 11,
      seats: 4,
      section: "VIP",
      description: "Premium VIP room",
    },
    {
      tableNumber: 12,
      seats: 6,
      section: "VIP",
      description: "VIP suite with private service",
    },
  ];
  await Table.insertMany(tables);

  console.log("✅ Seed complete!");
  console.log("   Admin → nitish@spiceofindia.com / nitish123");
  console.log("   Users → jagriti@gmail.com / user123");
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

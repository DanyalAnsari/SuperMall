require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const readline = require("readline");
const { UserModel } = require("../models/UserModel");
const { connectDB } = require("../db/mongo");

// Database connection
connectDB();

// 1. Database Seed Method
const createSuperadminViaSeed = async () => {
  try {
    if (!process.env.SUPERADMIN_EMAIL || !process.env.SUPERADMIN_INITIAL_PWD) {
      throw new Error("Missing required environment variables");
    }

    const existing = await UserModel.findOne({
      email: process.env.SUPERADMIN_EMAIL,
      role: "superadmin",
    });

    if (existing) {
      console.log("Superadmin already exists");
      return;
    }

    const superadmin = await UserModel.create({
      name: "System Owner",
      email: process.env.SUPERADMIN_EMAIL,
      password: await bcrypt.hash(process.env.SUPERADMIN_INITIAL_PWD, 12),
      role: "Superadmin",
      phone_number:'+916134567890',
      isVerified: true,
      verificationToken: crypto.randomBytes(32).toString("hex"),
      lastPasswordChange: null, // Forces password change on first login
    });

    console.log(`Superadmin created with ID: ${superadmin._id}`);
  } catch (err) {
    console.error("Seed method error:", err.message);
  }
};

// 2. CLI Interactive Method
const createSuperadminViaCLI = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const email = await new Promise((resolve) => {
      rl.question("Enter superadmin email: ", resolve);
    });

    const password = await new Promise((resolve) => {
      rl.question(
        "Enter temporary password (hidden): ",
        { silent: true },
        resolve
      );
    });

    const existing = await UserModel.findOne({ email, role: "superadmin" });
    if (existing) {
      console.log("Superadmin with this email already exists");
      rl.close();
      return;
    }

    const superadmin = await UserModel.create({
      email,
      password: await bcrypt.hash(password, 12),
      role: "superadmin",
      firstName: "Super",
      lastName: "Admin",
      isVerified: true,
      requiresPasswordChange: true,
    });

    console.log(`Superadmin created successfully with ID: ${superadmin._id}`);
    console.log("IMPORTANT: Change password immediately after first login!");
  } catch (err) {
    console.error("CLI method error:", err.message);
  } finally {
    rl.close();
  }
};

// 3. Emergency MongoDB Shell Command Generator
const showMongoShellCommand = () => {
  const password = crypto.randomBytes(8).toString("hex");
  const salt = bcrypt.genSaltSync(12);
  const hashedPwd = bcrypt.hashSync(password, salt);

  console.log("\nEMERGENCY MONGO SHELL COMMAND:");
  console.log(`// Run this in MongoDB shell if other methods fail`);
  console.log(`// Temporary password: ${password} (change immediately)\n`);
  console.log(`db.users.insertOne({
  firstName: "Emergency",
  lastName: "Access",
  email: \"emergency-admin@Supermall.com\",
  password: \"${hashedPwd}\",
  role: \"superadmin\",
  isVerified: true,
  requiresPasswordChange: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  verificationToken: "${crypto.randomBytes(32).toString("hex")}"
});\n`);
};

// Security Utilities
const securityUtilities = {
  // Middleware to protect superadmin routes
  superadminAuth: async (req, res, next) => {
    if (req.user?.role !== "superadmin") {
      return res.status(403).json({ message: "Superadmin access required" });
    }
    next();
  },

  // Password change requirement check
  checkPasswordChange: (user) => {
    return (
      user.role === "superadmin" &&
      (user.requiresPasswordChange ||
        !user.lastPasswordChange ||
        Date.now() - user.lastPasswordChange > 90 * 24 * 60 * 60 * 1000)
    ); // 90 days
  },

  // IP Whitelisting check
  ipWhitelist: (ip) => {
    const allowedIPs = process.env.SUPERADMIN_WHITELIST?.split(",") || [];
    return allowedIPs.includes(ip);
  },
};

// Main execution
(async () => {
  await connectDB();

  console.log("\nSuperadmin Creation Methods:");
  console.log("1. Automated seed (requires .env configuration)");
  console.log("2. Interactive CLI");
  console.log("3. Show emergency MongoDB shell command\\\\n");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const choice = await new Promise((resolve) => {
    rl.question("Select method (1-3): ", resolve);
  });

  switch (choice) {
    case "1":
      await createSuperadminViaSeed();
      break;
    case "2":
      await createSuperadminViaCLI();
      break;
    case "3":
      showMongoShellCommand();
      break;
    default:
      console.log("Invalid choice");
  }

  rl.close();
  mongoose.disconnect();
})();

module.exports = { securityUtilities };

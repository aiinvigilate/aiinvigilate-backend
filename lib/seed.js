import chalk from "chalk";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

export async function seedDB() {
  console.log(`${chalk.blue("✓")} ${chalk.blue("seed db started")}`);

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, saltRounds);

    const newSuperAdmin = {
      name: "Administrator",
      surname: process.env.ADMIN_SURNAME,
      gender: "male",
      email: process.env.ADMIN_EMAIL,
      idNumber: process.env.ADMIN_ID_NUMBER,
      password: hashedPassword,
      role: "admin",
      verified: true,
      verificationToken: null,
    };

    await prisma.user.upsert({
      where: { email: process.env.ADMIN_EMAIL },  
      update: newSuperAdmin, // Update if admin exists
      create: newSuperAdmin, // Create if admin doesn't exist
    });

    console.log(`${chalk.green("✓")} ${chalk.green("seed db finished")}`);
  } catch (error) {
    console.log(`${chalk.red("x")} ${chalk.red("error while seeding database")}`);
    console.error(error);
  } finally {
    await prisma.$disconnect(); // Ensure the database connection is closed
  }
}

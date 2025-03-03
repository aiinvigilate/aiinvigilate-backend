import  chalk  from "chalk";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";

export async function seedDB() {
  const admin = await prisma.user.findFirst({ where: { role: "admin" } });
  console.log(`${chalk.blue("✓")} ${chalk.blue("seed db started")}`);
  if (admin) {
    await cleanUpDB(admin);
  }

  const saltRounds = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(
    process.env.ADMIN_PASSWORD,
    saltRounds
  );

  const newSuperAdmin = {
    name: "Administrator",
    surname: "admin",
    gender: "male", // 
    email: "aiinvigilate@gmail.com",
    idNumber: "0000000000000", 
    password: hashedPassword,
    role: "admin", 
    verified: true, 
    verificationToken: null, 
  };

  try {
    await prisma.user.create({ data: newSuperAdmin });
    console.log(`${chalk.green("✓")} ${chalk.green("seed db finished")}`);
  } catch (error) {
    console.log(
      `${chalk.red("x")} ${chalk.red("error while seeding database")}`
    );
    console.error(error);
  }
}

async function cleanUpDB(admin) {
  console.log(`${chalk.blue("✓")} ${chalk.blue("cleaning db has started")}`);
  try {
    await prisma.user.delete({
      where: { id: admin.id },
    });
    console.log(`${chalk.green("✓")} ${chalk.green("cleaning db finished")}`);
  } catch (error) {
    console.log(
      `${chalk.red("x")} ${chalk.red("error while cleaning database")}`
    );
    console.error(error);
    process.exit(1);
  }
}

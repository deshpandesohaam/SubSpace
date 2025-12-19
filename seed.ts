import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create a demo user
  const hashedPassword = await bcrypt.hash("demo123456", 10);
  const user = await prisma.user.upsert({
    where: { email: "demo@clueso.io" },
    update: {},
    create: {
      email: "demo@clueso.io",
      password: hashedPassword,
      name: "Demo User",
    },
  });

  console.log("Created user:", user.email);

  // Create a demo project
  const project = await prisma.project.create({
    data: {
      name: "My First Project",
      description: "A demo project to get started with Clueso",
      userId: user.id,
    },
  });

  console.log("Created project:", project.name);

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

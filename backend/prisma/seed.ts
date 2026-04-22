import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.role.createMany({
    data: [{ name: 'Admin' }, { name: 'User' }, { name: 'Uploader' }],
    skipDuplicates: true,
  });

  console.log('Seeded roles : ', result);
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

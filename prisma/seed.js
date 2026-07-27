const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Checking existing showrooms...');
  
  const existingHalls = await prisma.hall.count();
  if (existingHalls > 0) {
    console.log('Showrooms already exist. Seeding skipped.');
    return;
  }

  console.log('Seeding showrooms and seats...');

  const hallNames = ['Showroom 1', 'Showroom 2', 'Showroom 3'];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const numCols = 8;
  const capacity = rows.length * numCols; // 64 seats

  for (const name of hallNames) {
    const hall = await prisma.hall.create({
      data: {
        name: name,
        capacity: capacity,
      },
    });

    console.log(`Created ${hall.name} with ID: ${hall.id}`);

    const seatsData = [];
    for (const row of rows) {
      for (let col = 1; col <= numCols; col++) {
        seatsData.push({
          hallId: hall.id,
          row: row,
          number: col,
        });
      }
    }

    await prisma.seat.createMany({
      data: seatsData,
    });
    
    console.log(`Successfully mapped ${capacity} seats for ${hall.name}.`);
  }

  console.log('Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
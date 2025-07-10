const { PrismaClient } = require('./lib/generated/prisma');
const prisma = new PrismaClient();

async function cleanupSessions() {
  try {
    console.log('Cleaning up sessions only...');
    
    // 删除所有sessions
    const deletedSessions = await prisma.session.deleteMany({});
    console.log(`Deleted ${deletedSessions.count} sessions`);
    
    console.log('Session cleanup completed!');
    
  } catch (error) {
    console.error('Error during session cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupSessions();

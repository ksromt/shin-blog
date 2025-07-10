const { PrismaClient } = require('./lib/generated/prisma');
const prisma = new PrismaClient();

async function debugDB() {
  try {
    console.log('=== Users and Accounts ===');
    const usersWithAccounts = await prisma.user.findMany({
      include: {
        accounts: true,
        sessions: true
      }
    });
    
    if (usersWithAccounts.length === 0) {
      console.log('No users found in database');
      return;
    }
    
    usersWithAccounts.forEach(user => {
      console.log(`User: ${user.email} (${user.name})`);
      user.accounts.forEach(account => {
        console.log(`  - Account: ${account.provider} (${account.providerAccountId})`);
      });
      console.log(`  - Sessions: ${user.sessions.length}`);
      console.log('');
    });
    
    console.log('=== Summary ===');
    console.log(`Total users: ${usersWithAccounts.length}`);
    console.log(`Total accounts: ${usersWithAccounts.reduce((sum, user) => sum + user.accounts.length, 0)}`);
    console.log(`Total sessions: ${usersWithAccounts.reduce((sum, user) => sum + user.sessions.length, 0)}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugDB();

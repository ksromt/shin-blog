const { PrismaClient } = require('./lib/generated/prisma');
const prisma = new PrismaClient();

async function fixAccountConflict() {
  try {
    console.log('Fixing account conflict for arkshelter64@gmail.com...');
    
    // 找到冲突的用户
    const user = await prisma.user.findUnique({
      where: { email: 'arkshelter64@gmail.com' },
      include: { accounts: true, sessions: true, guestbook: true }
    });
    
    if (user) {
      console.log(`Found user: ${user.email} with ${user.accounts.length} accounts`);
      
      // 删除用户的留言（如果有）
      if (user.guestbook.length > 0) {
        await prisma.guestbook.deleteMany({
          where: { authorId: user.id }
        });
        console.log(`Deleted ${user.guestbook.length} guestbook entries`);
      }
      
      // 删除用户的sessions
      if (user.sessions.length > 0) {
        await prisma.session.deleteMany({
          where: { userId: user.id }
        });
        console.log(`Deleted ${user.sessions.length} sessions`);
      }
      
      // 删除用户的accounts
      if (user.accounts.length > 0) {
        await prisma.account.deleteMany({
          where: { userId: user.id }
        });
        console.log(`Deleted ${user.accounts.length} accounts`);
      }
      
      // 删除用户
      await prisma.user.delete({
        where: { id: user.id }
      });
      console.log('User deleted successfully');
      
      console.log('Account conflict resolved! GitHub login should work now.');
    } else {
      console.log('No conflicting user found');
    }
    
  } catch (error) {
    console.error('Error fixing account conflict:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixAccountConflict();

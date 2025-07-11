#!/usr/bin/env node

/**
 * 数据清理脚本
 * 用于清除留言板和博客文章数据
 * 
 * 使用方法：
 * node scripts/cleanup-data.js --help
 * node scripts/cleanup-data.js --guestbook
 * node scripts/cleanup-data.js --posts
 * node scripts/cleanup-data.js --all
 */

const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

async function clearGuestbook() {
  console.log('🗑️  清理留言板数据...');
  
  try {
    const result = await prisma.guestbook.deleteMany();
    console.log(`✅ 成功删除 ${result.count} 条留言记录`);
  } catch (error) {
    console.error('❌ 删除留言板数据失败:', error.message);
    throw error;
  }
}

async function clearPosts() {
  console.log('🗑️  清理博客文章数据...');
  
  try {
    // 1. 删除评论（依赖于文章）
    const commentsResult = await prisma.comment.deleteMany();
    console.log(`✅ 删除了 ${commentsResult.count} 条评论`);

    // 2. 删除文章（会自动解除与标签的关联）
    const postsResult = await prisma.post.deleteMany();
    console.log(`✅ 删除了 ${postsResult.count} 篇文章`);

    // 3. 删除孤立的标签（没有关联任何文章的标签）
    const orphanTags = await prisma.tag.findMany({
      where: {
        posts: {
          none: {}
        }
      }
    });

    if (orphanTags.length > 0) {
      const tagsResult = await prisma.tag.deleteMany({
        where: {
          id: {
            in: orphanTags.map(tag => tag.id)
          }
        }
      });
      console.log(`✅ 删除了 ${tagsResult.count} 个孤立标签`);
    } else {
      console.log('✅ 没有孤立标签需要删除');
    }

  } catch (error) {
    console.error('❌ 删除博客数据失败:', error.message);
    throw error;
  }
}

async function clearAll() {
  console.log('🗑️  清理所有数据...\n');
  
  await clearGuestbook();
  console.log('');
  await clearPosts();
  
  console.log('\n✅ 所有数据清理完成！');
}

async function showStatistics() {
  console.log('📊 当前数据统计:');
  
  try {
    const guestbookCount = await prisma.guestbook.count();
    const postsCount = await prisma.post.count();
    const publishedPostsCount = await prisma.post.count({
      where: { published: true }
    });
    const commentsCount = await prisma.comment.count();
    const tagsCount = await prisma.tag.count();

    console.log(`- 留言板记录: ${guestbookCount} 条`);
    console.log(`- 博客文章: ${postsCount} 篇 (已发布: ${publishedPostsCount} 篇)`);
    console.log(`- 评论: ${commentsCount} 条`);
    console.log(`- 标签: ${tagsCount} 个`);
  } catch (error) {
    console.error('❌ 获取统计数据失败:', error.message);
  }
}

function showHelp() {
  console.log(`
🧹 数据清理脚本

用法:
  node scripts/cleanup-data.js [选项]

选项:
  --help          显示帮助信息
  --stats         显示当前数据统计
  --guestbook     仅清理留言板数据
  --posts         仅清理博客文章数据（包括评论和孤立标签）
  --all           清理所有数据（留言板 + 博客文章）

示例:
  node scripts/cleanup-data.js --stats      # 查看数据统计
  node scripts/cleanup-data.js --guestbook  # 只清理留言板
  node scripts/cleanup-data.js --posts      # 只清理博客文章
  node scripts/cleanup-data.js --all        # 清理所有数据

⚠️  警告: 此操作不可逆，请在执行前确保已备份重要数据！
`);
}

async function confirmAction(action) {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(`⚠️  确认要执行 "${action}" 操作吗？此操作不可逆！(yes/no): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes');
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help')) {
    showHelp();
    return;
  }

  if (args.includes('--stats')) {
    await showStatistics();
    return;
  }

  console.log('🧹 数据清理脚本启动\n');

  // 显示当前统计
  await showStatistics();
  console.log('');

  try {
    if (args.includes('--guestbook')) {
      const confirmed = await confirmAction('清理留言板数据');
      if (confirmed) {
        await clearGuestbook();
      } else {
        console.log('❌ 操作已取消');
      }
    } else if (args.includes('--posts')) {
      const confirmed = await confirmAction('清理博客文章数据');
      if (confirmed) {
        await clearPosts();
      } else {
        console.log('❌ 操作已取消');
      }
    } else if (args.includes('--all')) {
      const confirmed = await confirmAction('清理所有数据');
      if (confirmed) {
        await clearAll();
      } else {
        console.log('❌ 操作已取消');
      }
    } else {
      console.log('❌ 未识别的参数，请使用 --help 查看使用说明');
    }
  } catch (error) {
    console.error('❌ 执行失败:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ 脚本执行失败:', error);
    process.exit(1);
  });
}

module.exports = {
  clearGuestbook,
  clearPosts,
  clearAll,
  showStatistics
}; 
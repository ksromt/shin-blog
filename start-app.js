// 确保加载环境变量
require('dotenv').config({ path: '.env.local' });

// 启动 Next.js 应用
const { spawn } = require('child_process');

console.log('Loading environment variables...');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
console.log('GITHUB_ID exists:', !!process.env.GITHUB_ID);
console.log('GOOGLE_CLIENT_ID exists:', !!process.env.GOOGLE_CLIENT_ID);

const child = spawn('npm', ['start'], {
  stdio: 'inherit',
  env: { ...process.env }
});

child.on('exit', (code) => {
  process.exit(code);
});

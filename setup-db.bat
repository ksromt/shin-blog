@echo off
echo 请确保PostgreSQL服务已启动

REM 提示用户输入PostgreSQL用户名和密码
set /p PG_USER=请输入PostgreSQL用户名 (默认 postgres): 
if "%PG_USER%"=="" set PG_USER=postgres

set /p PG_PASS=请输入PostgreSQL密码: 

echo 设置环境变量...
set DATABASE_URL=postgresql://%PG_USER%:%PG_PASS%@localhost:5432/shin_nextjs_blog

echo 创建数据库架构...
npx prisma db push

echo 生成Prisma客户端...
npx prisma generate

echo 完成! 按任意键继续...
pause 
-- 创建数据库（如果不存在）
CREATE DATABASE shin_nextjs_blog;

-- 连接到新创建的数据库
\c shin_nextjs_blog;

-- 确保public模式存在，并授予权限
CREATE SCHEMA IF NOT EXISTS public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- 根据需要添加额外权限
ALTER USER postgres WITH SUPERUSER; 
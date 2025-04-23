
# 作品安装说明

在开始安装之前，请确保已经安装了以下软件：

- **Git**：用于克隆代码仓库
- **Node.js**：推荐版本为`v22.14.0`
- **npm**：推荐版本为`10.9.2`
- **Python**：推荐版本为`3.13`
- **Docker**：用于容器化部署

---

## 前端部分安装

1. **克隆前端代码仓库**：

   ```bash
   git clone https://github.com/JGG0sbp66/reborn_oj_master.git
   ```

2. **安装前端依赖并启动开发服务器**：

   ```bash
   cd reborn_oj_master
   npm install
   npm run dev
   ```

   访问地址：`http://localhost:5173`

---

## 后端部分安装

1. **克隆后端代码仓库**：

   ```bash
   git clone https://github.com/JGG0sbp66/oj_master_api.git
   ```

2. **安装后端依赖**：

   ```bash
   cd oj_master_api
   pip install -r requirements.txt
   ```

3. **数据库配置**：

   - **确保已安装 MySQL**：
     在开始之前，请确保已安装 MySQL，如果尚未安装，可以从 [MySQL官方网站](https://dev.mysql.com/downloads/) 下载并安装。

   - **配置 MySQL**：
     - 修改 MySQL 的端口号为 `3308`，确保 MySQL 的账号为 `root`，密码为空
     - 创建 `reborn_oj_master` 数据库：

       ```sql
       CREATE DATABASE reborn_oj_master;
       ```

     - 导入 `reborn_oj_master.sql` 文件：

4. **安装 Redis 并启动定时任务**：

   - **确保已安装 Docker**：
     在开始之前，请确保已安装 Docker，如果尚未安装，可以从 [Docker 官方网站](https://www.docker.com/products/docker-desktop) 下载并安装。

   - **拉取 Redis 镜像**：
     打开命令提示符或终端，运行以下命令以拉取 Redis 的 Docker 镜像：

     ```bash
     docker pull redis
     ```

   - **启动 Redis 容器**：
     拉取完成后，运行以下命令以启动 Redis 服务：

     ```bash
     docker run --name my-redis -d -p 6379:6379 redis redis-server --appendonly yes
     ```

   - **启动定时任务**：
     - 双击 `start_celery.bat` 文件。
     - 或在 `终端` 中输入以下命令手动运行：

       ```bash
       celery -A app.extensions.celery worker --pool=solo --loglevel=info
       celery -A app.extensions.celery beat --loglevel=info
       ```

---

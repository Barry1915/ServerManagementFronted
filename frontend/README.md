# 服务器管理系统前端（Vue 3）

## 开发启动

```bash
cd frontend
npm install
npm run dev
```

默认开启 Mock（可直接体验界面），账号可用 `admin/admin`。

## 对接后端

修改 `frontend/.env.development`：

- `VITE_USE_MOCK=false`
- `VITE_API_BASE_URL=http://你的后端地址`

目前前端默认约定的接口（你可以按后端实际情况修改 `src/api/*`）：

- `POST /api/auth/login`：登录，返回 `{ token, user }`
- `GET /api/servers`：服务器列表
- `GET /api/servers/:id`：服务器详情
- `POST /api/servers`：新增服务器
- `PUT /api/servers/:id`：更新服务器
- `DELETE /api/servers/:id`：删除服务器
- `GET /api/servers/:id/metrics?range=1h|6h|24h`：监控曲线

## 构建

```bash
cd frontend
npm run build
```

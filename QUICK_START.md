# Quick Start Guide

## ⚡ Start Both Services

### Terminal 1 - Backend
```bash
cd backend/backend
node index.js
```
Expected output:
```
✅ Connected to MongoDB
🚀 Server is running on http://localhost:3001
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
Expected output:
```
  ➜  Local:   http://localhost:5173/
```

## 🧪 Quick Test

1. Open browser → http://localhost:5173
2. Go to Admin Dashboard
3. Click "Manajemen Anak"
4. Should see children loaded from MongoDB with statuses:
   - Yellow "Pending" for children awaiting approval
   - Green "Terdaftar" for approved children

## 📊 Admin Pages Status

| Page | Status | Features |
|------|--------|----------|
| Manajemen Anak | ✅ | Approve/Reject/Delete children |
| Manajemen Tagihan | ✅ | Create & track billing |
| Kelola Keluhan | ✅ | Track complaint workflow |
| Dashboard | ⚠️ | Mock data (optional to integrate) |

## 🔌 API Endpoints (All Working)

### Children
- `GET /children` - List all children
- `POST /children` - Create new child
- `PATCH /children/:id` - Update child (including approval)
- `DELETE /children/:id` - Delete child

### Billing
- `GET /tagihan` - List billings
- `POST /tagihan` - Create invoice
- `PATCH /tagihan/:id` - Update invoice

### Complaints
- `GET /jadwalPerawatan` - List complaints
- `POST /jadwalPerawatan` - Create complaint
- `PATCH /jadwalPerawatan/:id` - Update status

## 🧬 Key Components

**ManageChildrenPage.tsx**
- Fetches from: `GET /children`
- Updates via: `PATCH /children/:id`
- Deletes via: `DELETE /children/:id`

**ManageBillingPage.tsx**
- Fetches children: `GET /children`
- Fetches billings: `GET /tagihan`

**ManageComplaintsPage.tsx**
- Fetches complaints: `GET /jadwalPerawatan`
- Updates status: `PATCH /jadwalPerawatan/:id`

## 🆘 Troubleshooting

### Backend not connecting to MongoDB
```
Check credentials in backend/backend/index.js
MongoDB URL: mongodb+srv://zidane06sa:Unicaca123@cluster0.nohu2ep.mongodb.net/RPL
```

### Frontend can't reach backend
```
Check if backend is running on port 3001
API base URL: http://localhost:3001
```

### No data showing
```
1. Check browser console for errors
2. Check backend terminal for MongoDB queries
3. Verify data exists in MongoDB collection
```

## 📝 Next Steps (Optional)

- [ ] Integrate Parent Dashboard
- [ ] Integrate Teacher Dashboard
- [ ] Setup authentication
- [ ] Add file upload for proofs
- [ ] Setup environment variables

---

**All critical admin features integrated and working!** ✅

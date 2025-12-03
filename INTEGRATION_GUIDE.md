# Backend-Frontend Integration Guide

## Status: ✅ FULLY INTEGRATED

Backend dan Frontend sudah terintegrasi dengan real API calls.

## Integrated Components

### Admin Pages
1. **ManageChildrenPage** ✅
   - Fetch children from MongoDB
   - Approve/Reject/Delete operations
   - Real-time status updates

2. **ManageBillingPage** ✅
   - Fetch approved children
   - Load billings from `/tagihan` endpoint
   - Verify payments
   - Real-time billing updates

3. **ManageComplaintsPage** ✅
   - Fetch complaints from `/jadwalPerawatan` endpoint  
   - Update complaint status (new → in_progress → completed)
   - Real-time status tracking

## Backend (Node.js + Express + MongoDB)

### Running Backend
```bash
cd backend/backend
node index.js
# Server runs on http://localhost:3001
```

### API Endpoints

#### Children Management
- **POST** `/children` - Create new child
- **GET** `/children` - Get all children
- **GET** `/children/:id` - Get child by ID
- **PATCH** `/children/:id` - Update child (including status approval)
- **DELETE** `/children/:id` - Delete child

#### Billing/Tagihan
- **POST** `/tagihan` - Create invoice
- **GET** `/tagihan` - Get all invoices
- **GET** `/tagihan/:id` - Get invoice by ID
- **PATCH** `/tagihan/:id` - Update invoice
- **DELETE** `/tagihan/:id` - Delete invoice
- **POST** `/tagihan/:id/upload-proof` - Upload payment proof

#### Complaints/Jadwal Perawatan  
- **POST** `/jadwalPerawatan` - Create complaint
- **GET** `/jadwalPerawatan` - Get all complaints
- **GET** `/jadwalPerawatan/:id` - Get complaint by ID
- **PATCH** `/jadwalPerawatan/:id` - Update complaint status
- **DELETE** `/jadwalPerawatan/:id` - Delete complaint

#### Others
- **GET** `/user` - Get all users
- **GET** `/laporanHarian` - Get daily reports
- **GET** `/rencanaPembelajaran` - Get learning plans

## Frontend (React + TypeScript + Vite)

### Running Frontend
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

### Integration Points

#### API Calls
All API calls defined in `src/lib/api.ts`:
- `getAllChildren()` - Fetch children
- `updateChild(id, payload)` - Update child status
- `deleteChild(id)` - Delete child
- `getAllTagihan()` - Fetch billings
- `getComplaints()` - Fetch complaints
- `updateComplaint(id, payload)` - Update complaint status

#### Components Using Real API

**Admin Components:**
1. `ManageChildrenPage.tsx` - Uses `getAllChildren()`, `updateChild()`, `deleteChild()`
2. `ManageBillingPage.tsx` - Uses `getAllChildren()`, `getAllTagihan()`
3. `ManageComplaintsPage.tsx` - Uses `getComplaints()`, `updateComplaint()`

**Data Mapping:**
- Frontend interface matches MongoDB schema field names
- ID field: `_id` (MongoDB ObjectId)
- Child fields: namaLengkap, jenisKelamin (L/P), tanggalLahir, kelas, alamat
- Billing fields: anak, deskripsi, jumlah, tanggal_jatuh_tempo, status
- Complaint fields: deskripsi, status

## Database Schemas

### Child (Anak)
```javascript
{
  _id: ObjectId,
  user: ObjectId (parent reference),
  namaLengkap: String,
  jenisKelamin: 'L' | 'P',
  tanggalLahir: Date,
  kelas: String,
  alamat: String,
  kondisi_khusus: String,
  status: 'pending' | 'approved' | 'rejected',
  createdAt: Date,
  updatedAt: Date
}
```

### Billing (Tagihan)
```javascript
{
  _id: ObjectId,
  anak: ObjectId (child reference),
  deskripsi: String,
  jumlah: Number,
  tanggal_jatuh_tempo: Date,
  status: 'paid' | 'unpaid' | 'pending_verification',
  bukti_pembayaran: String (optional),
  createdAt: Date
}
```

### Complaint (Jadwal Perawatan)
```javascript
{
  _id: ObjectId,
  deskripsi: String,
  status: 'new' | 'in_progress' | 'completed',
  created_by: ObjectId,
  createdAt: Date
}
```

## Testing Flow

### 1. Start Backend
```bash
cd backend/backend
node index.js
```
Check MongoDB connection message in console.

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Test Admin Dashboard

#### Test Child Management:
1. Navigate to Admin Dashboard → Manajemen Anak
2. Should load children from MongoDB (status: pending & approved)
3. Click "Terima" to approve (updates status to 'approved')
4. Click "Tolak" to reject (updates status to 'rejected')
5. Click "Hapus" to delete from system

#### Test Billing:
1. Navigate to Admin Dashboard → Manajemen Tagihan
2. Should load approved children
3. Should display billings from MongoDB
4. Click "Buat Tagihan" to create new invoice
5. Select child and submit

#### Test Complaints:
1. Navigate to Admin Dashboard → Kelola Keluhan
2. Should load complaints by status (Baru, Sedang Dikerjakan, History Selesai)
3. Click "Tandai Dikerjakan" to update status
4. Click "Tandai Selesai" for completion

## Error Handling

- All components have error toast notifications
- Loading states while fetching data
- Token-based authentication supported (Authorization header)
- Fallback to error messages if API fails

## Notes

- CORS enabled on backend for all origins (`*`)
- All requests include `Content-Type: application/json`
- Authorization token stored in localStorage
- All responses follow `{ success: boolean, data: any, message?: string }` format
- Timestamps in ISO format

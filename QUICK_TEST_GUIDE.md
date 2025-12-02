# Quick Test Guide - Admin Billing 🚀

## 5-Minute Verification

### 1. Backend Check (30 seconds)
```powershell
# Test API is running
$response = Invoke-WebRequest -Uri 'http://localhost:3001/children' -ErrorAction SilentlyContinue
Write-Host "Status: $($response.StatusCode)"  # Should show: 200
```

### 2. Frontend Build Check (1 min)
```powershell
cd c:\Users\ASUS\Downloads\RPL\frontend
npm run build  # Should complete with 0 errors
```

### 3. Manual Test (3 mins)

**In Browser:**
```
1. Go to Admin Dashboard
2. Click "Manajemen Tagihan" (Billing Management)
3. Click "Buat Tagihan Baru" (Create New Invoice)
4. Fill form:
   Anak: Pick any student
   Periode: "SPP Bulan Januari"
   Nominal: 500000
   Tanggal Jatuh Tempo: Pick any date
5. Click "Buat Tagihan"
6. Expected: Green toast "Tagihan berhasil dibuat!"
7. New billing card appears below
```

---

## What to Check

### ✅ Success Indicators
- [ ] Form appears when clicking "Buat Tagihan Baru"
- [ ] All 4 input fields visible and editable
- [ ] Submit button works without errors
- [ ] Green success message appears
- [ ] New billing card displays below form
- [ ] Card shows correct Periode, Nominal, Due Date
- [ ] Status badge shows "Belum Dibayar" (red)

### ❌ Error Indicators
- [ ] Form doesn't appear → Check browser console (F12)
- [ ] "Cannot find name..." error → Missing imports
- [ ] Blank values in display → Wrong field name references
- [ ] Toast shows error → API call failed
- [ ] Nothing happens on submit → Check Network tab

---

## Database Verification (MongoDB Atlas)

1. Go to: https://cloud.mongodb.com/
2. Select "taman_kanak" database
3. Click "tagihan" collection
4. Find newest document (sort by `_id` descending)
5. Should see:
   ```
   {
     "_id": ObjectId(...),
     "anak": ObjectId(...),           ← ✅ Correct field
     "nominal": 500000,               ← ✅ Correct field
     "periode": "SPP Bulan Januari",  ← ✅ Correct field
     "tanggalJatuhTempo": Date(...),  ← ✅ Correct field
     "status": "unpaid",
     "createdAt": Date(...),
     "updatedAt": Date(...)
   }
   ```

---

## Browser DevTools Checks

### Console (F12 → Console Tab)
```javascript
// Should see: (no red errors)
// May see: warnings about Radix UI (non-critical)
```

### Network (F12 → Network Tab)
1. Click "Buat Tagihan"
2. Watch for POST request to: `http://localhost:3001/tagihan`
3. Check Request Body:
   ```json
   {
     "anak": "507f1f77bcf86cd799439011",
     "nominal": "500000",
     "periode": "SPP Bulan Januari",
     "tanggalJatuhTempo": "2025-01-31"
   }
   ```
4. Check Response (should be 200):
   ```json
   {
     "success": true,
     "data": { /* full document */ },
     "message": "Tagihan created successfully"
   }
   ```

---

## TypeScript Compilation

```powershell
# Check for errors
cd c:\Users\ASUS\Downloads\RPL\frontend
npx tsc --noEmit

# Expected: No output (means no errors)
# If errors: Check ManageBillingPage.tsx for import/type issues
```

---

## Field Name Reference

### ✅ Correct Usage
```typescript
// Form state
{ anak, nominal, periode, tanggalJatuhTempo }

// Display
{bill.anak}
{bill.nominal}
{bill.periode}
{bill.tanggalJatuhTempo}

// API payload
createTagihan({ anak, nominal, periode, tanggalJatuhTempo })
```

### ❌ Wrong (Old) Usage
```typescript
// These will cause errors:
{ childId, amount, description, dueDate }    // ❌ Wrong field names
bill.jumlah                                   // ❌ Not in schema
bill.bukti_pembayaran                         // ❌ Should be paymentProofUrl
bill.deskripsi                                // ❌ Should be periode
```

---

## Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot find name 'createTagihan'" | Add to imports: `createTagihan, updateTagihan` |
| Form doesn't appear | Check browser console for error, refresh page |
| Billing not showing in list | Check API response in Network tab, verify nominal is number |
| Date shows "Invalid Date" | Backend must return ISO format (YYYY-MM-DD) |
| Status shows wrong value | Check status filter logic, should be `pending-verification` with hyphen |
| Backend returns 500 error | Check MongoDB connection, verify fields in POST body |

---

## Performance Baseline

| Operation | Expected Time |
|-----------|---------------|
| Form load | < 200ms |
| Submit/Create | < 500ms |
| Display refresh | < 300ms |
| Database write | MongoDB automatic |

---

## Log Analysis

### Frontend Logs
```
✅ Normal flow:
[ManageBillingPage] Loading data...
[API] Calling POST /tagihan
[API] Response: { success: true, data: {...} }
[Toast] Tagihan berhasil dibuat!

❌ Error flow:
[API] Response: { success: false, message: "..." }
[Toast] Gagal membuat tagihan
```

### Backend Logs (if available)
```
POST /tagihan
  Received: { anak, nominal, periode, tanggalJatuhTempo }
  Validation: ✅ PASS
  MongoDB: Document inserted with ID: 507f...
  Response: 200 OK
```

---

## Files to Review

If something breaks:
1. `src/components/admin/ManageBillingPage.tsx` - Main component
2. `src/lib/api.ts` - API functions
3. `backend/src/models/TagihanSchema.js` - Expected schema
4. `backend/src/controllers/tagihanController.js` - Business logic

---

## Status Dashboard

| Component | Status | Tested |
|-----------|--------|--------|
| Form rendering | ✅ Ready | Yes |
| Form validation | ✅ Ready | Yes |
| API call | ✅ Ready | Yes |
| Database persist | ✅ Ready | Yes |
| Display rendering | ✅ Ready | Yes |
| Payment verify | ✅ Ready | No* |
| Delete billing | ✅ Ready | No* |

*Need manual testing

---

**Last Updated:** After ManageBillingPage full integration
**Status:** Ready for production testing ✅

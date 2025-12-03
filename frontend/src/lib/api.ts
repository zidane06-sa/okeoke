const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'; // Backend URL from env or fallback to localhost

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_URL}/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function getChild(childId: string) {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(`${API_URL}/children/${childId}`, {
    headers,
  });
  return res.json();
}

export async function getAllChildren() {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(`${API_URL}/children`, {
    headers,
  });
  return res.json();
}

export async function createChild(payload: any) {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(`${API_URL}/children`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function updateChild(childId: string, payload: any) {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(`${API_URL}/children/${childId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function deleteChild(childId: string) {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(`${API_URL}/children/${childId}`, {
    method: 'DELETE',
    headers,
  });
  return res.json();
}

// Complaints API (using jadwalPerawatan endpoint)
export async function createComplaint(payload: any) {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(`${API_URL}/jadwalPerawatan`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function getComplaints(createdBy?: string) {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  let url = `${API_URL}/jadwalPerawatan`;
  if (createdBy) url += `?createdBy=${createdBy}`;
  
  const res = await fetch(url, { headers });
  return res.json();
}

export async function getComplaint(complaintId: string) {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(`${API_URL}/jadwalPerawatan/${complaintId}`, { headers });
  return res.json();
}

export async function updateComplaint(complaintId: string, payload: any) {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(`${API_URL}/jadwalPerawatan/${complaintId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function deleteComplaint(complaintId: string) {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(`${API_URL}/jadwalPerawatan/${complaintId}`, {
    method: 'DELETE',
    headers,
  });
  return res.json();
}

// Daily Reports API (Laporan Harian)
export async function getDailyReports(anakId?: string) {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  let url = `${API_URL}/laporanHarian`;
  if (anakId) url += `?anakId=${anakId}`;
  
  const res = await fetch(url, { headers });
  return res.json();
}

export async function getDailyReport(reportId: string) {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(`${API_URL}/laporanHarian/${reportId}`, { headers });
  return res.json();
}

export async function createDailyReport(payload: any) {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(`${API_URL}/laporanHarian`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function updateDailyReport(reportId: string, payload: any) {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(`${API_URL}/laporanHarian/${reportId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function deleteDailyReport(reportId: string) {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(`${API_URL}/laporanHarian/${reportId}`, {
    method: 'DELETE',
    headers,
  });
  return res.json();
}

// Learning Plans API (Rencana Pembelajaran)
export async function getLearningPlans(anakId?: string) {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  let url = `${API_URL}/rencanaPembelajaran`;
  if (anakId) url += `?anakId=${anakId}`;
  
  const res = await fetch(url, { headers });
  return res.json();
}

export async function getLearningPlan(planId: string) {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(`${API_URL}/rencanaPembelajaran/${planId}`, { headers });
  return res.json();
}

export async function createLearningPlan(payload: any) {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(`${API_URL}/rencanaPembelajaran`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function updateLearningPlan(planId: string, payload: any) {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(`${API_URL}/rencanaPembelajaran/${planId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function deleteLearningPlan(planId: string) {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(`${API_URL}/rencanaPembelajaran/${planId}`, {
    method: 'DELETE',
    headers,
  });
  return res.json();
}

// User API - Get all users (for counting teachers)
export async function getAllUsers() {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(`${API_URL}/user`, {
    headers,
  });
  return res.json();
}

// Billing API - Get all tagihan (for counting unpaid)
export async function getAllTagihan() {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(`${API_URL}/tagihan`, {
    headers,
  });
  return res.json();
}

export async function createTagihan(payload: any) {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(`${API_URL}/tagihan`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function updateTagihan(tagihanId: string, payload: any) {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(`${API_URL}/tagihan/${tagihanId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function deleteTagihan(tagihanId: string) {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(`${API_URL}/tagihan/${tagihanId}`, {
    method: 'DELETE',
    headers,
  });
  return res.json();
}

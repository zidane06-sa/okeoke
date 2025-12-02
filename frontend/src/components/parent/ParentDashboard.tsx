import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/authContext';
import type { Child } from '../../types';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Baby,
  Plus,
  CreditCard,
  AlertCircle,
  Video,
  Calendar,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

interface ParentDashboardProps {
  onNavigate: (page: string, childId?: string) => void;
}

export function ParentDashboard({ onNavigate }: ParentDashboardProps) {
  const { user } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayName = user?.fullName || (user as any)?.name || user?.email || 'Nama belum tersedia';

  useEffect(() => {
    if (!user?.id) {
      // kosongkan list saat belum ada user
      setChildren([]);
      return;
    }

    const controller = new AbortController();
    const fetchChildren = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const url = `http://localhost:3001/children?parentId=${encodeURIComponent(user.id)}`;
        const res = await fetch(url, {
          method: 'GET',
          headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
          signal: controller.signal,
        });

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || res.statusText);
        }

        const body = await res.json();
        const dbList = Array.isArray(body) ? body : (body.data || []);
        const mapped: Child[] = dbList.map((c: any) => ({
          id: c._id || c.id || '',
          fullName: c.namaLengkap || c.fullName || c.name || '',
          dateOfBirth: c.tanggalLahir ? new Date(c.tanggalLahir).toISOString() : (c.dateOfBirth || ''),
          gender: c.jenisKelamin === 'L' ? 'male' : (c.jenisKelamin === 'P' ? 'female' : (c.gender || 'male')),
          address: c.alamat || c.address || '',
          specialConditions: c.kondisi_khusus || c.specialConditions || '',
          allergies: c.allergies || '',
          class: c.kelas || c.class || '',
          parentId: (c.user && (c.user._id || c.user)) || c.parentId || '',
          status: c.status || 'pending',
          photoUrl: c.photoUrl || ''
        }));
        setChildren(mapped);
      } catch (err: any) {
        if (err.name !== 'AbortError') setError(err.message || 'Gagal memuat data');
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
    return () => controller.abort();
  }, [user?.id]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-700"><CheckCircle className="w-3 h-3 mr-1" />Terdaftar</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700"><Clock className="w-3 h-3 mr-1" />Menunggu Verifikasi</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700"><XCircle className="w-3 h-3 mr-1" />Ditolak</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Dashboard Orang Tua</h1>
          <p className="text-gray-600">Selamat datang, {displayName}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200"
            onClick={() => onNavigate('parent-register-child')}
          >
            <div className="bg-pink-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-1">Daftarkan Anak</h3>
            <p className="text-sm text-gray-600">Tambah anak baru</p>
          </Card>

          <Card
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
            onClick={() => onNavigate('parent-billing')}
          >
            <div className="bg-purple-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-1">Tagihan</h3>
            <p className="text-sm text-gray-600">Lihat & bayar tagihan</p>
          </Card>

          <Card
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
            onClick={() => onNavigate('parent-complaints')}
          >
            <div className="bg-blue-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-1">Keluhan</h3>
            <p className="text-sm text-gray-600">Laporkan keluhan</p>
          </Card>

          <Card
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-green-50 to-green-100 border-green-200"
            onClick={() => onNavigate('parent-cctv')}
          >
            <div className="bg-green-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Video className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-1">CCTV</h3>
            <p className="text-sm text-gray-600">Lihat streaming</p>
          </Card>
        </div>

        {/* Children List */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl">Anak Terdaftar</h2>
            <Button onClick={() => onNavigate('parent-register-child')} className="gap-2 bg-gradient-to-r from-pink-400 to-purple-400">
              <Plus className="w-4 h-4" /> Daftarkan Anak
            </Button>
          </div>

          {loading ? (
            <Card className="p-12 text-center">Memuat...</Card>
          ) : error ? (
            <Card className="p-6 text-center text-red-600">Error: {error}</Card>
          ) : children.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="bg-gray-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Baby className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="mb-2">Belum ada anak terdaftar</h3>
              <p className="text-gray-600 mb-6">Daftarkan anak Anda untuk memulai</p>
              <Button onClick={() => onNavigate('parent-register-child')} className="gap-2 bg-gradient-to-r from-pink-400 to-purple-400">
                <Plus className="w-4 h-4" /> Daftarkan Anak Sekarang
              </Button>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {children.map(child => (
                <Card key={child.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-32 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 flex items-center justify-center">
                    <Baby className="w-16 h-16 text-white" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="mb-1">{child.fullName}</h3>
                        <p className="text-sm text-gray-600">{child.class || 'Belum ditentukan'}</p>
                      </div>
                      {getStatusBadge(child.status)}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{child.dateOfBirth ? new Date(child.dateOfBirth).toLocaleDateString('id-ID') : '-'}</span>
                      </div>
                    </div>

                    {child.status === 'approved' ? (
                      <div className="grid grid-cols-3 gap-2">
                        <Button onClick={() => onNavigate('parent-child-profile', child.id)} className="text-xs">Profil</Button>
                        <Button onClick={() => onNavigate('parent-daily-reports', child.id)} className="text-xs">Laporan</Button>
                        <Button onClick={() => onNavigate('parent-learning-plans', child.id)} className="text-xs">Rencana</Button>
                      </div>
                    ) : (
                      <Button onClick={() => onNavigate('parent-child-profile', child.id)} className="w-full">Lihat Detail</Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
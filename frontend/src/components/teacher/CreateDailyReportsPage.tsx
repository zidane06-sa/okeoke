import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/authContext';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { createDailyReport, getAllChildren } from '../../lib/api';

interface CreateDailyReportsPageProps {
  onNavigate: (page: string) => void;
}

export function CreateDailyReportsPage({ onNavigate }: CreateDailyReportsPageProps) {
  const { user } = useAuth();
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [catatanAktivitas, setCatatanAktivitas] = useState('');
  const [catatanKhusus, setCatatanKhusus] = useState('');
  const [fotoKegiatanURL, setFotoKegiatanURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    try {
      setLoading(true);
      const res = await getAllChildren();
      let childrenList = [];
      
      if (Array.isArray(res)) {
        childrenList = res;
      } else if (res?.data && Array.isArray(res.data)) {
        childrenList = res.data;
      }
      
      // Map namaLengkap to fullName
      const mapped = childrenList.map((child: any) => ({
        ...child,
        fullName: child.fullName || child.namaLengkap || 'Unknown',
      }));
      
      setChildren(mapped);
    } catch (error) {
      console.error('Error loading children:', error);
      setChildren([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedChildId || !catatanAktivitas) {
      alert('Isi anak didik dan aktivitas harian');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        anakId: selectedChildId,
        userId: user?.id,
        tanggal: selectedDate,
        catatanAktivitas,
        catatanKhusus,
        fotoKegiatanURL,
      };

      console.log('Submitting daily report:', payload);
      const res = await createDailyReport(payload);
      console.log('Response:', res);

      if (res && res.data) {
        alert('Laporan harian berhasil disimpan!');
        // Reset form
        setSelectedChildId('');
        setCatatanAktivitas('');
        setCatatanKhusus('');
        setFotoKegiatanURL('');
        setSelectedDate(new Date().toISOString().split('T')[0]);
      } else {
        alert('Gagal menyimpan laporan harian');
      }
    } catch (error: any) {
      console.error('Error:', error);
      alert('Error menyimpan laporan');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => onNavigate('teacher-dashboard')} className="mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl mb-2">Laporan Harian</h1>
          <p className="text-gray-600">Isi laporan aktivitas harian siswa</p>
        </div>

        {/* Form */}
        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <div>
              <Label>Anak Didik *</Label>
              <Select value={selectedChildId} onValueChange={(value: string) => setSelectedChildId(value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Pilih anak didik" />
                </SelectTrigger>
                <SelectContent>
                  {children.length > 0 ? (
                    children.map((child: any) => {
                      const childId = String(child._id || child.id || '');
                      return (
                        <SelectItem key={childId} value={childId}>
                          {child.fullName}
                        </SelectItem>
                      );
                    })
                  ) : (
                    <SelectItem value="no-children" disabled>
                      {loading ? 'Loading...' : 'Tidak ada anak didik'}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Tanggal</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e: any) => setSelectedDate(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Aktivitas Harian *</Label>
              <Textarea
                value={catatanAktivitas}
                onChange={(e: any) => setCatatanAktivitas(e.target.value)}
                placeholder="Jelaskan aktivitas anak hari ini..."
                className="mt-1"
                rows={4}
              />
            </div>

            <div>
              <Label>Catatan Khusus</Label>
              <Textarea
                value={catatanKhusus}
                onChange={(e: any) => setCatatanKhusus(e.target.value)}
                placeholder="Catatan tambahan (opsional)"
                className="mt-1"
                rows={2}
              />
            </div>

            <div>
              <Label>URL Foto Kegiatan</Label>
              <Input
                type="text"
                value={fotoKegiatanURL}
                onChange={(e: any) => setFotoKegiatanURL(e.target.value)}
                placeholder="Paste URL foto kegiatan (opsional)"
                className="mt-1"
              />
            </div>

            <Button 
              onClick={handleSubmit} 
              disabled={submitting}
              className="w-full bg-gradient-to-r from-pink-400 to-purple-400" 
              size="lg"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Laporan'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

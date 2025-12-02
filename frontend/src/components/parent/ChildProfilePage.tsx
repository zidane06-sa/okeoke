// ...existing code...
import { useEffect, useState } from 'react';
import { ArrowLeft, Edit2, Save, X } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { getChild, createChild, updateChild } from '../../lib/api';
import { useAuth } from '../../lib/authContext';
import type { Child } from '../../types';

// ...existing code...

interface ChildProfilePageProps {
  childId: string;
  onNavigate: (page: string) => void;
}

export function ChildProfilePage({ childId, onNavigate }: ChildProfilePageProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Child | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!childId) {
        // If no childId, initialize empty form for new child
        setFormData({
          id: '',
          parentId: user?.id || '',
          fullName: '',
          dateOfBirth: '',
          gender: 'male',
          class: '',
          address: '',
          specialConditions: '',
          allergies: '',
          status: 'pending'
        });
        return;
      }
      
      try {
        const res = await getChild(childId);
        if (!mounted) return;
        
        if (res && res.success && res.data) {
          const d = res.data;
          console.log('Fetched child data:', d); // Debug log
          setFormData({
            id: d._id || '',
            parentId: user?.id || '',
            fullName: d.namaLengkap || '',
            dateOfBirth: d.tanggalLahir ? new Date(d.tanggalLahir).toISOString().slice(0, 10) : '',
            gender: d.jenisKelamin === 'L' ? 'male' : 'female',
            class: d.kelas || '',
            address: d.alamat || '',
            specialConditions: d.kondisi_khusus || '',
            allergies: d.alergi || '',
            status: d.status || 'pending'
          });
        } else {
          // fallback: empty form (create)
          console.warn('No data received from server:', res);
          setFormData({
            id: '',
            parentId: user?.id || '',
            fullName: '',
            dateOfBirth: '',
            gender: 'male',
            class: '',
            address: '',
            specialConditions: '',
            allergies: '',
            status: 'pending'
          });
        }
      } catch (e) {
        console.error('Error loading child data:', e);
        setFormData({
          id: '',
          parentId: '',
          fullName: '',
          dateOfBirth: '',
          gender: 'male',
          class: '',
          address: '',
          specialConditions: '',
          allergies: '',
          status: 'pending'
        });
      }
    }
    load();
    return () => { mounted = false; };
  }, [childId]);

  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  const handleChange = (field: keyof Child, value: any) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : prev);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (!user) {
        alert('User tidak ditemukan. Silahkan login terlebih dahulu.');
        setLoading(false);
        return;
      }

      const payload = {
        user: user.id,
        namaLengkap: formData.fullName,
        tanggalLahir: formData.dateOfBirth,
        jenisKelamin: formData.gender === 'male' ? 'L' : 'P',
        alamat: formData.address,
        kelas: formData.class || '',
        kondisi_khusus: formData.specialConditions || ''
      };

      let res;
      if (formData.id) {
        res = await updateChild(formData.id, payload);
      } else {
        res = await createChild(payload);
      }

      if (res && res.success) {
        const saved = res.data;
        setFormData(prev => prev ? ({
          ...prev,
          id: saved._id || prev.id,
          status: saved.status || prev.status
        }) : prev);
        alert('Data tersimpan di server.');
        setIsEditing(false);
      } else {
        alert(res?.message || 'Gagal menyimpan data');
      }
    } catch (err: any) {
      alert(err?.message || 'Terjadi error saat menyimpan');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // kalau ada id, reload dari server; kalau belum, clear
    if (formData.id) {
      (async () => {
        const res = await getChild(formData.id as string);
        if (res && res.success && res.data) {
          const d = res.data;
          setFormData({
            id: d._id,
            parentId: user?.id || '',
            fullName: d.namaLengkap || '',
            dateOfBirth: (d.tanggalLahir ? new Date(d.tanggalLahir).toISOString().slice(0,10) : ''),
            gender: d.jenisKelamin === 'L' ? 'male' : 'female',
            class: d.kelas || '',
            address: d.alamat || '',
            specialConditions: d.kondisi_khusus || '',
            allergies: '',
            status: d.status || 'pending'
          });
        }
      })();
    } else {
      setFormData({
        id: '',
        parentId: user?.id || '',
        fullName: '',
        dateOfBirth: '',
        gender: 'male',
        class: '',
        address: '',
        specialConditions: '',
        allergies: '',
        status: 'pending'
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" onClick={() => onNavigate('parent-dashboard')} className="mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Button>

        <Card className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl mb-2">Profil Anak</h1>
              <div className="flex gap-2">
                {formData.status === 'approved' && <Badge className="bg-green-100 text-green-700">Terdaftar</Badge>}
                {formData.status === 'pending' && <Badge className="bg-yellow-100 text-yellow-700">Menunggu</Badge>}
                {formData.status === 'rejected' && <Badge className="bg-red-100 text-red-700">Ditolak</Badge>}
              </div>
            </div>

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} size="sm" className="gap-2" disabled={loading}>
                    <Save className="w-4 h-4" /> {loading ? 'Menyimpan...' : 'Simpan'}
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm" className="gap-2">
                    <X className="w-4 h-4" /> Batal
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="gap-2">
                  <Edit2 className="w-4 h-4" /> Edit
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Nama Lengkap</Label>
                <Input value={formData.fullName} onChange={(e) => handleChange('fullName', e.target.value)} disabled={!isEditing} className="mt-1" />
              </div>
              <div>
                <Label>Tanggal Lahir</Label>
                <Input type="date" value={formData.dateOfBirth} onChange={(e) => handleChange('dateOfBirth', e.target.value)} disabled={!isEditing} className="mt-1" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Jenis Kelamin</Label>
                <select value={formData.gender} onChange={(e) => handleChange('gender', e.target.value as 'male'|'female')} disabled={!isEditing} className="w-full mt-1 h-10 rounded-md border px-3 py-2">
                  <option value="male">Laki-laki</option>
                  <option value="female">Perempuan</option>
                </select>
              </div>
              <div>
                <Label>Kelas</Label>
                <Input value={formData.class || ''} onChange={(e) => handleChange('class', e.target.value)} disabled={!isEditing} className="mt-1" />
              </div>
            </div>

            <div>
              <Label>Alamat</Label>
              <Input value={formData.address} onChange={(e) => handleChange('address', e.target.value)} disabled={!isEditing} className="mt-1" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Kondisi Khusus</Label>
                <Input value={formData.specialConditions || ''} onChange={(e) => handleChange('specialConditions', e.target.value)} disabled={!isEditing} className="mt-1" />
              </div>
              <div>
                <Label>Alergi</Label>
                <Input value={formData.allergies || ''} onChange={(e) => handleChange('allergies', e.target.value)} disabled={!isEditing} className="mt-1" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
// ...existing code...
import React, { useState } from 'react';
import { useAuth } from '../../lib/authContext';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ArrowLeft, UserPlus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface RegisterChildPageProps {
  onNavigate: (page: string) => void;
}

export function RegisterChildPage({ onNavigate }: RegisterChildPageProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    namaLengkap: '',
    tanggalLahir: '',
    jenisKelamin: 'L',
    alamat: '',
    kondisi_khusus: '',
    kelas: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi frontend - minLength 3 karakter
    if (!formData.namaLengkap?.trim() || formData.namaLengkap.trim().length < 3) {
      toast.error('Nama lengkap anak minimal 3 karakter');
      return;
    }
    if (!formData.tanggalLahir?.trim()) {
      toast.error('Tanggal lahir harus diisi');
      return;
    }
    if (!formData.jenisKelamin?.trim()) {
      toast.error('Jenis kelamin harus dipilih');
      return;
    }
    if (!formData.alamat?.trim() || formData.alamat.trim().length < 5) {
      toast.error('Alamat minimal 5 karakter');
      return;
    }
    if (!formData.kelas?.trim() || formData.kelas.trim().length < 3) {
      toast.error('Kelas minimal 3 karakter');
      return;
    }

    if (!user?.id) {
      toast.error('User ID tidak ditemukan. Silakan login kembali');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        user: user.id,
        namaLengkap: formData.namaLengkap.trim(),
        tanggalLahir: formData.tanggalLahir.trim(),
        jenisKelamin: formData.jenisKelamin.trim(),
        alamat: formData.alamat.trim(),
        kondisi_khusus: formData.kondisi_khusus?.trim() || '',
        kelas: formData.kelas.trim(),
      };

      console.log('Sending payload:', JSON.stringify(payload, null, 2));

      const response = await fetch('http://localhost:3001/children', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', data);

      if (response.ok && data.success) {
        toast.success('Pendaftaran anak berhasil! Menunggu verifikasi admin.');
        setFormData({
          namaLengkap: '',
          tanggalLahir: '',
          jenisKelamin: 'L',
          alamat: '',
          kondisi_khusus: '',
          kelas: '',
        });
        setTimeout(() => onNavigate('parent-dashboard'), 1500);
      } else {
        const errorMsg = data.message || JSON.stringify(data);
        console.error('Backend error:', errorMsg);
        toast.error(`Error: ${errorMsg}`);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Terjadi kesalahan. Pastikan backend sedang berjalan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => onNavigate('parent-dashboard')}
          className="mb-6 gap-2"
          disabled={isLoading}
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Button>

        <Card className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl mb-2">Daftarkan Anak</h1>
            <p className="text-gray-600">Isi formulir di bawah untuk mendaftarkan anak Anda</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="namaLengkap">Nama Lengkap Anak * (min. 3 karakter)</Label>
              <Input
                id="namaLengkap"
                value={formData.namaLengkap}
                onChange={(e) => handleChange('namaLengkap', e.target.value)}
                placeholder="Contoh: Budi Santoso"
                className="mt-1"
                disabled={isLoading}
                minLength={3}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tanggalLahir">Tanggal Lahir *</Label>
                <Input
                  id="tanggalLahir"
                  type="date"
                  value={formData.tanggalLahir}
                  onChange={(e) => handleChange('tanggalLahir', e.target.value)}
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="jenisKelamin">Jenis Kelamin *</Label>
                <select
                  id="jenisKelamin"
                  value={formData.jenisKelamin}
                  onChange={(e) => handleChange('jenisKelamin', e.target.value)}
                  className="w-full mt-1 flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  disabled={isLoading}
                >
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="kelas">Kelas * (min. 3 karakter)</Label>
              <Input
                id="kelas"
                value={formData.kelas}
                onChange={(e) => handleChange('kelas', e.target.value)}
                placeholder="Contoh: Kelompok A"
                className="mt-1"
                disabled={isLoading}
                minLength={3}
              />
            </div>

            <div>
              <Label htmlFor="alamat">Alamat * (min. 5 karakter)</Label>
              <Input
                id="alamat"
                value={formData.alamat}
                onChange={(e) => handleChange('alamat', e.target.value)}
                placeholder="Contoh: Jl. Merdeka No. 123"
                className="mt-1"
                disabled={isLoading}
                minLength={5}
              />
            </div>

            <div>
              <Label htmlFor="kondisi_khusus">Kondisi Khusus / Alergi (Opsional)</Label>
              <Input
                id="kondisi_khusus"
                value={formData.kondisi_khusus}
                onChange={(e) => handleChange('kondisi_khusus', e.target.value)}
                placeholder="Contoh: Alergi kacang, asma"
                className="mt-1"
                disabled={isLoading}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Catatan:</strong> Setelah mendaftar, data anak Anda akan diverifikasi oleh admin.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Mendaftarkan...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Daftarkan Anak
                </>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
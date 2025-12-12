import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/authContext';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { ArrowLeft, Plus, AlertCircle, CheckCircle, Clock} from 'lucide-react';
import { createComplaint, getComplaints, deleteComplaint } from '../../lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '../ui/dialog';

interface ComplaintData {
  id?: string;
  _id?: string;
  itemName: string;
  description: string;
  photoUrl?: string;
  status: 'new' | 'in_progress' | 'completed';
  createdAt?: string;
  createdBy?: string;
  createdByRole?: string;
  completionProofUrl?: string;
}

interface ComplaintsPageProps {
  onNavigate: (page: string) => void;
}

export function ComplaintsPage({ onNavigate }: ComplaintsPageProps) {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [complaints, setComplaints] = useState<ComplaintData[]>([]);
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    photo: null as File | null,
  });

  useEffect(() => {
    loadComplaints();
  }, [user]);

  const loadComplaints = async () => {
    try {
      // Get all complaints (no filter for now)
      const res = await getComplaints();
      console.log('Loaded complaints:', res);
      if (res && res.success && res.data) {
        setComplaints(res.data);
      } else if (res && res.data && Array.isArray(res.data)) {
        setComplaints(res.data);
      } else if (res && Array.isArray(res)) {
        setComplaints(res);
      } else {
        setComplaints([]);
      }
    } catch (error) {
      console.error('Error loading complaints:', error);
      setComplaints([]);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            <AlertCircle className="w-3 h-3 mr-1" />
            Keluhan Baru
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Sedang Dikerjakan
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Selesai
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.itemName || !formData.description) {
      alert('Mohon isi semua field');
      return;
    }

    setLoading(true);
    try {
      console.log('User info:', user);
      let photoUrl = '';
      if (formData.photo) {
        photoUrl = formData.photo.name;
      }

      const payload = {
        itemName: formData.itemName,
        description: formData.description,
        photoUrl,
        createdByRole: user?.role || 'parent',
      };

      console.log('Sending payload:', payload);
      const res = await createComplaint(payload);

      console.log('Create complaint response:', res);
      if (res && res.success) {
        alert('Keluhan berhasil diajukan!');
        setFormData({ itemName: '', description: '', photo: null });
        setIsDialogOpen(false);
        await loadComplaints();
      } else if (res && res.data) {
        alert('Keluhan berhasil diajukan!');
        setFormData({ itemName: '', description: '', photo: null });
        setIsDialogOpen(false);
        await loadComplaints();
      } else {
        alert(res?.message || 'Gagal membuat keluhan');
      }
    } catch (error: any) {
      alert(error?.message || 'Terjadi error saat membuat keluhan');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (complaintId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus keluhan ini?')) return;

    try {
      const res = await deleteComplaint(complaintId);
      if (res && res.success) {
        alert('Keluhan berhasil dihapus');
        await loadComplaints();
      } else {
        alert(res?.message || 'Gagal menghapus keluhan');
      }
    } catch (error: any) {
      alert(error?.message || 'Terjadi error saat menghapus keluhan');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => onNavigate('parent-dashboard')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl mb-2">Keluhan Inventaris</h1>
            <p className="text-gray-600">Laporkan kerusakan atau masalah inventaris</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-pink-400 to-purple-400">
                <Plus className="w-4 h-4" />
                Buat Keluhan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Buat Keluhan Baru</DialogTitle>
                <DialogDescription>
                  Laporkan kerusakan atau masalah inventaris sekolah
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="itemName">Nama Inventaris</Label>
                  <Input
                    id="itemName"
                    value={formData.itemName}
                    onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                    placeholder="Contoh: Kursi Kelas A"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Deskripsi Kerusakan</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Jelaskan masalah yang terjadi"
                    className="mt-1"
                    rows={4}
                  />
                </div>
                <div>

                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-400 to-purple-400"
                >
                  {loading ? 'Mengirim...' : 'Kirim Keluhan'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {complaints.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="bg-gray-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="mb-2">Tidak ada keluhan</h3>
            <p className="text-gray-600 mb-6">Anda belum membuat keluhan</p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="gap-2 bg-gradient-to-r from-pink-400 to-purple-400"
            >
              <Plus className="w-4 h-4" />
              Buat Keluhan
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <Card key={complaint._id || complaint.id} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="mb-1">{complaint.itemName}</h3>
                        <p className="text-sm text-gray-600">
                          {complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'Baru dibuat'}
                        </p>
                      </div>
                      {getStatusBadge(complaint.status)}
                    </div>
                    <p className="text-gray-700 mb-3">{complaint.description}</p>
                    {complaint.status === 'completed' && complaint.completionProofUrl && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
                        ✓ Masalah telah diselesaikan oleh admin
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(complaint._id || complaint.id || '')}
                      className="text-red-600 hover:text-red-700"
                    >
                      Hapus
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
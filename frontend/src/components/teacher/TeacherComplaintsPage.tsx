import { useState } from 'react';
import { useAuth } from '../../lib/authContext';
import { mockComplaints } from '../../lib/mockData';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { ArrowLeft, Plus, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

interface TeacherComplaintsPageProps {
  onNavigate: (page: string) => void;
}

export function TeacherComplaintsPage({ onNavigate }: TeacherComplaintsPageProps) {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    photo: null as File | null,
  });

  const myComplaints = mockComplaints.filter(c => c.createdBy === user?.id);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.itemName || !formData.description || !formData.photo) {
      toast.error('Mohon isi semua field');
      return;
    }
    toast.success('Keluhan berhasil diajukan!');
    setFormData({ itemName: '', description: '', photo: null });
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <Button variant="ghost" onClick={() => onNavigate('teacher-dashboard')} className="mb-6 gap-2">
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
                  <Label htmlFor="photo">Foto Bukti</Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, photo: e.target.files?.[0] || null })}
                    className="mt-1"
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-pink-400 to-purple-400">
                  Kirim Keluhan
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {myComplaints.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="bg-gray-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="mb-2">Tidak ada keluhan</h3>
            <p className="text-gray-600 mb-6">Anda belum membuat keluhan</p>
            <Button onClick={() => setIsDialogOpen(true)} className="gap-2 bg-gradient-to-r from-pink-400 to-purple-400">
              <Plus className="w-4 h-4" />
              Buat Keluhan
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {myComplaints.map((complaint) => (
              <Card key={complaint.id} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="mb-1">{complaint.itemName}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(complaint.createdAt).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
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
                    <Button variant="outline" size="sm" onClick={() => window.open(complaint.photoUrl, '_blank')}>
                      Lihat Foto
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

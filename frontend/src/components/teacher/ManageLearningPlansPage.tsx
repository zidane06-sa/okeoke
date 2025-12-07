import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/authContext';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { ArrowLeft, Plus, Calendar, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { createLearningPlan, deleteLearningPlan, getAllChildren } from '../../lib/api';

interface LearningPlanData {
  _id?: string;
  id?: string;
  anakId: string;
  userId: string;
  judulKegiatan: string;
  deskripsi?: string;
  bahanPerlengkapan?: string;
  tanggal: string;
  status?: string;
  createdAt?: string;
}

interface ManageLearningPlansPageProps {
  onNavigate: (page: string) => void;
}

export function ManageLearningPlansPage({ onNavigate }: ManageLearningPlansPageProps) {
  const { user, loading: authLoading } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [plans, setPlans] = useState<LearningPlanData[]>([]);
  const [children, setChildren] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    anakId: '',
    tanggal: '',
    judulKegiatan: '',
    deskripsi: '',
    bahanPerlengkapan: '',
  });

  useEffect(() => {
    if (!authLoading && user?.id) {
      loadPlans();
      loadChildren();
    } else if (!authLoading && !user?.id) {
      setLoading(false);
    }
  }, [authLoading, user?.id]);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/rencanaPembelajaran`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log('Raw response from GET:', data);
        
        let planArray = [];
        if (Array.isArray(data)) {
          planArray = data;
        } else if (data?.data && Array.isArray(data.data)) {
          planArray = data.data;
        } else if (data?.success && data.data && Array.isArray(data.data)) {
          planArray = data.data;
        }
        
        console.log('Parsed plans array:', planArray);
        const filtered = planArray.filter((plan: any) => plan.userId === user?.id);
        console.log('Filtered by userId:', filtered);
        setPlans(filtered);
      } else {
        console.error('GET error:', res.status, res.statusText);
        setPlans([]);
      }
    } catch (error) {
      console.error('Error loading plans:', error);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const loadChildren = async () => {
    try {
      const res = await getAllChildren();
      let childrenList = [];
      console.log('getAllChildren response:', res);
      
      if (Array.isArray(res)) {
        childrenList = res;
      } else if (res?.data && Array.isArray(res.data)) {
        childrenList = res.data;
      } else if (res?.success && res.data && Array.isArray(res.data)) {
        childrenList = res.data;
      }
      
      // Map to ensure fullName field exists
      const mappedChildren = childrenList.map((child: any) => ({
        ...child,
        fullName: child.fullName || child.namaLengkap || 'Unknown',
      }));
      
      console.log('Final children list:', mappedChildren);
      setChildren(mappedChildren);
    } catch (error) {
      console.error('Error loading children:', error);
      setChildren([]);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    if (!formData.anakId || !formData.tanggal || !formData.judulKegiatan) {
      alert('Isi semua field yang diperlukan');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        anakId: formData.anakId,
        userId: user?.id,  // Explicitly include userId
        tanggal: formData.tanggal,
        judulKegiatan: formData.judulKegiatan,
        deskripsi: formData.deskripsi,
        bahanPerlengkapan: formData.bahanPerlengkapan,
      };
      
      console.log('Submitting payload:', payload);
      const res = await createLearningPlan(payload);
      console.log('Create response:', res);

      if (res && res.data) {
        setFormData({
          anakId: '',
          tanggal: '',
          judulKegiatan: '',
          deskripsi: '',
          bahanPerlengkapan: '',
        });
        setIsDialogOpen(false);
        await loadPlans();
      } else {
        alert('Gagal membuat rencana pembelajaran');
      }
    } catch (err: any) {
      console.error('Error creating plan:', err);
      alert('Gagal membuat rencana pembelajaran');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (planId: string) => {
    if (!confirm('Hapus rencana pembelajaran ini?')) return;

    try {
      await deleteLearningPlan(planId);
      await loadPlans();
    } catch (err: any) {
      console.error('Error deleting plan:', err);
      alert('Gagal menghapus rencana pembelajaran');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => onNavigate('teacher-dashboard')} className="mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Button>

        {authLoading ? (
          <Card className="p-12 text-center">
            <p className="text-gray-600">Initializing...</p>
          </Card>
        ) : !user?.id ? (
          <Card className="p-12 text-center">
            <p className="text-gray-600 mb-4">Silakan login terlebih dahulu</p>
            <Button onClick={() => onNavigate('login')} className="bg-gradient-to-r from-pink-400 to-purple-400">
              Ke Login
            </Button>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl mb-2">Rencana Pembelajaran</h1>
                <p className="text-gray-600">Buat dan kelola rencana pembelajaran untuk minggu mendatang</p>
              </div>
              <Button onClick={() => setIsDialogOpen(true)} className="gap-2 bg-gradient-to-r from-pink-400 to-purple-400">
                <Plus className="w-4 h-4" />
                Buat Rencana
              </Button>
            </div>

            {isDialogOpen && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]" onPointerDownOutside={() => setIsDialogOpen(false)}>
                  <DialogHeader>
                    <DialogTitle>Buat Rencana Pembelajaran</DialogTitle>
                    <DialogDescription>
                      Buat rencana pembelajaran baru untuk anak didik Anda
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label>Anak Didik</Label>
                      <Select value={formData.anakId || ''} onValueChange={(val: string) => {
                        console.log('Selected child:', val);
                        setFormData({ ...formData, anakId: val });
                      }}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Pilih anak didik" />
                        </SelectTrigger>
                        <SelectContent>
                          {children && children.length > 0 ? (
                            children.map((child: any) => {
                              const childId = String(child._id || child.id || '');
                              console.log('Rendering child:', child.fullName, 'with id:', childId);
                              return (
                                <SelectItem key={childId} value={childId}>
                                  {child.fullName}
                                </SelectItem>
                              );
                            })
                          ) : (
                            <>
                              <SelectItem value="no-children" disabled>
                                {children.length === 0 ? 'Tidak ada anak didik' : 'Loading...'}
                              </SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Tanggal</Label>
                      <Input
                        type="date"
                        value={formData.tanggal}
                        onChange={(e: any) => setFormData({ ...formData, tanggal: e.target.value })}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Judul Kegiatan</Label>
                      <Input
                        value={formData.judulKegiatan}
                        onChange={(e: any) => setFormData({ ...formData, judulKegiatan: e.target.value })}
                        placeholder="Contoh: Mengenal Angka 1-10"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Deskripsi</Label>
                      <Textarea
                        value={formData.deskripsi}
                        onChange={(e: any) => setFormData({ ...formData, deskripsi: e.target.value })}
                        placeholder="Jelaskan detail kegiatan pembelajaran..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Bahan & Perlengkapan</Label>
                      <Textarea
                        value={formData.bahanPerlengkapan}
                        onChange={(e: any) => setFormData({ ...formData, bahanPerlengkapan: e.target.value })}
                        placeholder="Daftar bahan yang dibutuhkan..."
                        className="mt-1"
                        rows={2}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={submitting}
                      className="w-full bg-gradient-to-r from-pink-400 to-purple-400"
                    >
                      {submitting ? 'Membuat...' : 'Buat Rencana'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}

            {loading ? (
              <Card className="p-12 text-center">
                <p className="text-gray-600">Loading rencana pembelajaran...</p>
              </Card>
            ) : plans.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-gray-600 mb-6">Belum ada rencana pembelajaran</p>
                <Button onClick={() => setIsDialogOpen(true)} className="gap-2 bg-gradient-to-r from-pink-400 to-purple-400">
                  <Plus className="w-4 h-4" />
                  Buat Rencana
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {plans.map((plan) => (
                  <Card key={plan._id || plan.id} className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="mb-1">{plan.judulKegiatan}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(plan.tanggal).toLocaleDateString('id-ID', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(plan._id || plan.id || '')}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {plan.deskripsi && (
                        <div>
                          <label className="text-sm text-gray-600 block mb-1">Deskripsi</label>
                          <p className="text-gray-700">{plan.deskripsi}</p>
                        </div>
                      )}
                      {plan.bahanPerlengkapan && (
                        <div>
                          <label className="text-sm text-gray-600 block mb-1">Bahan & Perlengkapan</label>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-gray-700">{plan.bahanPerlengkapan}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

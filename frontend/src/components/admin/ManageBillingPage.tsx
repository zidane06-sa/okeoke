import { useState, useEffect } from 'react';
import { getAllChildren, getAllTagihan, createTagihan, updateTagihan } from '../../lib/api';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { ArrowLeft, Plus, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface ManageBillingPageProps {
  onNavigate: (page: string) => void;
}

interface Billing {
  _id: string;
  anak: string | { namaLengkap: string };
  nominal: number;
  tanggalJatuhTempo: string;
  periode: string;
  status: 'unpaid' | 'verified' | 'pending-verification' | 'rejected';
  paymentProofUrl?: string;
  tanggalPembayaran?: string;
}

interface Child {
  _id: string;
  namaLengkap: string;
  status: 'pending' | 'approved' | 'rejected';
}

export function ManageBillingPage({ onNavigate }: ManageBillingPageProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [billings, setBillings] = useState<Billing[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    anak: '',
    nominal: '',
    periode: '',
    tanggalJatuhTempo: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [childrenRes, billingsRes] = await Promise.all([
        getAllChildren(),
        getAllTagihan()
      ]);

      if (childrenRes.success && Array.isArray(childrenRes.data)) {
        const approved = childrenRes.data.filter((c: Child) => c.status === 'approved');
        setChildren(approved);
      }

      if (billingsRes.success && Array.isArray(billingsRes.data)) {
        setBillings(billingsRes.data);
      }
    } catch (error) {
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.anak || !formData.nominal || !formData.periode || !formData.tanggalJatuhTempo) {
      toast.error('Mohon isi semua field');
      return;
    }
    try {
      await createTagihan({
        anak: formData.anak,
        nominal: formData.nominal,
        periode: formData.periode,
        tanggalJatuhTempo: formData.tanggalJatuhTempo,
      });
      toast.success('Tagihan berhasil dibuat!');
      setFormData({ anak: '', nominal: '', periode: '', tanggalJatuhTempo: '' });
      setIsDialogOpen(false);
      loadData();
    } catch (error) {
      toast.error('Gagal membuat tagihan');
    }
  };

  const handleVerifyPayment = async (billId: string, description: string) => {
    try {
      await updateTagihan(billId, { status: 'verified' });
      toast.success(`Pembayaran untuk ${description} telah diverifikasi!`);
      loadData();
    } catch (error) {
      toast.error('Gagal memverifikasi pembayaran');
    }
  };

  const getChildName = (childIdOrObj: string | { namaLengkap: string }) => {
    if (typeof childIdOrObj === 'string') {
      return children.find(c => c._id === childIdOrObj)?.namaLengkap || 'Unknown';
    }
    return childIdOrObj?.namaLengkap || 'Unknown';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
      case 'verified':
        return <Badge className="bg-green-100 text-green-700">Lunas</Badge>;
      case 'unpaid':
        return <Badge className="bg-red-100 text-red-700">Belum Dibayar</Badge>;
      case 'pending-verification':
      case 'pending_verification':
        return <Badge className="bg-yellow-100 text-yellow-700">Menunggu Verifikasi</Badge>;
      case 'rejected':
        return <Badge className="bg-red-200 text-red-800">Ditolak</Badge>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 py-8 px-4 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" onClick={() => onNavigate('admin-dashboard')} className="mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl mb-2">Manajemen Tagihan</h1>
            <p className="text-gray-600">Buat dan kelola tagihan siswa</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-pink-400 to-purple-400">
                <Plus className="w-4 h-4" />
                Buat Tagihan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Buat Tagihan Baru</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Pilih Anak</Label>
                  <Select value={formData.anak} onValueChange={(value: string) => setFormData({ ...formData, anak: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Pilih anak" />
                    </SelectTrigger>
                    <SelectContent>
                      {children.map(child => (
                        <SelectItem key={child._id} value={child._id}>
                          {child.namaLengkap}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Deskripsi & Periode</Label>
                  <Input
                    value={formData.periode}
                    onChange={(e) => setFormData({ ...formData, periode: e.target.value })}
                    placeholder="Contoh: SPP Bulan Desember 2025"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Nominal (Rp)</Label>
                  <Input
                    type="number"
                    value={formData.nominal}
                    onChange={(e) => setFormData({ ...formData, nominal: e.target.value })}
                    placeholder="500000"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Tanggal Jatuh Tempo</Label>
                  <Input
                    type="date"
                    value={formData.tanggalJatuhTempo}
                    onChange={(e) => setFormData({ ...formData, tanggalJatuhTempo: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-pink-400 to-purple-400">
                  Buat Tagihan
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {billings.map((bill) => (
            <Card key={bill._id} className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="mb-1">{bill.periode}</h3>
                      <p className="text-sm text-gray-600">{getChildName(bill.anak)}</p>
                    </div>
                    {getStatusBadge(bill.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
                    <span>Nominal: <strong className="text-gray-900">Rp {bill.nominal.toLocaleString('id-ID')}</strong></span>
                    <span>•</span>
                    <span>Jatuh Tempo: {new Date(bill.tanggalJatuhTempo).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {bill.status === 'pending-verification' && bill.paymentProofUrl && (
                    <Button
                      onClick={() => handleVerifyPayment(bill._id, bill.periode)}
                      size="sm"
                      className="gap-2 bg-green-500 hover:bg-green-600"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Verifikasi
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

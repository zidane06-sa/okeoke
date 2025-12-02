import { useState, useEffect } from 'react';
import { getAllChildren, deleteChild, updateChild } from '../../lib/api';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ArrowLeft, CheckCircle, XCircle, Edit2, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';

interface Child {
  _id: string;
  namaLengkap: string;
  jenisKelamin: 'L' | 'P';
  tanggalLahir: string;
  kelas: string;
  alamat: string;
  kondisi_khusus?: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface ManageChildrenPageProps {
  onNavigate: (page: string) => void;
}

export function ManageChildrenPage({ onNavigate }: ManageChildrenPageProps) {
  const [children, setChildren] = useState<Child[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const result = await getAllChildren();
      if (result.success && Array.isArray(result.data)) {
        setChildren(result.data);
      } else {
        toast.error('Gagal memuat data anak');
      }
    } catch (error) {
      toast.error('Error mengambil data anak');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (childId: string, childName: string) => {
    try {
      const result = await updateChild(childId, { status: 'approved' });
      if (result.success) {
        toast.success(`${childName} berhasil diverifikasi!`);
        fetchChildren();
      } else {
        toast.error('Gagal diverifikasi');
      }
    } catch (error) {
      toast.error('Error saat verifikasi');
    }
  };

  const handleReject = async (childId: string, childName: string) => {
    try {
      const result = await updateChild(childId, { status: 'rejected' });
      if (result.success) {
        toast.error(`Pendaftaran ${childName} ditolak`);
        fetchChildren();
      } else {
        toast.error('Gagal menolak pendaftaran');
      }
    } catch (error) {
      toast.error('Error saat menolak');
    }
  };

  const handleDelete = async (childId: string, childName: string) => {
    try {
      const result = await deleteChild(childId);
      if (result.success) {
        toast.success(`${childName} berhasil dihapus dari sistem`);
        fetchChildren();
      } else {
        toast.error('Gagal menghapus');
      }
    } catch (error) {
      toast.error('Error saat menghapus');
    }
  };

  const filteredChildren = children.filter(child => {
    const matchesSearch = child.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === 'all' || child.kelas === classFilter;
    return matchesSearch && matchesClass;
  });

  const pendingChildren = filteredChildren.filter(c => c.status === 'pending');
  const approvedChildren = filteredChildren.filter(c => c.status === 'approved');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 py-8 px-4 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => onNavigate('admin-dashboard')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl mb-2">Manajemen Anak</h1>
          <p className="text-gray-600">Kelola data siswa dan verifikasi pendaftaran</p>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Cari nama anak..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Semua Kelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kelas</SelectItem>
                <SelectItem value="Kelas A">Kelas A</SelectItem>
                <SelectItem value="Kelas B">Kelas B</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Pending Approvals */}
        {pendingChildren.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl mb-4">Menunggu Verifikasi ({pendingChildren.length})</h2>
            <div className="grid gap-4">
              {pendingChildren.map((child) => (
                <Card key={child._id} className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div>
                          <h3 className="mb-1">{child.namaLengkap}</h3>
                          <p className="text-sm text-gray-600">
                            {child.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'} • 
                            Lahir: {new Date(child.tanggalLahir).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Alamat: {child.alamat}</p>
                        {child.kondisi_khusus && <p>Kondisi Khusus: {child.kondisi_khusus}</p>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprove(child._id, child.namaLengkap)}
                        size="sm"
                        className="gap-2 bg-green-500 hover:bg-green-600"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Terima
                      </Button>
                      <Button
                        onClick={() => handleReject(child._id, child.namaLengkap)}
                        variant="outline"
                        size="sm"
                        className="gap-2 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4" />
                        Tolak
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Approved Children */}
        <div>
          <h2 className="text-2xl mb-4">Siswa Terdaftar ({approvedChildren.length})</h2>
          <div className="grid gap-4">
            {approvedChildren.map((child) => (
              <Card key={child._id} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div>
                        <h3 className="mb-1">{child.namaLengkap}</h3>
                        <p className="text-sm text-gray-600">
                          {child.kelas} • {child.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'} • 
                          Lahir: {new Date(child.tanggalLahir).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">Terdaftar</Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Alamat: {child.alamat}</p>
                      {child.kondisi_khusus && <p>Kondisi Khusus: {child.kondisi_khusus}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          Hapus
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus Siswa?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus {child.namaLengkap} dari sistem? 
                            Tindakan ini tidak dapat dibatalkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(child._id, child.namaLengkap)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

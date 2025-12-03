import { useState, useEffect } from 'react';
import { getComplaints, updateComplaint } from '../../lib/api';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface ManageComplaintsPageProps {
  onNavigate: (page: string) => void;
}

interface Complaint {
  _id: string;
  deskripsi: string;
  status: 'new' | 'in_progress' | 'completed';
  created_by: string;
  createdAt: string;
}

export function ManageComplaintsPage({ onNavigate }: ManageComplaintsPageProps) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const result = await getComplaints();
      if (result.success && Array.isArray(result.data)) {
        setComplaints(result.data);
      } else {
        toast.error('Gagal memuat keluhan');
      }
    } catch (error) {
      toast.error('Error mengambil data keluhan');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkInProgress = async (id: string, description: string) => {
    try {
      const result = await updateComplaint(id, { status: 'in_progress' });
      if (result.success) {
        toast.success(`Keluhan ${description} ditandai sedang dikerjakan`);
        loadComplaints();
      }
    } catch (error) {
      toast.error('Gagal mengupdate status');
    }
  };

  const handleMarkCompleted = async (id: string, description: string) => {
    try {
      const result = await updateComplaint(id, { status: 'completed' });
      if (result.success) {
        toast.success(`Keluhan ${description} ditandai selesai`);
        loadComplaints();
      }
    } catch (error) {
      toast.error('Gagal mengupdate status');
    }
  };

  const newComplaints = complaints.filter(c => c.status === 'new');
  const inProgressComplaints = complaints.filter(c => c.status === 'in_progress');
  const completedComplaints = complaints.filter(c => c.status === 'completed');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-100 text-blue-700">Baru</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-700">Sedang Dikerjakan</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-700">Selesai</Badge>;
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

  const renderComplaint = (complaint: Complaint, showActions: boolean = true) => (
    <Card key={complaint._id} className="p-6">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="mb-1">{complaint.deskripsi}</h3>
              <p className="text-sm text-gray-600">
                Dilaporkan: {new Date(complaint.createdAt).toLocaleDateString('id-ID')}
              </p>
            </div>
            {getStatusBadge(complaint.status)}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {showActions && complaint.status === 'new' && (
            <Button 
              onClick={() => handleMarkInProgress(complaint._id, complaint.deskripsi)} 
              size="sm" 
              className="bg-yellow-500 hover:bg-yellow-600"
            >
              Tandai Dikerjakan
            </Button>
          )}
          {showActions && complaint.status === 'in_progress' && (
            <Button 
              onClick={() => handleMarkCompleted(complaint._id, complaint.deskripsi)} 
              size="sm" 
              className="bg-green-500 hover:bg-green-600"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Tandai Selesai
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" onClick={() => onNavigate('admin-dashboard')} className="mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl mb-2">Kelola Keluhan</h1>
          <p className="text-gray-600">Tangani keluhan inventaris dari orang tua dan guru</p>
        </div>

        <Tabs defaultValue="new" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="new">Keluhan Baru ({newComplaints.length})</TabsTrigger>
            <TabsTrigger value="progress">Sedang Dikerjakan ({inProgressComplaints.length})</TabsTrigger>
            <TabsTrigger value="completed">History Selesai ({completedComplaints.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="space-y-4">
            {newComplaints.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-gray-600">Tidak ada keluhan baru</p>
              </Card>
            ) : (
              newComplaints.map(c => renderComplaint(c))
            )}
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            {inProgressComplaints.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-gray-600">Tidak ada keluhan yang sedang dikerjakan</p>
              </Card>
            ) : (
              inProgressComplaints.map(c => renderComplaint(c))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedComplaints.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-gray-600">Belum ada keluhan yang selesai</p>
              </Card>
            ) : (
              completedComplaints.map(c => renderComplaint(c, false))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Baby, Users, AlertCircle, CreditCard } from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import { 
  getAllChildren, 
  getComplaints, 
  getAllUsers,
  getAllTagihan,
} from '../../lib/api';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { user, loading: authLoading } = useAuth();
  const [totalChildren, setTotalChildren] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [unpaidBills, setUnpaidBills] = useState(0);
  const [pendingVerifications, setPendingVerifications] = useState(0);
  const [activeComplaints, setActiveComplaints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user?.id) {
      loadStats();
    }
  }, [authLoading, user?.id]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const childrenRes = await getAllChildren();
      const usersRes = await getAllUsers();
      const tagihanRes = await getAllTagihan();
      const complaintsRes = await getComplaints();
      
      setTotalChildren(childrenRes?.data?.length || 0);
      
      // Count teachers (role === 'teacher')
      const teachers = usersRes?.data?.filter((user: any) => user.role === 'teacher') || [];
      setTotalTeachers(teachers.length);
      
      // Count unpaid bills (status === 'unpaid')
      const unpaid = tagihanRes?.data?.filter((bill: any) => bill.status === 'unpaid') || [];
      setUnpaidBills(unpaid.length);
      
      // Count pending verifications (status === 'pending-verification')
      const pending = tagihanRes?.data?.filter((bill: any) => bill.status === 'pending-verification') || [];
      setPendingVerifications(pending.length);
      
      // Count active complaints (status !== 'resolved')
      const active = complaintsRes?.data?.filter((complaint: any) => complaint.status !== 'resolved') || [];
      setActiveComplaints(active.length);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Dashboard Admin</h1>
          <p className="text-gray-600">Kelola PAUD Tunas Ceria</p>
        </div>

        {loading ? (
          <Card className="p-12 text-center">
            <p className="text-gray-600">Loading data...</p>
          </Card>
        ) : (
          <>
            {/* Stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-pink-500 w-12 h-12 rounded-xl flex items-center justify-center">
                    <Baby className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl">{totalChildren}</span>
                </div>
                <h3>Total Anak</h3>
                <p className="text-sm text-gray-600">Siswa terdaftar</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-purple-500 w-12 h-12 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl">{totalTeachers}</span>
                </div>
                <h3>Total Guru</h3>
                <p className="text-sm text-gray-600">Tenaga pengajar</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-500 w-12 h-12 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl">{activeComplaints}</span>
                </div>
                <h3>Keluhan Aktif</h3>
                <p className="text-sm text-gray-600">Belum selesai</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-red-500 w-12 h-12 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl">{unpaidBills}</span>
                </div>
                <h3>Tagihan Unpaid</h3>
                <p className="text-sm text-gray-600">Belum dibayar</p>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card 
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onNavigate('admin-children')}
              >
                <div className="bg-pink-100 p-3 rounded-xl w-fit mb-4">
                  <Baby className="w-6 h-6 text-pink-500" />
                </div>
                <h3 className="mb-2">Manajemen Anak</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Kelola data siswa terdaftar dan edit informasi
                </p>
              </Card>

              <Card 
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onNavigate('admin-billing')}
              >
                <div className="bg-purple-100 p-3 rounded-xl w-fit mb-4">
                  <CreditCard className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="mb-2">Manajemen Tagihan</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Buat dan kelola tagihan per anak
                </p>
                {pendingVerifications > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-sm">
                    <strong>{pendingVerifications}</strong> pembayaran perlu diverifikasi
                  </div>
                )}
              </Card>

              <Card 
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onNavigate('admin-complaints')}
              >
                <div className="bg-blue-100 p-3 rounded-xl w-fit mb-4">
                  <AlertCircle className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="mb-2">Kelola Keluhan</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Kelola keluhan inventaris dari orang tua dan guru
                </p>
                {activeComplaints > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-sm">
                    <strong>{activeComplaints}</strong> keluhan aktif
                  </div>
                )}
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

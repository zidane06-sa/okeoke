import { useAuth } from '../../lib/authContext';
import { Card } from '../ui/card';
import { FileText, BookOpen, AlertCircle } from 'lucide-react';

interface TeacherDashboardProps {
  onNavigate: (page: string) => void;
}

export function TeacherDashboard({ onNavigate }: TeacherDashboardProps) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Dashboard Guru</h1>
          <p className="text-gray-600">Selamat datang, idan</p>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card 
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onNavigate('teacher-daily-reports')}
          >
            <div className="bg-pink-100 p-3 rounded-xl w-fit mb-4">
              <FileText className="w-6 h-6 text-pink-500" />
            </div>
            <h3 className="mb-2">Laporan Harian</h3>
            <p className="text-sm text-gray-600">
              Isi laporan aktivitas harian siswa
            </p>
          </Card>

          <Card 
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onNavigate('teacher-learning-plans')}
          >
            <div className="bg-purple-100 p-3 rounded-xl w-fit mb-4">
              <BookOpen className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="mb-2">Rencana Pembelajaran</h3>
            <p className="text-sm text-gray-600">
              Buat dan kelola rencana pembelajaran
            </p>
          </Card>

          <Card 
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onNavigate('teacher-complaints')}
          >
            <div className="bg-blue-100 p-3 rounded-xl w-fit mb-4">
              <AlertCircle className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="mb-2">Buat Keluhan</h3>
            <p className="text-sm text-gray-600">
              Laporkan kerusakan inventaris
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
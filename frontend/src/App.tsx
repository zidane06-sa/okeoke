import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './lib/authContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { Toaster } from './components/ui/sonner';

// Parent Components
import { ParentDashboard } from './components/parent/ParentDashboard';
import { ChildProfilePage } from './components/parent/ChildProfilePage';
import { DailyReportsPage } from './components/parent/DailyReportsPage';
import { LearningPlansPage } from './components/parent/LearningPlansPage';
import { RegisterChildPage } from './components/parent/RegisterChildPage';
import { BillingPage } from './components/parent/BillingPage';
import { ComplaintsPage as ParentComplaintsPage } from './components/parent/ComplaintsPage';
import { CCTVPage } from './components/parent/CCTVPage';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ManageChildrenPage } from './components/admin/ManageChildrenPage';
import { ManageBillingPage } from './components/admin/ManageBillingPage';
import { ManageComplaintsPage } from './components/admin/ManageComplaintsPage';

// Teacher Components
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { CreateDailyReportsPage } from './components/teacher/CreateDailyReportsPage';
import { ManageLearningPlansPage } from './components/teacher/ManageLearningPlansPage';
import { TeacherComplaintsPage } from './components/teacher/TeacherComplaintsPage';

// Static Pages
import { mockSchoolProfile, mockStaff } from './lib/mockData';
import { Card } from './components/ui/card';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { MapPin, Phone, Mail, Target, Heart } from 'lucide-react';

function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl mb-8 text-center">Profil PAUD Tunas Ceria</h1>
        <Card className="p-8 mb-8">
          <div className="aspect-video relative mb-6 rounded-xl overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1567746512136-f005499a7575?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc3Jvb20lMjBraW5kZXJnYXJ0ZW58ZW58MXx8fHwxNzYyODA1OTUwfDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="PAUD Tunas Ceria"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl mb-4">Tentang Kami</h2>
          <p className="text-gray-700 leading-relaxed">{mockSchoolProfile.about}</p>
        </Card>
      </div>
    </div>
  );
}

function StaffPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl mb-8 text-center">Staff PAUD Tunas Ceria</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockStaff.map((staff) => (
            <Card key={staff.id} className="overflow-hidden">
              <div className="aspect-square relative bg-gradient-to-br from-pink-100 to-purple-100">
                <ImageWithFallback
                  src={staff.photoUrl}
                  alt={staff.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="mb-1">{staff.name}</h3>
                <p className="text-sm text-gray-600">{staff.position}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function VisionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl mb-8 text-center">Visi & Misi</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8 bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
            <div className="bg-pink-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl mb-4">Visi</h2>
            <p className="text-gray-700">{mockSchoolProfile.vision}</p>
          </Card>
          <Card className="p-8 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="bg-purple-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl mb-4">Misi</h2>
            <ul className="space-y-2">
              {mockSchoolProfile.mission.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl mb-8 text-center">Hubungi Kami</h1>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <div className="bg-gradient-to-br from-pink-400 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-2">Alamat</h3>
            <p className="text-sm text-gray-600">{mockSchoolProfile.address}</p>
          </Card>
          <Card className="p-6 text-center">
            <div className="bg-gradient-to-br from-purple-400 to-purple-500 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-2">Telepon</h3>
            <p className="text-sm text-gray-600">{mockSchoolProfile.phone}</p>
          </Card>
          <Card className="p-6 text-center">
            <div className="bg-gradient-to-br from-blue-400 to-blue-500 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-2">Email</h3>
            <p className="text-sm text-gray-600">{mockSchoolProfile.email}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const { user, isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedChildId, setSelectedChildId] = useState<string | undefined>();

  const handleNavigate = (page: string, childId?: string) => {
    setCurrentPage(page);
    setSelectedChildId(childId);
    window.scrollTo(0, 0);
  };

  // Auto-redirect to appropriate dashboard after login
  useEffect(() => {
    if (!loading && isAuthenticated && user && currentPage === 'home') {
      switch (user.role) {
        case 'parent':
          setCurrentPage('parent-dashboard');
          break;
        case 'admin':
          setCurrentPage('admin-dashboard');
          break;
        case 'teacher':
          setCurrentPage('teacher-dashboard');
          break;
      }
    }
  }, [loading, isAuthenticated, user]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
      case 'register':
        return <RegisterPage onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfilePage />;
      case 'staff':
        return <StaffPage />;
      case 'vision':
        return <VisionPage />;
      case 'contact':
        return <ContactPage />;
      
      // Parent Pages
      case 'parent-dashboard':
        return isAuthenticated && user?.role === 'parent' ? (
          <ParentDashboard onNavigate={handleNavigate} />
        ) : <HomePage onNavigate={handleNavigate} />;
      case 'parent-child-profile':
        return isAuthenticated && user?.role === 'parent' && selectedChildId ? (
          <ChildProfilePage childId={selectedChildId} onNavigate={handleNavigate} />
        ) : <HomePage onNavigate={handleNavigate} />;
      case 'parent-daily-reports':
        return isAuthenticated && user?.role === 'parent' && selectedChildId ? (
          <DailyReportsPage childId={selectedChildId} onNavigate={handleNavigate} />
        ) : <HomePage onNavigate={handleNavigate} />;
      case 'parent-learning-plans':
        return isAuthenticated && user?.role === 'parent' && selectedChildId ? (
          <LearningPlansPage childId={selectedChildId} onNavigate={handleNavigate} />
        ) : <HomePage onNavigate={handleNavigate} />;
      case 'parent-register-child':
        return isAuthenticated && user?.role === 'parent' ? (
          <RegisterChildPage onNavigate={handleNavigate} />
        ) : <HomePage onNavigate={handleNavigate} />;
      case 'parent-billing':
        return isAuthenticated && user?.role === 'parent' ? (
          <BillingPage onNavigate={handleNavigate} />
        ) : <HomePage onNavigate={handleNavigate} />;
      case 'parent-complaints':
        return isAuthenticated && user?.role === 'parent' ? (
          <ParentComplaintsPage onNavigate={handleNavigate} />
        ) : <HomePage onNavigate={handleNavigate} />;
      case 'parent-cctv':
        return isAuthenticated && user?.role === 'parent' ? (
          <CCTVPage onNavigate={handleNavigate} />
        ) : <HomePage onNavigate={handleNavigate} />;
      
      // Admin Pages
      case 'admin-dashboard':
        return isAuthenticated && user?.role === 'admin' ? (
          <AdminDashboard onNavigate={handleNavigate} />
        ) : <HomePage onNavigate={handleNavigate} />;
      case 'admin-children':
        return isAuthenticated && user?.role === 'admin' ? (
          <ManageChildrenPage onNavigate={handleNavigate} />
        ) : <HomePage onNavigate={handleNavigate} />;
      case 'admin-billing':
        return isAuthenticated && user?.role === 'admin' ? (
          <ManageBillingPage onNavigate={handleNavigate} />
        ) : <HomePage onNavigate={handleNavigate} />;
      case 'admin-complaints':
        return isAuthenticated && user?.role === 'admin' ? (
          <ManageComplaintsPage onNavigate={handleNavigate} />
        ) : <HomePage onNavigate={handleNavigate} />;
      
      // Teacher Pages
      case 'teacher-dashboard':
        return isAuthenticated && user?.role === 'teacher' ? (
          <TeacherDashboard onNavigate={handleNavigate} />
        ) : <HomePage onNavigate={handleNavigate} />;
      case 'teacher-daily-reports':
        return isAuthenticated && user?.role === 'teacher' ? (
          <CreateDailyReportsPage onNavigate={handleNavigate} />
        ) : <HomePage onNavigate={handleNavigate} />;
      case 'teacher-learning-plans':
        return isAuthenticated && user?.role === 'teacher' ? (
          <ManageLearningPlansPage onNavigate={handleNavigate} />
        ) : <HomePage onNavigate={handleNavigate} />;
      case 'teacher-complaints':
        return isAuthenticated && user?.role === 'teacher' ? (
          <TeacherComplaintsPage onNavigate={handleNavigate} />
        ) : <HomePage onNavigate={handleNavigate} />;
      
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
      {renderPage()}
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
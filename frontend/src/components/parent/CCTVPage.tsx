import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowLeft, Video, Radio } from 'lucide-react';

interface CCTVPageProps {
  onNavigate: (page: string) => void;
}

export function CCTVPage({ onNavigate }: CCTVPageProps) {
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

        <div className="mb-8">
          <h1 className="text-3xl mb-2">Streaming CCTV</h1>
          <p className="text-gray-600">Monitor aktivitas anak di ruang kelas</p>
        </div>

        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 aspect-video relative flex items-center justify-center">
            <div className="text-center text-white">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl inline-block">
                <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="mb-2 text-xl">Live Stream CCTV</h3>
                <p className="text-white/70 mb-4">
                  Fitur streaming akan tersedia dengan integrasi backend
                </p>
                <div className="flex items-center gap-2 justify-center text-sm">
                  <Radio className="w-4 h-4 text-red-500 animate-pulse" />
                  <span>Live</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mb-1">Ruang Kelas Utama</h3>
                <p className="text-sm text-gray-600">PAUD Tunas Ceria - Camera 01</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Online</span>
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-gray-700">
            <strong>Informasi:</strong> Streaming CCTV dapat diakses oleh semua orang tua untuk memantau 
            aktivitas di ruang kelas. Pastikan koneksi internet Anda stabil untuk pengalaman terbaik.
          </p>
        </div>
      </div>
    </div>
  );
}

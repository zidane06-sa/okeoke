import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { mockSchoolProfile, mockStaff } from '../lib/mockData';
import { Baby, Heart, Target, Users, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-pink-100 px-4 py-2 rounded-full mb-6">
                <Baby className="w-5 h-5 text-pink-500" />
                <span className="text-sm text-pink-700">Pendidikan Anak Usia Dini</span>
              </div>
              <h1 className="text-4xl md:text-5xl mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                {mockSchoolProfile.name}
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                {mockSchoolProfile.about}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => onNavigate('register')}
                  size="lg"
                  className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 gap-2"
                >
                  Daftar Sekarang
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => onNavigate('contact')}
                  variant="outline"
                  size="lg"
                >
                  Hubungi Kami
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-300 to-purple-300 rounded-3xl transform rotate-3"></div>
              <ImageWithFallback
                src="https://asset-2.tribunnews.com/makassar/foto/bank/images/Murid-Pendidikan-Anak-Usia-Dini-PAUD-Ceria-Makassar-mengi3r4e4.jpg"
                alt="Happy children playing"
                className="relative rounded-3xl shadow-2xl w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Visi & Misi Kami</h2>
            <p className="text-gray-600">Komitmen kami untuk pendidikan anak usia dini</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
              <div className="bg-pink-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl mb-4">Visi</h3>
              <p className="text-gray-700">{mockSchoolProfile.vision}</p>
            </Card>
            <Card className="p-8 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <div className="bg-purple-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl mb-4">Misi</h3>
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
      </section>

      {/* Staff Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full mb-4">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-blue-700">Tim Kami</span>
            </div>
            <h2 className="text-3xl mb-4">Staff PAUD Tunas Ceria</h2>
            <p className="text-gray-600">Tenaga pendidik profesional dan berpengalaman</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockStaff.map((staff) => (
              <Card key={staff.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Hubungi Kami</h2>
            <p className="text-gray-600">Kami siap membantu Anda</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-br from-pink-400 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="mb-2">Alamat</h3>
              <p className="text-sm text-gray-600">{mockSchoolProfile.address}</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-br from-purple-400 to-purple-500 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="mb-2">Telepon</h3>
              <p className="text-sm text-gray-600">{mockSchoolProfile.phone}</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-br from-blue-400 to-blue-500 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="mb-2">Email</h3>
              <p className="text-sm text-gray-600">{mockSchoolProfile.email}</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-3xl p-12 text-white">
            <h2 className="text-3xl mb-4">Siap Bergabung dengan Kami?</h2>
            <p className="text-lg mb-8 opacity-90">
              Daftarkan anak Anda sekarang dan mulai perjalanan pendidikan yang menyenangkan!
            </p>
            <Button
              onClick={() => onNavigate('register')}
              size="lg"
              className="bg-white text-pink-500 hover:bg-gray-100"
            >
              Daftar Sekarang
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

import React, { useState } from 'react';
import { useAuth } from '../lib/authContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Baby, LogIn, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Mohon isi semua field');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://okeoke-kf8w.vercel.app/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      console.log('Login response:', data);

      if (response.ok && data.success) {
        toast.success('Login berhasil!');

        if (login) {
          try {
            login(data.data);
          } catch (err) {
            console.warn('authContext.login error:', err);
          }
        }

        if (data.data) localStorage.setItem('user', JSON.stringify(data.data));
        if (data.token) localStorage.setItem('token', data.token);

        const role = data.data?.role;
        if (role === 'admin') onNavigate('admin-dashboard');
        else if (role === 'teacher') onNavigate('teacher-dashboard');
        else onNavigate('parent-dashboard');
      } else {
        toast.error(data.message || 'Email atau password salah');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Backend tidak terjangkau. Pastikan server berjalan di http://localhost:3001');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-pink-400 to-purple-400 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Baby className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl mb-2">Selamat Datang Kembali</h1>
          <p className="text-gray-600">Login ke PAUD Tunas Ceria</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="contoh@email.com"
              className="mt-1"
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="Masukkan password"
              className="mt-1"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Login
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Belum punya akun?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="text-pink-500 hover:text-pink-600 font-medium"
              disabled={isLoading}
            >
              Daftar di sini
            </button>
          </p>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-xl">
          <p className="text-xs mb-2 font-medium">Demo Credentials:</p>
          <div className="text-xs text-gray-600 space-y-1">
            <p><strong>Parent:</strong> okelele@gmail.com / okeoke</p>
            <p><strong>Admin:</strong> benayalagi@gmail.com / okeoke</p>
            <p><strong>Teacher:</strong> contoh@gmail.com / okeoke</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

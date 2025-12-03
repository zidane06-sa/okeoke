import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowLeft, Calendar, FileText } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { getDailyReports } from '../../lib/api';

interface DailyReportData {
  _id?: string;
  id?: string;
  anakId: string;
  tanggal: string;
  catatanAktivitas: string;
  catatankhusus?: string;
  fotoKegiatanURL?: string;
  createdAt?: string;
}

interface DailyReportsPageProps {
  childId: string;
  childName?: string;
  onNavigate: (page: string) => void;
}

export function DailyReportsPage({ childId, childName = '', onNavigate }: DailyReportsPageProps) {
  const [reports, setReports] = useState<DailyReportData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, [childId]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const res = await getDailyReports(childId);
      console.log('Loaded daily reports:', res);
      
      if (res && res.success && res.data) {
        setReports(res.data.sort((a: DailyReportData, b: DailyReportData) => 
          new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
        ));
      } else if (res && res.data && Array.isArray(res.data)) {
        setReports(res.data.sort((a: DailyReportData, b: DailyReportData) => 
          new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
        ));
      } else if (res && Array.isArray(res)) {
        setReports(res.sort((a: DailyReportData, b: DailyReportData) => 
          new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
        ));
      } else {
        setReports([]);
      }
    } catch (error) {
      console.error('Error loading daily reports:', error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => onNavigate('parent-dashboard')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl mb-2">Laporan Harian</h1>
          <p className="text-gray-600">{childName}</p>
        </div>

        {loading ? (
          <Card className="p-12 text-center">
            <p className="text-gray-600">Loading laporan...</p>
          </Card>
        ) : reports.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="bg-gray-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="mb-2">Belum ada laporan</h3>
            <p className="text-gray-600">
              Laporan harian akan muncul di sini setelah guru mengisi
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {reports.map((report) => (
              <Card key={report._id || report.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-pink-100 p-3 rounded-xl">
                      <Calendar className="w-5 h-5 text-pink-500" />
                    </div>
                    <div>
                      <h3 className="mb-1">
                        {new Date(report.tanggal).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-600 mb-2 block">Aktivitas Harian</Label>
                    <p className="text-gray-700">{report.catatanAktivitas}</p>
                  </div>

                  {report.catatankhusus && (
                    <div>
                      <Label className="text-sm text-gray-600 mb-2 block">Catatan Khusus</Label>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-gray-700">{report.catatankhusus}</p>
                      </div>
                    </div>
                  )}

                  {report.fotoKegiatanURL && (
                    <div>
                      <Label className="text-sm text-gray-600 mb-2 block">Foto Kegiatan</Label>
                      <div className="rounded-lg overflow-hidden">
                        <ImageWithFallback
                          src={report.fotoKegiatanURL}
                          alt="Foto kegiatan"
                          className="w-full h-64 object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}

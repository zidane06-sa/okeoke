import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowLeft, Calendar, BookOpen, Package } from 'lucide-react';
import { getLearningPlans } from '../../lib/api';

interface LearningPlanData {
  _id?: string;
  id?: string;
  anakId: string;
  judulKegiatan: string;
  deskripsi?: string;
  bahanPerlengkapan?: string;
  tanggal: string;
  status?: string;
  createdAt?: string;
}

interface LearningPlansPageProps {
  childId: string;
  childName?: string;
  onNavigate: (page: string) => void;
}

export function LearningPlansPage({ childId, childName = '', onNavigate }: LearningPlansPageProps) {
  const [plans, setPlans] = useState<LearningPlanData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
  }, [childId]);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const res = await getLearningPlans(childId);
      console.log('Loaded learning plans:', res);
      
      if (res && res.success && res.data) {
        setPlans(res.data.sort((a: LearningPlanData, b: LearningPlanData) => 
          new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
        ));
      } else if (res && res.data && Array.isArray(res.data)) {
        setPlans(res.data.sort((a: LearningPlanData, b: LearningPlanData) => 
          new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
        ));
      } else if (res && Array.isArray(res)) {
        setPlans(res.sort((a: LearningPlanData, b: LearningPlanData) => 
          new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
        ));
      } else {
        setPlans([]);
      }
    } catch (error) {
      console.error('Error loading learning plans:', error);
      setPlans([]);
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
          <h1 className="text-3xl mb-2">Rencana Pembelajaran</h1>
          <p className="text-gray-600">{childName}</p>
        </div>

        {loading ? (
          <Card className="p-12 text-center">
            <p className="text-gray-600">Loading rencana pembelajaran...</p>
          </Card>
        ) : plans.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="bg-gray-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="mb-2">Belum ada rencana pembelajaran</h3>
            <p className="text-gray-600">
              Rencana pembelajaran akan muncul di sini setelah guru membuat
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {plans.map((plan) => (
              <Card key={plan._id || plan.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-3 rounded-xl">
                      <BookOpen className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="mb-1">{plan.judulKegiatan}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(plan.tanggal).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {plan.deskripsi && (
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Deskripsi</label>
                      <p className="text-gray-700">{plan.deskripsi}</p>
                    </div>
                  )}

                  {plan.bahanPerlengkapan && (
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Bahan & Perlengkapan
                      </label>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-gray-700">{plan.bahanPerlengkapan}</p>
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

import { useState, useEffect } from 'react';
import { getAllChildren, getAllTagihan } from '../../lib/api';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowLeft, CreditCard, Upload, CheckCircle, Clock, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface BillingPageProps {
  onNavigate: (page: string) => void;
}

interface Child {
  _id: string;
  namaLengkap: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Billing {
  _id: string;
  anak: string | { namaLengkap: string };
  nominal: number;
  tanggalJatuhTempo: string;
  periode: string;
  status: 'unpaid' | 'verified' | 'pending-verification' | 'pending_verification' | 'paid' | 'rejected';
  paymentProofUrl?: string;
  tanggalPembayaran?: string;
}

export function BillingPage({ onNavigate }: BillingPageProps) {
  const [selectedFile, setSelectedFile] = useState<{ [key: string]: File | null }>({});
  const [children, setChildren] = useState<Child[]>([]);
  const [billings, setBillings] = useState<Billing[]>([]);
  
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [childrenRes, billingsRes] = await Promise.all([
        getAllChildren(),
        getAllTagihan()
      ]);

      if (childrenRes.success && Array.isArray(childrenRes.data)) {
        const approved = childrenRes.data.filter((c: Child) => c.status === 'approved');
        setChildren(approved);
      }

      if (billingsRes.success && Array.isArray(billingsRes.data)) {
        setBillings(billingsRes.data);
      }
    } catch (error) {
      toast.error('Gagal memuat data');
    }
  };

  const getChildName = (childIdOrObj: string | { namaLengkap: string }) => {
    if (typeof childIdOrObj === 'string') {
      return children.find(c => c._id === childIdOrObj)?.namaLengkap || 'Unknown';
    }
    return childIdOrObj?.namaLengkap || 'Unknown';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
      case 'verified':
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Lunas
          </Badge>
        );
      case 'unpaid':
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <AlertCircle className="w-3 h-3 mr-1" />
            Belum Dibayar
          </Badge>
        );
      case 'pending-verification':
      case 'pending_verification':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Menunggu Verifikasi
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-200 text-red-800 hover:bg-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Ditolak
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleFileSelect = (billId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile({ ...selectedFile, [billId]: file });
    }
  };

  const handleUploadProof = (billId: string) => {
    const file = selectedFile[billId];
    if (!file) {
      toast.error('Mohon pilih file terlebih dahulu');
      return;
    }

    // In real app, this would upload to backend
    toast.success('Bukti pembayaran berhasil diupload! Menunggu verifikasi admin.');
    setSelectedFile({ ...selectedFile, [billId]: null });
  };

  const totalUnpaid = billings
    .filter((b: Billing) => b.status === 'unpaid')
    .reduce((sum: number, b: Billing) => sum + b.nominal, 0);

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
          <h1 className="text-3xl mb-2">Tagihan</h1>
          <p className="text-gray-600">Kelola pembayaran untuk semua anak Anda</p>
        </div>

        {/* Summary */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <p className="text-sm text-gray-600 mb-2">Belum Dibayar</p>
            <p className="text-2xl">
              Rp {totalUnpaid.toLocaleString('id-ID')}
            </p>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <p className="text-sm text-gray-600 mb-2">Menunggu Verifikasi</p>
            <p className="text-2xl">
              {billings.filter((b: Billing) => b.status === 'pending-verification' || b.status === 'pending_verification').length}
            </p>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <p className="text-sm text-gray-600 mb-2">Lunas</p>
            <p className="text-2xl">
              {billings.filter((b: Billing) => b.status === 'verified' || b.status === 'paid').length}
            </p>
          </Card>
        </div>

        {/* Bills List */}
        {billings.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="bg-gray-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="mb-2">Tidak ada tagihan</h3>
            <p className="text-gray-600">Anda tidak memiliki tagihan saat ini</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {billings.map((bill: Billing) => (
              <Card key={bill._id} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="mb-1">{bill.periode}</h3>
                        <p className="text-sm text-gray-600">{getChildName(bill.anak)}</p>
                      </div>
                      {getStatusBadge(bill.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
                      <span>Nominal: <strong className="text-gray-900">Rp {bill.nominal.toLocaleString('id-ID')}</strong></span>
                      <span>•</span>
                      <span>Jatuh Tempo: {new Date(bill.tanggalJatuhTempo).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[200px]">
                    {bill.status === 'unpaid' && (
                      <>
                        <input
                          type="file"
                          id={`file-${bill._id}`}
                          accept="image/*"
                          onChange={(e) => handleFileSelect(bill._id, e)}
                          className="hidden"
                        />
                        <label htmlFor={`file-${bill._id}`}>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full gap-2"
                            onClick={() => document.getElementById(`file-${bill._id}`)?.click()}
                          >
                            <Upload className="w-4 h-4" />
                            {selectedFile[bill._id] ? 'File Terpilih' : 'Pilih Bukti'}
                          </Button>
                        </label>
                        {selectedFile[bill._id] && (
                          <Button
                            onClick={() => handleUploadProof(bill._id)}
                            size="sm"
                            className="w-full gap-2 bg-gradient-to-r from-pink-400 to-purple-400"
                          >
                            <Upload className="w-4 h-4" />
                            Upload Bukti
                          </Button>
                        )}
                      </>
                    )}
                    {(bill.status === 'pending-verification' || bill.status === 'pending_verification') && bill.paymentProofUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2"
                        onClick={() => window.open(bill.paymentProofUrl, '_blank')}
                      >
                        <ImageIcon className="w-4 h-4" />
                        Lihat Bukti
                      </Button>
                    )}
                    {(bill.status === 'paid' || bill.status === 'verified') && (
                      <div className="flex items-center gap-2 text-sm text-green-600 justify-center">
                        <CheckCircle className="w-4 h-4" />
                        Pembayaran Terverifikasi
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

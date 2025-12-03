import { User, Child, Staff, DailyReport, LearningPlan, Billing, Complaint, SchoolProfile } from '../types';
import idanPhoto from '../components/figma/idan.jpeg';
import fadliPhoto from '../components/figma/fadli.jpeg';
import didoPhoto from '../components/figma/dido.jpeg';
import jariPhoto from '../components/figma/jari.jpeg';

export const mockSchoolProfile: SchoolProfile = {
  name: 'PAUD Tunas Ceria',
  about: 'PAUD Tunas Ceria adalah lembaga pendidikan anak usia dini yang berdedikasi untuk memberikan pendidikan berkualitas dalam lingkungan yang aman, nyaman, dan menyenangkan. Kami percaya bahwa setiap anak adalah individu yang unik dengan potensi luar biasa.',
  vision: 'Menjadi lembaga PAUD terdepan yang menghasilkan generasi cerdas, kreatif, dan berakhlak mulia.',
  mission: [
    'Memberikan pendidikan yang menyenangkan dan bermakna bagi anak usia dini',
    'Mengembangkan potensi kognitif, afektif, dan psikomotorik anak secara optimal',
    'Membangun karakter anak yang berakhlak mulia dan mencintai lingkungan',
    'Melibatkan orang tua dalam proses pendidikan anak',
  ],
  address: 'Jl. Lembah Palem 9RW.9, Pd. Klp., Kec. Duren Sawit, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13450',
  phone: '081285903055',
  email: 'career.didowp@gmail.com',
};

export const mockStaff: Staff[] = [
  {
    id: '1',
    name: 'Idan',
    position: 'Kepala Sekolah',
    photoUrl: idanPhoto,
  },
  {
    id: '2',
    name: 'Pedli',
    position: 'Guru Kelas A',
    photoUrl: fadliPhoto,
  },
  {
    id: '3',
    name: 'Dido',
    position: 'Guru Kelas B',
    photoUrl: didoPhoto,
  },
  {
    id: '4',
    name: 'TRIPACE ON TOP',
    position: 'Staff Administrasi',
    photoUrl: jariPhoto,
  },
];

export const mockUsers: User[] = [
  {
    id: 'parent1',
    email: 'parent1@example.com',
    fullName: 'Bapak Ahmad Wijaya',
    phoneNumber: '081234567890',
    role: 'parent',
  },
  {
    id: 'admin1',
    email: 'admin@paudtunasceria.sch.id',
    fullName: 'Ibu Maya Anggraini',
    phoneNumber: '081234567891',
    role: 'admin',
  },
  {
    id: 'teacher1',
    email: 'dewi@paudtunasceria.sch.id',
    fullName: 'Ibu Dewi Kartika',
    phoneNumber: '081234567892',
    role: 'teacher',
  },
  {
    id: 'teacher2',
    email: 'rina@paudtunasceria.sch.id',
    fullName: 'Ibu Rina Safitri',
    phoneNumber: '081234567893',
    role: 'teacher',
  },
];

export const mockChildren: Child[] = [
  {
    id: 'child1',
    fullName: 'Zahra Amelia Wijaya',
    dateOfBirth: '2020-05-15',
    gender: 'female',
    address: 'Jl. Melati No. 45, Surabaya',
    specialConditions: 'Tidak ada',
    allergies: 'Kacang',
    class: 'Kelas A',
    parentId: 'parent1',
    status: 'approved',
  },
  {
    id: 'child2',
    fullName: 'Raffa Aditya Wijaya',
    dateOfBirth: '2021-08-20',
    gender: 'male',
    address: 'Jl. Melati No. 45, Surabaya',
    specialConditions: 'Tidak ada',
    allergies: 'Tidak ada',
    class: 'Kelas B',
    parentId: 'parent1',
    status: 'approved',
  },
  {
    id: 'child3',
    fullName: 'Aisyah Putri Rahayu',
    dateOfBirth: '2020-03-10',
    gender: 'female',
    address: 'Jl. Mawar No. 12, Surabaya',
    specialConditions: 'Tidak ada',
    allergies: 'Tidak ada',
    class: 'Kelas A',
    parentId: 'parent2',
    status: 'approved',
  },
  {
    id: 'child4',
    fullName: 'Bintang Ramadhan',
    dateOfBirth: '2021-11-05',
    gender: 'male',
    address: 'Jl. Anggrek No. 78, Surabaya',
    specialConditions: 'Tidak ada',
    allergies: 'Tidak ada',
    class: 'Kelas B',
    parentId: 'parent3',
    status: 'pending',
  },
];

export const mockDailyReports: DailyReport[] = [
  {
    id: 'report1',
    childId: 'child1',
    date: '2025-11-10',
    class: 'Kelas A',
    activity: 'Belajar mengenal huruf A-E dengan menggunakan kartu flash. Zahra sangat antusias dan bisa mengingat semua huruf.',
    specialNotes: 'Zahra sangat aktif hari ini',
    photoUrl: 'https://images.unsplash.com/photo-1567746512136-f005499a7575?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc3Jvb20lMjBraW5kZXJnYXJ0ZW58ZW58MXx8fHwxNzYyODA1OTUwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    teacherId: 'teacher1',
  },
  {
    id: 'report2',
    childId: 'child1',
    date: '2025-11-09',
    class: 'Kelas A',
    activity: 'Menggambar dan mewarnai tema "Keluargaku". Zahra menggambar keluarganya dengan sangat baik.',
    specialNotes: 'Perlu lebih banyak latihan mewarnai dalam garis',
    teacherId: 'teacher1',
  },
  {
    id: 'report3',
    childId: 'child2',
    date: '2025-11-10',
    class: 'Kelas B',
    activity: 'Bermain balok dan menyusun bentuk. Raffa berhasil membuat menara tinggi.',
    specialNotes: 'Raffa suka berbagi dengan teman-teman',
    teacherId: 'teacher2',
  },
];

export const mockLearningPlans: LearningPlan[] = [
  {
    id: 'plan1',
    class: 'Kelas A',
    date: '2025-11-11',
    title: 'Mengenal Angka 1-10',
    description: 'Anak-anak akan belajar mengenal angka 1-10 melalui lagu, permainan, dan aktivitas menghitung benda.',
    materialsNeeded: 'Kartu angka, benda-benda kecil untuk dihitung, poster angka',
    teacherId: 'teacher1',
  },
  {
    id: 'plan2',
    class: 'Kelas A',
    date: '2025-11-12',
    title: 'Tema: Binatang Peliharaan',
    description: 'Mengenalkan berbagai jenis binatang peliharaan, suara, dan cara merawatnya.',
    materialsNeeded: 'Gambar binatang, boneka binatang, video edukasi',
    teacherId: 'teacher1',
  },
  {
    id: 'plan3',
    class: 'Kelas B',
    date: '2025-11-11',
    title: 'Bermain Peran: Profesi',
    description: 'Anak-anak akan bermain peran menjadi berbagai profesi seperti dokter, guru, dan polisi.',
    materialsNeeded: 'Kostum profesi, peralatan bermain peran',
    teacherId: 'teacher2',
  },
];

export const mockBillings: Billing[] = [
  {
    id: 'bill1',
    childId: 'child1',
    amount: 500000,
    description: 'SPP Bulan November 2025',
    dueDate: '2025-11-15',
    status: 'paid',
    paymentProofUrl: 'https://images.unsplash.com/photo-1567746512136-f005499a7575?w=400',
    createdAt: '2025-11-01',
  },
  {
    id: 'bill2',
    childId: 'child2',
    amount: 500000,
    description: 'SPP Bulan November 2025',
    dueDate: '2025-11-15',
    status: 'unpaid',
    createdAt: '2025-11-01',
  },
  {
    id: 'bill3',
    childId: 'child1',
    amount: 300000,
    description: 'Biaya Kegiatan Outdoor',
    dueDate: '2025-11-20',
    status: 'unpaid',
    createdAt: '2025-11-05',
  },
  {
    id: 'bill4',
    childId: 'child3',
    amount: 500000,
    description: 'SPP Bulan November 2025',
    dueDate: '2025-11-15',
    status: 'pending_verification',
    paymentProofUrl: 'https://images.unsplash.com/photo-1567746512136-f005499a7575?w=400',
    createdAt: '2025-11-01',
  },
];

export const mockComplaints: Complaint[] = [
  {
    id: 'complaint1',
    itemName: 'Kursi Kelas A',
    description: 'Kaki kursi patah dan berbahaya untuk anak-anak',
    photoUrl: 'https://images.unsplash.com/photo-1567746512136-f005499a7575?w=400',
    status: 'completed',
    createdBy: 'parent1',
    createdByRole: 'parent',
    createdAt: '2025-11-01',
    workProofUrl: 'https://images.unsplash.com/photo-1567746512136-f005499a7575?w=400',
    completionProofUrl: 'https://images.unsplash.com/photo-1567746512136-f005499a7575?w=400',
  },
  {
    id: 'complaint2',
    itemName: 'AC Ruang Kelas',
    description: 'AC tidak dingin, suhu ruangan sangat panas',
    photoUrl: 'https://images.unsplash.com/photo-1567746512136-f005499a7575?w=400',
    status: 'in_progress',
    createdBy: 'teacher1',
    createdByRole: 'teacher',
    createdAt: '2025-11-08',
    workProofUrl: 'https://images.unsplash.com/photo-1567746512136-f005499a7575?w=400',
  },
  {
    id: 'complaint3',
    itemName: 'Mainan Balok',
    description: 'Beberapa balok hilang dan beberapa sudah rusak',
    photoUrl: 'https://images.unsplash.com/photo-1567746512136-f005499a7575?w=400',
    status: 'new',
    createdBy: 'teacher2',
    createdByRole: 'teacher',
    createdAt: '2025-11-10',
  },
];

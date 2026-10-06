/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * البيانات التجريبية الأولية الواقعية والمترابطة لنظام إدارة المدارس
 * المدرسة: ثانوية نور الكمال (قابلة للتغيير ديناميكياً من الإعدادات)
 */

import {
  SchoolSettings,
  Student,
  Parent,
  Teacher,
  Employee,
  ClassGrade,
  Section,
  Subject,
  TimetableSlot,
  AttendanceRecord,
  GradeRecord,
  Certificate,
  TuitionFee,
  PaymentReceipt,
  Expense,
  PayrollRecord,
  TransportRoute,
  Driver,
  Vehicle,
  Announcement,
  NotificationItem,
  MessageItem,
  AuditLog,
  SmartAlert
} from '../types';

export const INITIAL_SCHOOL_SETTINGS: SchoolSettings = {
  name: 'ثانوية نور الكمال',
  logoUrl: '',
  description: 'مؤسسة تعليمية رائدة تهدف إلى بناء جيل واعٍ ومتميز علمياً وأخلاقياً وفق أحدث المعايير التربوية',
  address: 'حي المنصور - شارع 14 رمضان',
  phone: '+964 770 123 4567',
  email: 'info@noor-alkamal.edu.iq',
  website: 'www.noor-alkamal.edu.iq',
  province: 'بغداد',
  city: 'الكرخ',
  currentAcademicYear: '2025-2026',
  currency: 'د.ع',
  currencyCode: 'IQD',
  gradingSystem: '100',
  principalName: 'أ. سرمد عبد الرزاق الراوي',
  workHours: '7:30 ص - 2:00 م'
};

export const INITIAL_CLASSES: ClassGrade[] = [
  { id: 'cls-1', stage: 'متوسط', name: 'الصف الأول المتوسط', capacity: 120, currentStudentsCount: 38 },
  { id: 'cls-2', stage: 'متوسط', name: 'الصف الثاني المتوسط', capacity: 120, currentStudentsCount: 35 },
  { id: 'cls-3', stage: 'متوسط', name: 'الصف الثالث المتوسط', capacity: 120, currentStudentsCount: 42 },
  { id: 'cls-4', stage: 'إعدادي', name: 'الرابع العلمي', capacity: 90, currentStudentsCount: 32 },
  { id: 'cls-5', stage: 'إعدادي', name: 'الخامس العلمي', capacity: 90, currentStudentsCount: 30 },
  { id: 'cls-6', stage: 'إعدادي', name: 'السادس العلمي (الوزاري)', capacity: 100, currentStudentsCount: 45 },
];

export const INITIAL_SECTIONS: Section[] = [
  { id: 'sec-1', gradeId: 'cls-6', gradeName: 'السادس العلمي (الوزاري)', name: 'أ', homeroomTeacherId: 'tch-1', homeroomTeacherName: 'أ. حيدر جاسم', roomNumber: 'قاعة 101', studentsCount: 23 },
  { id: 'sec-2', gradeId: 'cls-6', gradeName: 'السادس العلمي (الوزاري)', name: 'ب', homeroomTeacherId: 'tch-2', homeroomTeacherName: 'ست نادية محمد', roomNumber: 'قاعة 102', studentsCount: 22 },
  { id: 'sec-3', gradeId: 'cls-5', gradeName: 'الخامس العلمي', name: 'أ', homeroomTeacherId: 'tch-3', homeroomTeacherName: 'أ. عمار شاكر', roomNumber: 'قاعة 103', studentsCount: 30 },
  { id: 'sec-4', gradeId: 'cls-4', gradeName: 'الرابع العلمي', name: 'أ', homeroomTeacherId: 'tch-4', homeroomTeacherName: 'ست ريم خليل', roomNumber: 'قاعة 104', studentsCount: 32 },
  { id: 'sec-5', gradeId: 'cls-3', gradeName: 'الصف الثالث المتوسط', name: 'أ', homeroomTeacherId: 'tch-5', homeroomTeacherName: 'أ. بلال طه', roomNumber: 'قاعة 105', studentsCount: 42 },
];

export const INITIAL_PARENTS: Parent[] = [
  {
    id: 'prt-1',
    fullName: 'أحمد كاظم العبيدي',
    relationship: 'أب',
    phone: '07712345001',
    email: 'ahmed.obaidi@example.com',
    job: 'مهندس استشاري',
    address: 'بغداد - المنصور',
    nationalId: '198034501239',
    childrenIds: ['std-1']
  },
  {
    id: 'prt-2',
    fullName: 'د. يوسف طارق الحلي',
    relationship: 'أب',
    phone: '07802345002',
    email: 'dr.yousif@example.com',
    job: 'طبيب اختصاص',
    address: 'بغداد - اليرموك',
    nationalId: '197823904512',
    childrenIds: ['std-2']
  },
  {
    id: 'prt-3',
    fullName: 'عمر فاضل الحديثي',
    relationship: 'أب',
    phone: '07503450033',
    email: 'omar.hadithi@example.com',
    job: 'رجل أعمال',
    address: 'بغداد - العامرية',
    nationalId: '198200192345',
    childrenIds: ['std-3']
  },
  {
    id: 'prt-4',
    fullName: 'زينب سعدون التميمي',
    relationship: 'أم',
    phone: '07709876543',
    email: 'zainab.tamimi@example.com',
    job: 'أستاذة جامعية',
    address: 'بغداد - زيونة',
    nationalId: '198544901234',
    childrenIds: ['std-4']
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    studentNumber: '20260101',
    fullName: 'مصطفى أحمد كاظم العبيدي',
    fatherName: 'أحمد كاظم',
    motherName: 'مريم جبار',
    avatar: '',
    birthDate: '2008-04-12',
    gender: 'male',
    nationality: 'عراقي',
    bloodType: 'O+',
    nationalId: '200845129034',
    phone: '07712345001',
    email: 'mustafa.ahmed@student.edu',
    address: 'بغداد - المنصور - محلة 603',
    district: 'المنصور',
    province: 'بغداد',
    stage: 'إعدادي',
    gradeId: 'cls-6',
    gradeName: 'السادس العلمي (الوزاري)',
    sectionId: 'sec-1',
    sectionName: 'أ',
    academicYear: '2025-2026',
    registrationDate: '2022-09-15',
    status: 'active',
    gpa: 96.8,
    rank: 1,
    healthStatus: 'سليم ولا يشكو من أي عوارض',
    allergies: 'لا يوجد',
    chronicDiseases: 'لا يوجد',
    medications: 'لا يوجد',
    emergencyContact: '07712345001 (والد الطالب)',
    parentId: 'prt-1',
    parentName: 'أحمد كاظم العبيدي',
    parentPhone: '07712345001',
    transportRouteId: 'rt-1',
    documents: [
      { id: 'doc-1', title: 'البطاقة الوطنية الموحدة', type: 'PDF', date: '2025-09-01' },
      { id: 'doc-2', title: 'شهادة الجنسية وشهادة التخرج المتوسطة', type: 'PDF', date: '2025-09-01' },
      { id: 'doc-3', title: 'الفحص الطبي السنوي', type: 'PDF', date: '2025-09-05' }
    ]
  },
  {
    id: 'std-2',
    studentNumber: '20260102',
    fullName: 'زينب يوسف طارق الحلي',
    fatherName: 'يوسف طارق',
    motherName: 'سناء خضير',
    avatar: '',
    birthDate: '2008-08-20',
    gender: 'female',
    nationality: 'عراقية',
    bloodType: 'A+',
    nationalId: '200889230112',
    phone: '07802345002',
    email: 'zainab.yousif@student.edu',
    address: 'بغداد - اليرموك - شارع 4 بنك',
    district: 'اليرموك',
    province: 'بغداد',
    stage: 'إعدادي',
    gradeId: 'cls-6',
    gradeName: 'السادس العلمي (الوزاري)',
    sectionId: 'sec-1',
    sectionName: 'أ',
    academicYear: '2025-2026',
    registrationDate: '2022-09-18',
    status: 'active',
    gpa: 95.2,
    rank: 2,
    healthStatus: 'سليمة',
    allergies: 'حساسية البنسلين',
    chronicDiseases: 'لا يوجد',
    medications: 'لا يوجد',
    emergencyContact: '07802345002 (والد الطالبة)',
    parentId: 'prt-2',
    parentName: 'د. يوسف طارق الحلي',
    parentPhone: '07802345002',
    transportRouteId: 'rt-2',
    documents: [
      { id: 'doc-4', title: 'البطاقة الوطنية', type: 'PDF', date: '2025-09-01' },
      { id: 'doc-5', title: 'وثيقة الثالث المتوسط المعتمدة', type: 'PDF', date: '2025-09-02' }
    ]
  },
  {
    id: 'std-3',
    studentNumber: '20260103',
    fullName: 'علي عمر فاضل الحديثي',
    fatherName: 'عمر فاضل',
    motherName: 'هالة محسن',
    avatar: '',
    birthDate: '2009-02-14',
    gender: 'male',
    nationality: 'عراقي',
    bloodType: 'B+',
    nationalId: '200912456789',
    phone: '07503450033',
    email: 'ali.omar@student.edu',
    address: 'بغداد - العامرية - حي الأطباء',
    district: 'العامرية',
    province: 'بغداد',
    stage: 'إعدادي',
    gradeId: 'cls-5',
    gradeName: 'الخامس العلمي',
    sectionId: 'sec-3',
    sectionName: 'أ',
    academicYear: '2025-2026',
    registrationDate: '2023-09-20',
    status: 'active',
    gpa: 88.5,
    rank: 5,
    healthStatus: 'سليم',
    allergies: 'لا يوجد',
    chronicDiseases: 'ربو خفيف',
    medications: 'بخاخ فنتولين عند الحاجة',
    emergencyContact: '07503450033',
    parentId: 'prt-3',
    parentName: 'عمر فاضل الحديثي',
    parentPhone: '07503450033',
    transportRouteId: 'rt-1',
    documents: [
      { id: 'doc-6', title: 'عقد التسجيل المالي', type: 'PDF', date: '2025-09-10' }
    ]
  },
  {
    id: 'std-4',
    studentNumber: '20260104',
    fullName: 'فاطمة حيدر جبار التميمي',
    fatherName: 'حيدر جبار',
    motherName: 'زينب سعدون',
    avatar: '',
    birthDate: '2010-06-11',
    gender: 'female',
    nationality: 'عراقية',
    bloodType: 'AB+',
    nationalId: '201088771122',
    phone: '07709876543',
    email: 'fatima.haider@student.edu',
    address: 'بغداد - زيونة - محلة 714',
    district: 'زيونة',
    province: 'بغداد',
    stage: 'متوسط',
    gradeId: 'cls-3',
    gradeName: 'الصف الثالث المتوسط',
    sectionId: 'sec-5',
    sectionName: 'أ',
    academicYear: '2025-2026',
    registrationDate: '2024-09-10',
    status: 'active',
    gpa: 92.4,
    rank: 3,
    healthStatus: 'ممتازة',
    allergies: 'لا يوجد',
    chronicDiseases: 'لا يوجد',
    medications: 'لا يوجد',
    emergencyContact: '07709876543 (والدة الطالبة)',
    parentId: 'prt-4',
    parentName: 'زينب سعدون التميمي',
    parentPhone: '07709876543',
    transportRouteId: 'rt-3',
    documents: [
      { id: 'doc-7', title: 'وثيقة النقل المدرسي', type: 'PDF', date: '2025-09-08' }
    ]
  }
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 'tch-1',
    fullName: 'أ. حيدر جاسم الموسوي',
    avatar: '',
    birthDate: '1984-05-15',
    phone: '07701112233',
    email: 'haider.jassim@school.edu',
    address: 'بغداد - الكرخ',
    nationalId: '198422340011',
    qualification: 'ماجستير فيزياء نووية',
    specialty: 'الفيزياء',
    university: 'جامعة بغداد - كلية العلوم',
    graduationYear: '2007',
    hireDate: '2018-09-01',
    contractType: 'دائمي',
    subjectIds: ['sub-1'],
    classIds: ['cls-6', 'cls-5'],
    workHours: 24,
    basicSalary: 1400000,
    allowances: 250000,
    bonuses: 100000,
    deductions: 50000,
    advances: 0,
    netSalary: 1700000,
    status: 'active',
    leavesCount: 2
  },
  {
    id: 'tch-2',
    fullName: 'ست نادية محمد سلمان',
    avatar: '',
    birthDate: '1988-11-20',
    phone: '07702223344',
    email: 'nadia.mohammed@school.edu',
    address: 'بغداد - المنصور',
    nationalId: '198833445566',
    qualification: 'بكالوريوس رياضيات',
    specialty: 'الرياضيات المتقدمة',
    university: 'الجامعة المستنصرية - كلية التربية',
    graduationYear: '2010',
    hireDate: '2019-10-01',
    contractType: 'دائمي',
    subjectIds: ['sub-2'],
    classIds: ['cls-6'],
    workHours: 22,
    basicSalary: 1350000,
    allowances: 200000,
    bonuses: 150000,
    deductions: 0,
    advances: 100000,
    netSalary: 1600000,
    status: 'active',
    leavesCount: 1
  },
  {
    id: 'tch-3',
    fullName: 'أ. عمار شاكر البدري',
    avatar: '',
    birthDate: '1986-03-10',
    phone: '07803334455',
    email: 'ammar.shaker@school.edu',
    address: 'بغداد - الدورة',
    nationalId: '198644556677',
    qualification: 'ماجستير كيمياء عضوية',
    specialty: 'الكيمياء',
    university: 'جامعة بغداد - كلية ابن الهيثم',
    graduationYear: '2009',
    hireDate: '2020-09-15',
    contractType: 'عقد سنوي',
    subjectIds: ['sub-3'],
    classIds: ['cls-6', 'cls-5'],
    workHours: 20,
    basicSalary: 1300000,
    allowances: 150000,
    bonuses: 50000,
    deductions: 0,
    advances: 0,
    netSalary: 1500000,
    status: 'active',
    leavesCount: 3
  },
  {
    id: 'tch-4',
    fullName: 'ست ريم خليل إبراهيم',
    avatar: '',
    birthDate: '1992-07-25',
    phone: '07504445566',
    email: 'reem.khalil@school.edu',
    address: 'بغداد - اليرموك',
    nationalId: '199255667788',
    qualification: 'ماجستير لغة إنجليزية',
    specialty: 'اللغة الإنجليزية',
    university: 'جامعة بغداد - كلية اللغات',
    graduationYear: '2014',
    hireDate: '2021-09-01',
    contractType: 'دائمي',
    subjectIds: ['sub-4'],
    classIds: ['cls-6', 'cls-4'],
    workHours: 20,
    basicSalary: 1250000,
    allowances: 180000,
    bonuses: 80000,
    deductions: 0,
    advances: 0,
    netSalary: 1510000,
    status: 'active',
    leavesCount: 0
  },
  {
    id: 'tch-5',
    fullName: 'أ. بلال طه السامرائي',
    avatar: '',
    birthDate: '1983-09-05',
    phone: '07705556677',
    email: 'bilal.taha@school.edu',
    address: 'بغداد - الأعظمية',
    nationalId: '198366778899',
    qualification: 'دكتوراه لغة عربية وبلاغة',
    specialty: 'اللغة العربية والقرآن الكريم',
    university: 'جامعة بغداد - كلية الآداب',
    graduationYear: '2006',
    hireDate: '2017-09-01',
    contractType: 'دائمي',
    subjectIds: ['sub-5'],
    classIds: ['cls-6', 'cls-3'],
    workHours: 24,
    basicSalary: 1500000,
    allowances: 300000,
    bonuses: 120000,
    deductions: 0,
    advances: 0,
    netSalary: 1920000,
    status: 'active',
    leavesCount: 1
  }
];

export const INITIAL_SUBJECTS: Subject[] = [
  { id: 'sub-1', name: 'الفيزياء الحديثة', code: 'PHYS-601', stage: 'إعدادي', gradeId: 'cls-6', gradeName: 'السادس العلمي (الوزاري)', teacherId: 'tch-1', teacherName: 'أ. حيدر جاسم', weeklyClasses: 5, maxScore: 100, passingScore: 50, description: 'ميكانيكا الكم، الكهرومغناطيسية، والفيزياء الذرية وفق المنهج العراقي الوزاري' },
  { id: 'sub-2', name: 'الرياضيات التطبيقية', code: 'MATH-601', stage: 'إعدادي', gradeId: 'cls-6', gradeName: 'السادس العلمي (الوزاري)', teacherId: 'tch-2', teacherName: 'ست نادية محمد', weeklyClasses: 6, maxScore: 100, passingScore: 50, description: 'التفاضل والتكامل، الأعداد المركبة، والهندسة الفضائية' },
  { id: 'sub-3', name: 'الكيمياء العامة والعضوية', code: 'CHEM-601', stage: 'إعدادي', gradeId: 'cls-6', gradeName: 'السادس العلمي (الوزاري)', teacherId: 'tch-3', teacherName: 'أ. عمار شاكر', weeklyClasses: 5, maxScore: 100, passingScore: 50, description: 'الثرموداينمك، الاتزان الكيميائي والأيوني، والكهربائية' },
  { id: 'sub-4', name: 'اللغة الإنجليزية التفاعلية', code: 'ENG-601', stage: 'إعدادي', gradeId: 'cls-6', gradeName: 'السادس العلمي (الوزاري)', teacherId: 'tch-4', teacherName: 'ست ريم خليل', weeklyClasses: 4, maxScore: 100, passingScore: 50, description: 'English for Iraq - منهج متقدم يشمل القواعد والكتابة والاستيعاب' },
  { id: 'sub-5', name: 'اللغة العربية والأدب', code: 'ARB-601', stage: 'إعدادي', gradeId: 'cls-6', gradeName: 'السادس العلمي (الوزاري)', teacherId: 'tch-5', teacherName: 'أ. بلال طه', weeklyClasses: 5, maxScore: 100, passingScore: 50, description: 'قواعد اللغة العربية والنصوص الأدبية والنقد' },
];

export const INITIAL_TIMETABLE: TimetableSlot[] = [
  { id: 'tt-1', day: 'الأحد', period: 1, startTime: '08:00', endTime: '08:45', gradeId: 'cls-6', sectionId: 'sec-1', subjectName: 'الرياضيات التطبيقية', teacherName: 'ست نادية محمد', roomNumber: 'قاعة 101' },
  { id: 'tt-2', day: 'الأحد', period: 2, startTime: '08:50', endTime: '09:35', gradeId: 'cls-6', sectionId: 'sec-1', subjectName: 'الفيزياء الحديثة', teacherName: 'أ. حيدر جاسم', roomNumber: 'قاعة 101' },
  { id: 'tt-3', day: 'الأحد', period: 3, startTime: '09:50', endTime: '10:35', gradeId: 'cls-6', sectionId: 'sec-1', subjectName: 'الكيمياء العامة والعضوية', teacherName: 'أ. عمار شاكر', roomNumber: 'مختبر الكيمياء' },
  { id: 'tt-4', day: 'الأحد', period: 4, startTime: '10:40', endTime: '11:25', gradeId: 'cls-6', sectionId: 'sec-1', subjectName: 'اللغة الإنجليزية', teacherName: 'ست ريم خليل', roomNumber: 'قاعة 101' },
  { id: 'tt-5', day: 'الأحد', period: 5, startTime: '11:35', endTime: '12:20', gradeId: 'cls-6', sectionId: 'sec-1', subjectName: 'اللغة العربية', teacherName: 'أ. بلال طه', roomNumber: 'قاعة 101' },
  
  { id: 'tt-6', day: 'الاثنين', period: 1, startTime: '08:00', endTime: '08:45', gradeId: 'cls-6', sectionId: 'sec-1', subjectName: 'الفيزياء الحديثة', teacherName: 'أ. حيدر جاسم', roomNumber: 'مختبر الفيزياء' },
  { id: 'tt-7', day: 'الاثنين', period: 2, startTime: '08:50', endTime: '09:35', gradeId: 'cls-6', sectionId: 'sec-1', subjectName: 'الرياضيات التطبيقية', teacherName: 'ست نادية محمد', roomNumber: 'قاعة 101' },
  { id: 'tt-8', day: 'الاثنين', period: 3, startTime: '09:50', endTime: '10:35', gradeId: 'cls-6', sectionId: 'sec-1', subjectName: 'اللغة العربية', teacherName: 'أ. بلال طه', roomNumber: 'قاعة 101' },
  { id: 'tt-9', day: 'الاثنين', period: 4, startTime: '10:40', endTime: '11:25', gradeId: 'cls-6', sectionId: 'sec-1', subjectName: 'الكيمياء العامة', teacherName: 'أ. عمار شاكر', roomNumber: 'قاعة 101' },

  { id: 'tt-10', day: 'الثلاثاء', period: 1, startTime: '08:00', endTime: '08:45', gradeId: 'cls-6', sectionId: 'sec-1', subjectName: 'الكيمياء العامة', teacherName: 'أ. عمار شاكر', roomNumber: 'قاعة 101' },
  { id: 'tt-11', day: 'الثلاثاء', period: 2, startTime: '08:50', endTime: '09:35', gradeId: 'cls-6', sectionId: 'sec-1', subjectName: 'الرياضيات التطبيقية', teacherName: 'ست نادية محمد', roomNumber: 'قاعة 101' },
  { id: 'tt-12', day: 'الثلاثاء', period: 3, startTime: '09:50', endTime: '10:35', gradeId: 'cls-6', sectionId: 'sec-1', subjectName: 'الفيزياء الحديثة', teacherName: 'أ. حيدر جاسم', roomNumber: 'قاعة 101' },

  { id: 'tt-13', day: 'الأربعاء', period: 1, startTime: '08:00', endTime: '08:45', gradeId: 'cls-6', sectionId: 'sec-1', subjectName: 'اللغة الإنجليزية', teacherName: 'ست ريم خليل', roomNumber: 'قاعة 101' },
  { id: 'tt-14', day: 'الأربعاء', period: 2, startTime: '08:50', endTime: '09:35', gradeId: 'cls-6', sectionId: 'sec-1', subjectName: 'الرياضيات التطبيقية', teacherName: 'ست نادية محمد', roomNumber: 'قاعة 101' },
  
  { id: 'tt-15', day: 'الخميس', period: 1, startTime: '08:00', endTime: '08:45', gradeId: 'cls-6', sectionId: 'sec-1', subjectName: 'اختبار وزاري تجريبي', teacherName: 'أ. حيدر جاسم', roomNumber: 'القاعة المركزية' },
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  { id: 'att-1', studentId: 'std-1', studentName: 'مصطفى أحمد كاظم العبيدي', gradeId: 'cls-6', sectionId: 'sec-1', date: '2026-10-06', status: 'present', notifiedParent: false },
  { id: 'att-2', studentId: 'std-2', studentName: 'زينب يوسف طارق الحلي', gradeId: 'cls-6', sectionId: 'sec-1', date: '2026-10-06', status: 'present', notifiedParent: false },
  { id: 'att-3', studentId: 'std-3', studentName: 'علي عمر فاضل الحديثي', gradeId: 'cls-5', sectionId: 'sec-3', date: '2026-10-06', status: 'late', note: 'تأخر 15 دقيقة بسبب الازدحام', notifiedParent: true },
  { id: 'att-4', studentId: 'std-4', studentName: 'فاطمة حيدر جبار التميمي', gradeId: 'cls-3', sectionId: 'sec-5', date: '2026-10-06', status: 'absent', note: 'غياب بدون عذر مسبق', notifiedParent: true },
  // Previous day
  { id: 'att-5', studentId: 'std-1', studentName: 'مصطفى أحمد كاظم العبيدي', gradeId: 'cls-6', sectionId: 'sec-1', date: '2026-10-05', status: 'present', notifiedParent: false },
  { id: 'att-6', studentId: 'std-2', studentName: 'زينب يوسف طارق الحلي', gradeId: 'cls-6', sectionId: 'sec-1', date: '2026-10-05', status: 'present', notifiedParent: false },
  { id: 'att-7', studentId: 'std-3', studentName: 'علي عمر فاضل الحديثي', gradeId: 'cls-5', sectionId: 'sec-3', date: '2026-10-05', status: 'excused', note: 'إجازة مرضية معتمدة من المركز الصحي', notifiedParent: true },
  { id: 'att-8', studentId: 'std-4', studentName: 'فاطمة حيدر جبار التميمي', gradeId: 'cls-3', sectionId: 'sec-5', date: '2026-10-05', status: 'present', notifiedParent: false },
];

export const INITIAL_GRADES: GradeRecord[] = [
  { id: 'grd-1', studentId: 'std-1', studentName: 'مصطفى أحمد كاظم العبيدي', subjectId: 'sub-1', subjectName: 'الفيزياء الحديثة', gradeId: 'cls-6', semester: 'نصف السنة', score: 98, maxScore: 100, date: '2026-01-20' },
  { id: 'grd-2', studentId: 'std-1', studentName: 'مصطفى أحمد كاظم العبيدي', subjectId: 'sub-2', subjectName: 'الرياضيات التطبيقية', gradeId: 'cls-6', semester: 'نصف السنة', score: 96, maxScore: 100, date: '2026-01-22' },
  { id: 'grd-3', studentId: 'std-1', studentName: 'مصطفى أحمد كاظم العبيدي', subjectId: 'sub-3', subjectName: 'الكيمياء العامة والعضوية', gradeId: 'cls-6', semester: 'نصف السنة', score: 97, maxScore: 100, date: '2026-01-24' },
  { id: 'grd-4', studentId: 'std-1', studentName: 'مصطفى أحمد كاظم العبيدي', subjectId: 'sub-4', subjectName: 'اللغة الإنجليزية التفاعلية', gradeId: 'cls-6', semester: 'نصف السنة', score: 95, maxScore: 100, date: '2026-01-26' },
  { id: 'grd-5', studentId: 'std-1', studentName: 'مصطفى أحمد كاظم العبيدي', subjectId: 'sub-5', subjectName: 'اللغة العربية والأدب', gradeId: 'cls-6', semester: 'نصف السنة', score: 98, maxScore: 100, date: '2026-01-28' },

  { id: 'grd-6', studentId: 'std-2', studentName: 'زينب يوسف طارق الحلي', subjectId: 'sub-1', subjectName: 'الفيزياء الحديثة', gradeId: 'cls-6', semester: 'نصف السنة', score: 94, maxScore: 100, date: '2026-01-20' },
  { id: 'grd-7', studentId: 'std-2', studentName: 'زينب يوسف طارق الحلي', subjectId: 'sub-2', subjectName: 'الرياضيات التطبيقية', gradeId: 'cls-6', semester: 'نصف السنة', score: 98, maxScore: 100, date: '2026-01-22' },
  { id: 'grd-8', studentId: 'std-2', studentName: 'زينب يوسف طارق الحلي', subjectId: 'sub-3', subjectName: 'الكيمياء العامة والعضوية', gradeId: 'cls-6', semester: 'نصف السنة', score: 93, maxScore: 100, date: '2026-01-24' },
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-1',
    certificateNumber: 'CERT-2026-001',
    studentId: 'std-1',
    studentName: 'مصطفى أحمد كاظم العبيدي',
    gradeName: 'السادس العلمي (الوزاري)',
    sectionName: 'الشعبة أ',
    academicYear: '2025-2026',
    date: '2026-02-05',
    grades: [
      { subjectName: 'التربية الإسلامية والقرآن', maxScore: 100, score: 99, passingScore: 50, evaluation: 'امتياز' },
      { subjectName: 'اللغة العربية وقواعدها', maxScore: 100, score: 98, passingScore: 50, evaluation: 'امتياز' },
      { subjectName: 'اللغة الإنجليزية', maxScore: 100, score: 95, passingScore: 50, evaluation: 'امتياز' },
      { subjectName: 'الرياضيات التخصصية', maxScore: 100, score: 96, passingScore: 50, evaluation: 'امتياز' },
      { subjectName: 'الفيزياء الحديثة', maxScore: 100, score: 98, passingScore: 50, evaluation: 'امتياز' },
      { subjectName: 'الكيمياء العامة والعضوية', maxScore: 100, score: 97, passingScore: 50, evaluation: 'امتياز' },
      { subjectName: 'علم الأحياء العام', maxScore: 100, score: 95, passingScore: 50, evaluation: 'امتياز' },
    ],
    totalScore: 678,
    maxTotalScore: 700,
    percentage: 96.8,
    overallEvaluation: 'امتياز مع مرتبة الشرف الأولى',
    status: 'passed',
    principalSignature: 'أ. سرمد عبد الرزاق الراوي',
    qrCodeData: 'CERT:NKHS-2026-001|STD:20260101|NAME:Mustafa-Ahmed|GPA:96.8|VERIFIED:TRUE'
  }
];

export const INITIAL_TUITION_FEES: TuitionFee[] = [
  {
    id: 'fee-1',
    studentId: 'std-1',
    studentName: 'مصطفى أحمد كاظم العبيدي',
    gradeName: 'السادس العلمي (الوزاري)',
    academicYear: '2025-2026',
    totalFee: 2500000,
    paidAmount: 2500000,
    remainingAmount: 0,
    dueDate: '2026-03-01',
    status: 'paid',
    installments: [
      { id: 'inst-1', title: 'القسط الأول (التسجيل)', amount: 1000000, dueDate: '2025-09-15', status: 'paid', paidDate: '2025-09-14' },
      { id: 'inst-2', title: 'القسط الثاني (منتصف السنة)', amount: 800000, dueDate: '2025-12-15', status: 'paid', paidDate: '2025-12-10' },
      { id: 'inst-3', title: 'القسط الثالث (النهائي)', amount: 700000, dueDate: '2026-03-01', status: 'paid', paidDate: '2026-02-28' },
    ]
  },
  {
    id: 'fee-2',
    studentId: 'std-2',
    studentName: 'زينب يوسف طارق الحلي',
    gradeName: 'السادس العلمي (الوزاري)',
    academicYear: '2025-2026',
    totalFee: 2500000,
    paidAmount: 1800000,
    remainingAmount: 700000,
    dueDate: '2026-04-01',
    status: 'partial',
    installments: [
      { id: 'inst-4', title: 'القسط الأول (التسجيل)', amount: 1000000, dueDate: '2025-09-15', status: 'paid', paidDate: '2025-09-15' },
      { id: 'inst-5', title: 'القسط الثاني', amount: 800000, dueDate: '2025-12-15', status: 'paid', paidDate: '2025-12-12' },
      { id: 'inst-6', title: 'القسط الثالث (المتبقي)', amount: 700000, dueDate: '2026-04-01', status: 'unpaid' },
    ]
  },
  {
    id: 'fee-3',
    studentId: 'std-3',
    studentName: 'علي عمر فاضل الحديثي',
    gradeName: 'الخامس العلمي',
    academicYear: '2025-2026',
    totalFee: 2200000,
    paidAmount: 1000000,
    remainingAmount: 1200000,
    dueDate: '2026-01-15',
    status: 'overdue',
    installments: [
      { id: 'inst-7', title: 'القسط الأول', amount: 1000000, dueDate: '2025-09-15', status: 'paid', paidDate: '2025-09-16' },
      { id: 'inst-8', title: 'القسط الثاني (متأخر)', amount: 600000, dueDate: '2026-01-15', status: 'unpaid' },
      { id: 'inst-9', title: 'القسط الثالث', amount: 600000, dueDate: '2026-04-15', status: 'unpaid' },
    ]
  },
  {
    id: 'fee-4',
    studentId: 'std-4',
    studentName: 'فاطمة حيدر جبار التميمي',
    gradeName: 'الصف الثالث المتوسط',
    academicYear: '2025-2026',
    totalFee: 1800000,
    paidAmount: 1800000,
    remainingAmount: 0,
    dueDate: '2026-02-01',
    status: 'paid',
    installments: [
      { id: 'inst-10', title: 'القسط الأول', amount: 900000, dueDate: '2025-09-15', status: 'paid', paidDate: '2025-09-10' },
      { id: 'inst-11', title: 'القسط الثاني', amount: 900000, dueDate: '2026-01-15', status: 'paid', paidDate: '2026-01-12' },
    ]
  }
];

export const INITIAL_RECEIPTS: PaymentReceipt[] = [
  {
    id: 'rec-1',
    receiptNumber: 'RCPT-2026-1042',
    studentId: 'std-1',
    studentName: 'مصطفى أحمد كاظم العبيدي',
    gradeName: 'السادس العلمي (الوزاري)',
    amount: 700000,
    reason: 'قسط دراسي',
    date: '2026-02-28',
    employeeName: 'المحاسب عثمان فؤاد',
    paymentMethod: 'نقدي',
    remainingBalance: 0,
    qrCodeData: 'RCPT:1042|STD:std-1|AMT:700000|DATE:2026-02-28|BAL:0',
    notes: 'تسديد القسط النهائي للعام الدراسي 2025-2026 بالكامل'
  },
  {
    id: 'rec-2',
    receiptNumber: 'RCPT-2026-1043',
    studentId: 'std-2',
    studentName: 'زينب يوسف طارق الحلي',
    gradeName: 'السادس العلمي (الوزاري)',
    amount: 800000,
    reason: 'قسط دراسي',
    date: '2025-12-12',
    employeeName: 'المحاسب عثمان فؤاد',
    paymentMethod: 'تحويل زين كاش',
    remainingBalance: 700000,
    qrCodeData: 'RCPT:1043|STD:std-2|AMT:800000|DATE:2025-12-12|BAL:700000',
    notes: 'الدفعة الثانية - التحويل برقم مرجعي ZC-889102'
  },
  {
    id: 'rec-3',
    receiptNumber: 'RCPT-2026-1044',
    studentId: 'std-3',
    studentName: 'علي عمر فاضل الحديثي',
    gradeName: 'الخامس العلمي',
    amount: 150000,
    reason: 'كتب وقرطاسية',
    date: '2025-09-20',
    employeeName: 'المحاسب عثمان فؤاد',
    paymentMethod: 'نقدي',
    remainingBalance: 1200000,
    qrCodeData: 'RCPT:1044|STD:std-3|AMT:150000|DATE:2025-09-20',
    notes: 'تسليم الكتب المنهجية وحقيبة المستلزمات'
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  { id: 'exp-1', expenseNumber: 'EXP-2026-081', category: 'الكهرباء والمولدات', amount: 850000, date: '2026-10-01', beneficiary: 'مولدة المنصور الأهلية', paymentMethod: 'نقدي', description: 'اشتراك مولدة الديزل لإنارة المدرسة وتشغيل أجهزة التكييف لمدة شهر', employeeName: 'عثمان فؤاد' },
  { id: 'exp-2', expenseNumber: 'EXP-2026-082', category: 'الإنترنت والاتصالات', amount: 180000, date: '2026-10-02', beneficiary: 'شركة إيرثلنك للألياف الضوئية', paymentMethod: 'تحويل بنكي', description: 'اشتراك إنترنت فايبر عالي السرعة لربط غرف التدريس والإدارة والمختبرات', employeeName: 'عثمان فؤاد' },
  { id: 'exp-3', expenseNumber: 'EXP-2026-083', category: 'القرطاسية والكتب', amount: 420000, date: '2026-10-03', beneficiary: 'مطبعة دار السلام ببغداد', paymentMethod: 'نقدي', description: 'طباعة أوراق الامتحانات الشهرية وسجلات الحضور والغياب المدرسية', employeeName: 'عثمان فؤاد' },
  { id: 'exp-4', expenseNumber: 'EXP-2026-084', category: 'الصيانة والترميم', amount: 320000, date: '2026-10-04', beneficiary: 'ورشة الرافدين الفنية', paymentMethod: 'نقدي', description: 'صيانة مكيفات المختبرات والقاعة الامتحانية الرئيسية', employeeName: 'عثمان فؤاد' },
  { id: 'exp-5', expenseNumber: 'EXP-2026-085', category: 'الوقود والنقل', amount: 550000, date: '2026-10-05', beneficiary: 'محطة وقود الكرخ', paymentMethod: 'نقدي', description: 'تزويد حافلات النقل المدرسي بوقود الديزل المخصص لأسبوعين', employeeName: 'عثمان فؤاد' },
];

export const INITIAL_PAYROLL: PayrollRecord[] = [
  { id: 'pay-1', staffId: 'tch-1', staffName: 'أ. حيدر جاسم الموسوي', role: 'مدرس فيزياء', month: '2026-09', basicSalary: 1400000, transportAllowance: 100000, otherAllowances: 150000, bonuses: 100000, overtime: 0, deductions: 50000, advances: 0, absencesDeduction: 0, netSalary: 1700000, status: 'مدفوع', paymentDate: '2026-09-30' },
  { id: 'pay-2', staffId: 'tch-2', staffName: 'ست نادية محمد سلمان', role: 'مدرسة رياضيات', month: '2026-09', basicSalary: 1350000, transportAllowance: 100000, otherAllowances: 100000, bonuses: 150000, overtime: 0, deductions: 0, advances: 100000, absencesDeduction: 0, netSalary: 1600000, status: 'مدفوع', paymentDate: '2026-09-30' },
  { id: 'pay-3', staffId: 'tch-3', staffName: 'أ. عمار شاكر البدري', role: 'مدرس كيمياء', month: '2026-09', basicSalary: 1300000, transportAllowance: 100000, otherAllowances: 50000, bonuses: 50000, overtime: 0, deductions: 0, advances: 0, absencesDeduction: 0, netSalary: 1500000, status: 'مدفوع', paymentDate: '2026-09-30' },
  { id: 'pay-4', staffId: 'emp-1', staffName: 'عثمان فؤاد الدليمي', role: 'محاسب عام', month: '2026-09', basicSalary: 1100000, transportAllowance: 100000, otherAllowances: 50000, bonuses: 100000, overtime: 50000, deductions: 0, advances: 0, absencesDeduction: 0, netSalary: 1400000, status: 'مدفوع', paymentDate: '2026-09-30' },
];

export const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'emp-1', fullName: 'عثمان فؤاد الدليمي', roleType: 'محاسب', phone: '07703344112', email: 'accountant@noor-alkamal.edu.iq', avatar: '', basicSalary: 1100000, hireDate: '2021-01-10', status: 'نشط', leaves: 1 },
  { id: 'emp-2', fullName: 'مروان خضير الكرخي', roleType: 'مشرف', phone: '07804455223', email: 'supervisor@noor-alkamal.edu.iq', avatar: '', basicSalary: 1000000, hireDate: '2022-03-01', status: 'نشط', leaves: 0 },
  { id: 'emp-3', fullName: 'سناء عدنان هاشم', roleType: 'استقبال', phone: '07705566334', email: 'reception@noor-alkamal.edu.iq', avatar: '', basicSalary: 850000, hireDate: '2023-09-01', status: 'نشط', leaves: 2 },
  { id: 'emp-4', fullName: 'أبو أحمد البغدادي', roleType: 'حارس', phone: '07506677445', email: 'security@noor-alkamal.edu.iq', avatar: '', basicSalary: 750000, hireDate: '2020-05-15', status: 'نشط', leaves: 0 },
];

export const INITIAL_DRIVERS: Driver[] = [
  { id: 'drv-1', fullName: 'جاسم محمد كاظم', phone: '07708899001', avatar: '', address: 'بغداد - الغزالية', nationalId: '197511223344', licenseNumber: 'IRQ-BAG-44912', licenseType: 'عمومي', licenseExpiryDate: '2026-11-20', hireDate: '2020-09-01', salary: 850000, routeId: 'rt-1' },
  { id: 'drv-2', fullName: 'سامر قاسم العاني', phone: '07809900112', avatar: '', address: 'بغداد - الدورة', nationalId: '198122334455', licenseNumber: 'IRQ-BAG-33810', licenseType: 'عمومي', licenseExpiryDate: '2026-10-15', hireDate: '2021-09-01', salary: 850000, routeId: 'rt-2' },
  { id: 'drv-3', fullName: 'تحسين خليل العباسي', phone: '07501122334', avatar: '', address: 'بغداد - الكاظمية', nationalId: '197933445566', licenseNumber: 'IRQ-BAG-88123', licenseType: 'عمومي', licenseExpiryDate: '2027-04-10', hireDate: '2022-09-01', salary: 850000, routeId: 'rt-3' },
];

export const INITIAL_VEHICLES: Vehicle[] = [
  { id: 'veh-1', type: 'حافلة تويوتا كوستر', model: 'Coaster High Roof', makeYear: '2022', color: 'أبيض وأزرق', plateNumber: 'بغداد 42195 أ', seatsCapacity: 30, status: 'نشطة', inspectionExpiryDate: '2027-01-15', insuranceExpiryDate: '2027-01-15' },
  { id: 'veh-2', type: 'حافلة هيونداي كاونتي', model: 'County Deluxe', makeYear: '2023', color: 'أبيض وأزرق', plateNumber: 'بغداد 58102 ب', seatsCapacity: 28, status: 'نشطة', inspectionExpiryDate: '2026-10-25', insuranceExpiryDate: '2026-10-25' },
  { id: 'veh-3', type: 'حافلة تويوتا هايس', model: 'HiAce Commuter', makeYear: '2021', color: 'أبيض', plateNumber: 'بغداد 19284 ط', seatsCapacity: 15, status: 'نشطة', inspectionExpiryDate: '2027-06-30', insuranceExpiryDate: '2027-06-30' },
];

export const INITIAL_ROUTES: TransportRoute[] = [
  { id: 'rt-1', routeNumber: 'خط 101', name: 'خط المنصور - اليرموك - القادسية', startPoint: 'حي المنصور - شارع دمشق', endPoint: 'مقر المدرسة', neighborhoods: ['المنصور', 'اليرموك', 'القادسية', 'حي الحارثية'], morningTime: '06:45 ص', afternoonTime: '02:15 م', driverId: 'drv-1', driverName: 'جاسم محمد كاظم', driverPhone: '07708899001', vehicleId: 'veh-1', vehiclePlate: 'بغداد 42195 أ', studentsCount: 26, capacity: 30 },
  { id: 'rt-2', routeNumber: 'خط 102', name: 'خط العامرية - الغزالية - الخضراء', startPoint: 'العامرية - شارع العسل', endPoint: 'مقر المدرسة', neighborhoods: ['العامرية', 'حي الخضراء', 'الغزالية'], morningTime: '06:40 ص', afternoonTime: '02:15 م', driverId: 'drv-2', driverName: 'سامر قاسم العاني', driverPhone: '07809900112', vehicleId: 'veh-2', vehiclePlate: 'بغداد 58102 ب', studentsCount: 24, capacity: 28 },
  { id: 'rt-3', routeNumber: 'خط 103', name: 'خط زيونة - شارع فلسطين - الكرادة', startPoint: 'زيونة - ساحة ميسلون', endPoint: 'مقر المدرسة', neighborhoods: ['زيونة', 'شارع فلسطين', 'الكرادة خارج'], morningTime: '06:30 ص', afternoonTime: '02:20 م', driverId: 'drv-3', driverName: 'تحسين خليل العباسي', driverPhone: '07501122334', vehicleId: 'veh-3', vehiclePlate: 'بغداد 19284 ط', studentsCount: 14, capacity: 15 },
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  { id: 'anc-1', type: 'إعلان', title: 'بدء التسجيل للامتحانات الشاملة التجريبية لطلبة السادس الإعدادي', content: 'تعلن إدارة ثانوية نور الكمال عن إطلاق دورة الاختبارات الوزارية الشاملة والمحاكية للامتحانات العامة ابتداءً من الأسبوع القادم.', date: '2026-10-05', expiryDate: '2026-10-25', author: 'إدارة المدرسة', targetAudience: 'الجميع' },
  { id: 'anc-2', type: 'اجتماع', title: 'اجتماع مجلس الآباء والمعلمين للفصل الدراسي الأول', content: 'ندعو أولياء الأمور الكرام لحضور الاجتماع الدوري لمناقشة المستوى الدراسي للطلبة وخطط التطوير يوم السبت القادم الساعة 10:00 صباحاً.', date: '2026-10-04', expiryDate: '2026-10-12', author: 'أ. سرمد عبد الرزاق', targetAudience: 'أولياء الأمور' },
  { id: 'anc-3', type: 'عطلة', title: 'عطلة رسمية بمناسبة العيد الوطني لجمهورية العراق', content: 'تعطل الدوامات الرسمية يوم الخميس القادم وفق التوجيه الوزاري الرسمي، متمنين لبلدنا دوام الأمن والازدهار.', date: '2026-10-01', expiryDate: '2026-10-07', author: 'الإدارة العامة', targetAudience: 'الجميع' },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: 'notif-1', title: 'تسديد قسط بنجاح', message: 'تم استلام قسط دراسي للطالب مصطفى العبيدي بمبلغ 700,000 د.ع وتوليد سند القبض #1042', type: 'fees', timestamp: 'منذ ساعتين', read: false },
  { id: 'notif-2', title: 'تنبيه غياب طالب', message: 'سُجل غياب الطالبة فاطمة التميمي اليوم 2026-10-06 وتم إشعار ولي الأمر هاتفياً', type: 'attendance', timestamp: 'منذ 3 ساعات', read: false },
  { id: 'notif-3', title: 'رصد درجات نصف السنة', message: 'أنهى أ. حيدر جاسم إدخال وتدقيق درجات مادة الفيزياء للصف السادس العلمي', type: 'grades', timestamp: 'منذ يوم', read: true },
  { id: 'notif-4', title: 'تنبيه تجديد رخصة قيادة', message: 'تنتهي رخصة قيادة السائق سامر قاسم (خط 102) خلال 9 أيام. يرجى المتابعة', type: 'system', timestamp: 'منذ يومين', read: false },
];

export const INITIAL_MESSAGES: MessageItem[] = [
  { id: 'msg-1', senderId: 'prt-1', senderName: 'أحمد كاظم العبيدي (ولي أمر مصطفى)', senderRole: 'parent', receiverId: 'admin', receiverName: 'إدارة المدرسة', receiverRole: 'admin', content: 'السلام عليكم أستاذنا الفاضل، نود الاستفسار عن موعد المعسكر العلمي لطلبة السادس قبل الامتحانات الوزارية، وشكراً لجهودكم المتميزة.', timestamp: 'اليوم 09:15 ص', isRead: true },
  { id: 'msg-2', senderId: 'admin', senderName: 'إدارة المدرسة', senderRole: 'admin', receiverId: 'prt-1', receiverName: 'أحمد كاظم العبيدي', receiverRole: 'parent', content: 'وعليكم السلام ورحمة الله أبا مصطفى، المعسكر سينطلق يوم السبت المقبل وسنرسل لكم الجدول التفصيلي اليوم بإذن الله.', timestamp: 'اليوم 09:30 ص', isRead: true },
  { id: 'msg-3', senderId: 'tch-1', senderName: 'أ. حيدر جاسم', senderRole: 'teacher', receiverId: 'admin', receiverName: 'إدارة المدرسة', receiverRole: 'admin', content: 'حضرة المدير المحترم، تم تجهيز أسئلة الاختبار النموذجي لمادة الفيزياء وسأقوم بمشاركتها مع حضرتك للاعتماد.', timestamp: 'أمس 01:20 م', isRead: false },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'aud-1', userName: 'أ. سرمد عبد الرزاق (المدير)', userRole: 'Administrator', action: 'اعتماد نتائج', department: 'الامتحانات والشهادات', affectedData: 'شهادة الطالب مصطفى أحمد كاظم #CERT-2026-001', timestamp: '2026-10-06 09:30:15' },
  { id: 'aud-2', userName: 'عثمان فؤاد (المحاسب)', userRole: 'Accountant', action: 'تسجيل سند قبض مالي', department: 'الحسابات والمالية', affectedData: 'سند رقم RCPT-2026-1042 بمبلغ 700,000 د.ع', timestamp: '2026-10-06 08:45:00' },
  { id: 'aud-3', userName: 'أ. حيدر جاسم (مدرس)', userRole: 'Teacher', action: 'تسجيل حضور وغياب', department: 'شؤون الطلبة', affectedData: 'حضور شعبة السادس العلمي (أ) لتاريخ 2026-10-06', timestamp: '2026-10-06 08:05:22' },
  { id: 'aud-4', userName: 'أ. سرمد عبد الرزاق (المدير)', userRole: 'Administrator', action: 'تعديل إعدادات المدرسة', department: 'الإعدادات العامة', affectedData: 'تحديث بيانات التواصل وأوقات الدوام الرسمي', timestamp: '2026-10-05 14:10:00' },
];

export const INITIAL_SMART_ALERTS: SmartAlert[] = [
  { id: 'alt-1', type: 'overdue_fee', title: 'قسط دراسي متأخر لأكثر من 30 يوماً', description: 'الطالب علي عمر الحديثي (الخامس العلمي) لديه قسط متأخر بقيمة 600,000 د.ع استحق منذ 2026-01-15.', severity: 'error', date: '2026-10-06', targetSection: 'fees' },
  { id: 'alt-2', type: 'license_expiring', title: 'اقتراب موعد انتهاء رخصة قيادة سائق', description: 'رخصة قيادة السائق سامر قاسم (سائق خط 102 العامرية) تنتهي بتاريخ 2026-10-15 (متبقي 9 أيام).', severity: 'warning', date: '2026-10-06', targetSection: 'transport' },
  { id: 'alt-3', type: 'attendance_drop', title: 'تراجع ملحوظ في نسبة الحضور لشعبة محددة', description: 'سجلت شعبة الصف الثالث المتوسط غياب 3 طلاب متكرر خلال هذا الأسبوع. ينصح بإرسال إشعار تفاعلي لأولياء الأمور.', severity: 'info', date: '2026-10-06', targetSection: 'attendance' },
  { id: 'alt-4', type: 'high_expenses', title: 'ارتفاع مصروفات الوقود والمحروقات', description: 'تجاوزت مصروفات وقود الحافلات لشهر أكتوبر النسبة المعتادة بنسبة 14% بسبب إضافة خطوط جديدة.', severity: 'info', date: '2026-10-05', targetSection: 'expenses' }
];

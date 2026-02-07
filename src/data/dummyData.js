export const subjects = ['Maths', 'Physics', 'English', 'Hindi', 'Science', 'Chemistry', 'Biology'];

export const tutors = [
  {
    id: 1,
    name: 'Dr. Sharma',
    subjects: ['Maths', 'Physics'],
    email: 'sharma@tutor.com',
    experience: '5 years',
    availability: 'Full-time',
    rating: 4.8,
    hourlyRate: 500
  },
  {
    id: 2,
    name: 'Prof. Gupta',
    subjects: ['English', 'Hindi'],
    email: 'gupta@tutor.com',
    experience: '7 years',
    availability: 'Part-time',
    rating: 4.9,
    hourlyRate: 450
  },
  {
    id: 3,
    name: 'Ms. Patel',
    subjects: ['Science', 'Chemistry', 'Biology'],
    email: 'patel@tutor.com',
    experience: '4 years',
    availability: 'Full-time',
    rating: 4.7,
    hourlyRate: 400
  },
  {
    id: 4,
    name: 'Mr. Kumar',
    subjects: ['Maths', 'Science'],
    email: 'kumar@tutor.com',
    experience: '6 years',
    availability: 'Full-time',
    rating: 4.6,
    hourlyRate: 550
  },
  {
    id: 5,
    name: 'Ms. Singh',
    subjects: ['English', 'Hindi', 'Physics'],
    email: 'singh@tutor.com',
    experience: '3 years',
    availability: 'Part-time',
    rating: 4.5,
    hourlyRate: 350
  },
  {
    id: 6,
    name: 'Dr. Reddy',
    subjects: ['Chemistry', 'Biology'],
    email: 'reddy@tutor.com',
    experience: '8 years',
    availability: 'Full-time',
    rating: 4.9,
    hourlyRate: 600
  }
];

export const students = [
  {
    id: 1,
    name: 'Rahul Verma',
    email: 'rahul@student.com',
    grade: '10th',
    phone: '9876543210',
    assignments: {
      Maths: { tutorId: 1, tutorName: 'Dr. Sharma' },
      Physics: { tutorId: 1, tutorName: 'Dr. Sharma' },
      English: null,
      Hindi: { tutorId: 2, tutorName: 'Prof. Gupta' },
      Science: null,
      Chemistry: null,
      Biology: null
    },
    status: 'partially'
  },
  {
    id: 2,
    name: 'Priya Sharma',
    email: 'priya@student.com',
    grade: '11th',
    phone: '9876543211',
    assignments: {
      Maths: { tutorId: 4, tutorName: 'Mr. Kumar' },
      Physics: { tutorId: 5, tutorName: 'Ms. Singh' },
      English: { tutorId: 2, tutorName: 'Prof. Gupta' },
      Hindi: { tutorId: 2, tutorName: 'Prof. Gupta' },
      Science: { tutorId: 4, tutorName: 'Mr. Kumar' },
      Chemistry: { tutorId: 6, tutorName: 'Dr. Reddy' },
      Biology: { tutorId: 6, tutorName: 'Dr. Reddy' }
    },
    status: 'assigned'
  },
  {
    id: 3,
    name: 'Amit Patel',
    email: 'amit@student.com',
    grade: '9th',
    phone: '9876543212',
    assignments: {
      Maths: null,
      Physics: null,
      English: null,
      Hindi: null,
      Science: null,
      Chemistry: null,
      Biology: null
    },
    status: 'unassigned'
  },
  {
    id: 4,
    name: 'Sneha Reddy',
    email: 'sneha@student.com',
    grade: '12th',
    phone: '9876543213',
    assignments: {
      Maths: { tutorId: 1, tutorName: 'Dr. Sharma' },
      Physics: null,
      English: { tutorId: 5, tutorName: 'Ms. Singh' },
      Hindi: null,
      Science: null,
      Chemistry: { tutorId: 3, tutorName: 'Ms. Patel' },
      Biology: null
    },
    status: 'partially'
  },
  {
    id: 5,
    name: 'Vikram Singh',
    email: 'vikram@student.com',
    grade: '10th',
    phone: '9876543214',
    assignments: {
      Maths: null,
      Physics: { tutorId: 1, tutorName: 'Dr. Sharma' },
      English: null,
      Hindi: null,
      Science: { tutorId: 3, tutorName: 'Ms. Patel' },
      Chemistry: null,
      Biology: null
    },
    status: 'partially'
  }
];


// data/dummyData.js
export const initialEvents = {
  '2024-01-15': [
    {
      time: '9:00 AM - 5:00 PM',
      subject: 'Mathematics',
      studentName: 'John and Senos',
      location: 'Institute of Mathematics',
      reminder: '15 minutes before'
    },
    {
      time: '3:00 PM - 5:00 PM',
      subject: 'Physics',
      studentName: 'John and Senos',
      location: 'Science Lab',
      reminder: '30 minutes before'
    }
  ],
  '2024-01-16': [
    {
      time: '10:00 AM - 12:00 PM',
      subject: 'Content Finalizing',
      studentName: 'Basith Loose',
      location: 'Online Meeting',
      reminder: '10 minutes before'
    }
  ],
  '2024-01-17': [
    {
      time: '2:00 PM - 4:00 PM',
      subject: 'Chemistry',
      studentName: 'Sarah Wilson',
      location: 'Chemistry Lab',
      reminder: '15 minutes before'
    }
  ],
  '2024-01-18': [
    {
      time: '11:00 AM - 1:00 PM',
      subject: 'Biology',
      studentName: 'Michael Chen',
      location: 'Biology Lab',
      reminder: '20 minutes before'
    }
  ]
};

export const initialTopics = {
  '2024-01-15': [
    'Algebra: Quadratic Equations',
    'Geometry: Triangles and Circles',
    'Calculus: Derivatives',
    'Physics: Newton\'s Laws'
  ],
  '2024-01-16': [
    'Content Review and Editing',
    'Project Planning',
    'Documentation'
  ],
  '2024-01-17': [
    'Chemical Reactions',
    'Organic Chemistry Basics',
    'Lab Safety Procedures'
  ],
  '2024-01-18': [
    'Cell Biology',
    'Genetics Basics',
    'Human Anatomy'
  ]
};
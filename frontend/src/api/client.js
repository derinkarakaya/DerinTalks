const BASE_URL = '/api';

export const getStoredToken = () => localStorage.getItem('derintalks_token');
export const setStoredToken = (token) => localStorage.setItem('derintalks_token', token);
export const removeStoredToken = () => localStorage.removeItem('derintalks_token');

export const getStoredUser = () => {
  try {
    const data = localStorage.getItem('derintalks_user');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};
export const setStoredUser = (user) => localStorage.setItem('derintalks_user', JSON.stringify(user));
export const removeStoredUser = () => localStorage.removeItem('derintalks_user');

async function request(endpoint, options = {}) {
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.detail || 'Bir hata oluştu. Lütfen tekrar deneyin.';
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Auth (Direct /login & /register with /api fallback)
  login: async (email, password) => {
    try {
      const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.detail || 'E-posta veya şifre hatalı.');
      }
      return data;
    } catch (err) {
      if (err.message && (err.message.includes('Failed to fetch') || err.message.includes('404'))) {
        return request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      }
      throw err;
    }
  },
  register: async (payload) => {
    try {
      const res = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.detail || 'Kayıt işlemi başarısız.');
      }
      return data;
    } catch (err) {
      if (err.message && (err.message.includes('Failed to fetch') || err.message.includes('404'))) {
        return request('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
      }
      throw err;
    }
  },
  demoLogin: (role) => request(`/auth/demo/${role}`, { method: 'POST' }),
  getMe: () => request('/auth/me'),

  // Curriculum
  getLevels: () => request('/curriculum/levels'),
  getModules: (level, moduleType) => {
    const params = new URLSearchParams();
    if (moduleType) params.append('module_type', moduleType);
    return request(`/curriculum/modules/${level}?${params.toString()}`);
  },
  getModuleDetail: (id) => request(`/curriculum/module/${id}`),
  submitModule: (moduleId, score, answers) => request('/curriculum/submit', {
    method: 'POST',
    body: JSON.stringify({ module_id: moduleId, score, answers })
  }),

  // Flashcards & SRS
  getFlashcards: (level, box) => {
    const params = new URLSearchParams();
    if (level && level !== 'ALL') params.append('level', level);
    if (box) params.append('box', box);
    return request(`/flashcards/list?${params.toString()}`);
  },
  getFlashcardStats: () => request('/flashcards/stats'),
  reviewFlashcard: (flashcardId, rating) => request('/flashcards/review', {
    method: 'POST',
    body: JSON.stringify({ flashcard_id: flashcardId, rating })
  }),

  // Exams
  getExams: (examType) => {
    const params = new URLSearchParams();
    if (examType) params.append('exam_type', examType);
    return request(`/exams/list?${params.toString()}`);
  },
  getExamDetail: (id) => request(`/exams/exam/${id}`),
  getPracticeQuestions: (examType, category) => {
    const params = new URLSearchParams();
    if (examType) params.append('exam_type', examType);
    if (category) params.append('category', category);
    return request(`/exams/questions/practice?${params.toString()}`);
  },
  getExamCategories: (examType) => request(`/exams/categories/${examType}`),
  submitExam: (submission) => request('/exams/submit', {
    method: 'POST',
    body: JSON.stringify(submission)
  }),
  getMyExamResults: () => request('/exams/my-results'),

  // Schedule
  getSchedule: () => request('/schedule/list'),
  createScheduleItem: (item) => request('/schedule/create', {
    method: 'POST',
    body: JSON.stringify(item)
  }),
  deleteScheduleItem: (id) => request(`/schedule/${id}`, { method: 'DELETE' }),

  // Teacher CMS & Analytics
  getStudentsTracking: () => request('/teacher/students-tracking'),
  createModule: (data) => request('/teacher/modules', { method: 'POST', body: JSON.stringify(data) }),
  updateModule: (id, data) => request(`/teacher/modules/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteModule: (id) => request(`/teacher/modules/${id}`, { method: 'DELETE' }),
  createFlashcard: (data) => request('/teacher/flashcards', { method: 'POST', body: JSON.stringify(data) }),
  updateFlashcard: (id, data) => request(`/teacher/flashcards/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteFlashcard: (id) => request(`/teacher/flashcards/${id}`, { method: 'DELETE' }),
  createExamQuestion: (data) => request('/teacher/exam-questions', { method: 'POST', body: JSON.stringify(data) }),
  updateExamQuestion: (id, data) => request(`/teacher/exam-questions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteExamQuestion: (id) => request(`/teacher/exam-questions/${id}`, { method: 'DELETE' }),

  // Student Dashboard
  getStudentDashboardSummary: () => request('/student/dashboard-summary'),
};

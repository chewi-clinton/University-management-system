const API_BASE = 'http://localhost:5000/api/auth';

export const loginUser = async (email, password) => {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    window.dispatchEvent(new Event('userChanged'));
  }
  return data;
};

export const registerUser = async (name, email, password, role) => {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed');
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    window.dispatchEvent(new Event('userChanged'));
  }
  return data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.dispatchEvent(new Event('userChanged'));
};

export function getCurrentUser() {
  const raw = localStorage.getItem('user')
  if (!raw) return null
  try {
    const u = JSON.parse(raw)
    // normalize studentId from possible shapes so components always get it
    // Only map explicit student identifiers — do NOT treat the top-level user id
    // as a student id. The user id is different from the student._id in the DB.
    u.studentId = u.studentId
      || u.student?.studentId
      || u.student?.id
      || u.student?._id
      || null
    return u
  } catch (e) {
    return null
  }
}

export function setCurrentUser(user) {
  if (!user) { localStorage.removeItem('user'); return }
  // ensure studentId persisted in localStorage
  user.studentId = user.studentId
    || user.student?.studentId
    || user.student?.id
    || user.student?._id
    || null
  localStorage.setItem('user', JSON.stringify(user))
}

export const getToken = () => localStorage.getItem('token');
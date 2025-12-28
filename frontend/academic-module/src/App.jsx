import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import StudentRoutes from './routes/StudentRoutes.jsx';
import ToastContainer from './components/shared/feedback/ToastContainer.jsx';

// Import all CSS files
import './styles/variables.css';
import './styles/global.css';
import './styles/animations.css';
import './styles/app.css';

// Import component CSS
import './styles/components/sidebar.css';
import './styles/components/header.css';
import './styles/components/container.css';
import './styles/components/card.css';
import './styles/components/button.css';
import './styles/components/input.css';
import './styles/components/avatar.css';
import './styles/components/badge.css';
import './styles/components/progress-bar.css';
import './styles/components/spinner.css';
import './styles/components/nav-link.css';
import './styles/components/tabs.css';
import './styles/components/toast.css';
import './styles/components/stat-card.css';

// Import page CSS
import './styles/pages/dashboard.css';
import './styles/pages/courses.css';
import './styles/pages/course-details.css';
import './styles/pages/attendance.css';
import './styles/pages/grades.css';
import './styles/pages/exams.css';
import './styles/pages/virtual-classes.css';
import './styles/pages/materials.css';
import './styles/pages/notices.css';
import './styles/pages/profile.css';
import './styles/pages/not-found.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app">
          <StudentRoutes />
          <ToastContainer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
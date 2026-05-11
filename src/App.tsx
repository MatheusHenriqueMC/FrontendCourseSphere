import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CourseForm from './pages/CourseForm';
import CourseDetails from './pages/CourseDetails';
import LessonForm from './pages/LessonForm';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/new"
              element={
                <ProtectedRoute>
                  <CourseForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:id"
              element={
                <ProtectedRoute>
                  <CourseDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:id/edit"
              element={
                <ProtectedRoute>
                  <CourseForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:id/lessons/new"
              element={
                <ProtectedRoute>
                  <LessonForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:id/lessons/:lessonId/edit"
              element={
                <ProtectedRoute>
                  <LessonForm />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
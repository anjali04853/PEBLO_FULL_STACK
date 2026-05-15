import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { ToastProvider } from './components/Toast.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AppLayout from './components/AppLayout.jsx';

import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import NotesList from './pages/NotesList.jsx';
import NoteEditor from './pages/NoteEditor.jsx';
import Insights from './pages/Insights.jsx';
import SharedNote from './pages/SharedNote.jsx';

/**
 * Route map:
 *   /                      public marketing landing page
 *   /login, /signup        public auth
 *   /share/:shareId        public shared note
 *   /app, /app/archived, /app/insights, /app/notes/:id   protected workspace
 */
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/share/:shareId" element={<SharedNote />} />

              <Route
                path="/app"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<NotesList />} />
                <Route path="archived" element={<NotesList archivedView />} />
                <Route path="insights" element={<Insights />} />
                <Route path="notes/:id" element={<NoteEditor />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

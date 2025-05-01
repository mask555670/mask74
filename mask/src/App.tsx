import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './styles/theme';
import { LanguageProvider } from './context/LanguageContext';
import { Layout } from './components/Layout';
import Progress from './pages/Progress';
import Workouts from './pages/Workouts';
import Statistics from './pages/Statistics';
import Motivation from './pages/Motivation';
import Profile from './pages/Profile';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LanguageProvider>
        <CssBaseline />
        <Router>
          <Layout>
            <Routes>
              <Route path="/workouts" element={<Workouts />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/motivation" element={<Motivation />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/" element={<Navigate to="/workouts" replace />} />
            </Routes>
          </Layout>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App; 
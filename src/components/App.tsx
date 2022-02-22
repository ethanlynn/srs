import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import { queryClient } from '../api';
import theme from '../styles/theme';
import Students from './Students';
import StudentsOverview from './StudentsOverview';
import StudentProfile from './StudentProfile';

export default function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Students />}>
                <Route index element={<StudentsOverview />} />
                <Route
                  path="students/:studentId"
                  element={<StudentProfile />}
                />
              </Route>
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

import { Container, Grid } from '@mui/material';
import { useNavigate, useParams, Outlet } from 'react-router-dom';

import StudentList from './StudentList';

export default function Students() {
  const { studentId } = useParams();
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ pt: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3} sx={{ bgcolor: 'background.paper' }}>
          <StudentList
            selectedStudentId={studentId}
            onSelectStudent={(newStudentId) =>
              navigate(`/students/${newStudentId}`)
            }
          />
        </Grid>
        <Grid item xs={12} md={9}>
          <Outlet />
        </Grid>
      </Grid>
    </Container>
  );
}

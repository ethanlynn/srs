import { Grid, Typography } from '@mui/material';
import { useStudents } from '../api';

export default function StudentsOverview() {
  const studentsQuery = useStudents();
  const students = studentsQuery.data ?? [];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} mb={4}>
        <Typography variant="h2" component="h2" textAlign="center">
          Student Overview
        </Typography>
        <Typography variant="body1" component="p" textAlign="center">
          Select a student to view or update records.
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1" component="p" textAlign="center">
          <b>{students.length}</b> student records found
        </Typography>
      </Grid>
    </Grid>
  );
}

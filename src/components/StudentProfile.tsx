import { useState, useEffect, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import {
  TextField,
  Grid,
  Button,
  Typography,
  LinearProgress,
  Autocomplete,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  IconButton,
  Card,
  CardActions,
  CardContent,
} from '@mui/material';
import { DatePicker, LoadingButton } from '@mui/lab';
import { Delete as DeleteIcon, Save as SaveIcon } from '@mui/icons-material';
import { useForm, useFieldArray, Controller } from 'react-hook-form';

import {
  Address,
  Allergy,
  Submission,
  useStudent,
  useUpdateStudent,
} from '../api';
import states from '../states.json';
import EditSubmissionDialog from './EditSubmissionDialog';

interface StudentProfileValues {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  address: Address;
  allergies: Allergy[];
  submissions: Submission[];
}

const defaultValues: StudentProfileValues = {
  firstName: '',
  lastName: '',
  dateOfBirth: new Date(),
  address: {
    line1: '',
    line2: '',
    city: '',
    state: '',
    zip: '',
  },
  allergies: [],
  submissions: [],
};

export default function StudentProfile() {
  const { studentId } = useParams();
  const query = useStudent(studentId!);
  const updateStudent = useUpdateStudent(studentId!);
  const form = useForm({ defaultValues });
  const allergiesFieldArray = useFieldArray({
    control: form.control,
    name: 'allergies',
    keyName: 'fieldId',
  });
  const submissionsFieldArray = useFieldArray({
    control: form.control,
    name: 'submissions',
    keyName: 'fieldId',
  });
  const [editingSubmissionIndex, setEditingSubmissionIndex] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (query.data != null) {
      const { firstName, lastName } = query.data;
      const dateOfBirth = new Date(query.data.dateOfBirth);
      const address = query.data.address?.[0] ?? defaultValues.address;
      const allergies = query.data.allergies ?? [];
      const submissions = query.data.submissions ?? [];
      form.reset({
        firstName,
        lastName,
        dateOfBirth,
        address,
        allergies,
        submissions,
      });
    }
  }, [query.data]);

  const onSubmit = (data: StudentProfileValues) => {
    updateStudent.mutate({
      id: studentId!,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth.toISOString().slice(0, 10),
      address: [data.address],
      allergies: data.allergies,
      submissions: data.submissions,
    });
  };

  if (query.isLoading) {
    return <LinearProgress />;
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Grid container spacing={2} pb={2}>
        <Grid item xs={12}>
          <Typography variant="h2" component="h2" gutterBottom>
            {query.data!.firstName} {query.data!.lastName}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="firstName"
            control={form.control}
            rules={{ required: true, minLength: 1 }}
            render={({ field }) => (
              <TextField required label="First Name" fullWidth {...field} />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="lastName"
            control={form.control}
            rules={{ required: true, minLength: 1 }}
            render={({ field }) => (
              <TextField required label="Last Name" fullWidth {...field} />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="dateOfBirth"
            control={form.control}
            rules={{ required: true }}
            render={({ field }) => (
              <DatePicker
                label="Date of Birth"
                value={new Date(field.value)}
                onChange={(value) =>
                  field.onChange(value?.toISOString().slice(0, 10))
                }
                renderInput={(props) => <TextField required {...props} />}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} mt={2}>
          <Typography variant="h4" component="h4">
            Address
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="address.line1"
            control={form.control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField required label="Address Line 1" fullWidth {...field} />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="address.line2"
            control={form.control}
            render={({ field }) => (
              <TextField label="Address Line 2" fullWidth {...field} />
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <Controller
            name="address.city"
            control={form.control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField required label="City" fullWidth {...field} />
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <Controller
            name="address.state"
            control={form.control}
            rules={{ required: true }}
            render={({ field }) => (
              <Autocomplete
                disablePortal
                options={states}
                value={field.value}
                onChange={(event, newValue) => field.onChange(newValue)}
                renderInput={(props) => (
                  <TextField required label="State" {...props} />
                )}
              />
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <Controller
            name="address.zip"
            control={form.control}
            rules={{ required: true, minLength: 1 }}
            render={({ field }) => (
              <TextField required label="Zip" fullWidth {...field} />
            )}
          />
        </Grid>
        <Grid item xs={12} mt={2}>
          <Typography variant="h4" component="h4">
            Allergies
          </Typography>
        </Grid>
        {allergiesFieldArray.fields.map((allergiesFieldArrayItem, index) => (
          <Fragment key={index}>
            <Grid item xs={2}>
              <FormControl fullWidth>
                <InputLabel id={`student-profile-allergies-${index}-severity`}>
                  Severity
                </InputLabel>
                <Controller
                  name={`allergies.${index}.severity`}
                  control={form.control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      required
                      label="Severity"
                      labelId={`student-profile-allergies-${index}-severity`}
                      {...field}
                    >
                      <MenuItem value="Low">Low</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="High">High</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth>
                <InputLabel id={`student-profile-allergies-${index}-type`}>
                  Type
                </InputLabel>
                <Controller
                  name={`allergies.${index}.type`}
                  control={form.control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      required
                      label="Type"
                      labelId={`student-profile-allergies-${index}-type`}
                      {...field}
                    >
                      <MenuItem value="Food">Food</MenuItem>
                      <MenuItem value="Medicine">Medicine</MenuItem>
                      <MenuItem value="Environmental">Environmental</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={7}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Controller
                  name={`allergies.${index}.description`}
                  control={form.control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      sx={{ flexGrow: 1 }}
                      label="Description"
                      {...field}
                    />
                  )}
                />
                <IconButton
                  onClick={() => {
                    allergiesFieldArray.remove(index);
                  }}
                >
                  <DeleteIcon fontSize="inherit" />
                </IconButton>
              </Stack>
            </Grid>
          </Fragment>
        ))}
        <Grid item xs={12}>
          <Button
            onClick={() => {
              allergiesFieldArray.append({
                studentId,
                severity: 'Low',
                type: 'Food',
                description: '',
              });
            }}
          >
            Add Allergy
          </Button>
        </Grid>
        <Grid item xs={12} mt={2}>
          <Typography variant="h4" component="h4">
            Submissions
          </Typography>
        </Grid>
        {submissionsFieldArray.fields.map((field, index) => (
          <Grid key={index} item xs={12} md={6}>
            <Card variant="outlined" sx={{ bgcolor: '#f8f8f8' }}>
              <CardContent>
                <Typography variant="h5" component="h5">
                  {field.assignmentName}
                </Typography>
                <Typography color="text.secondary">
                  <b>Due</b>: {field.dueDate}
                  <br />
                  <b>Difficulty</b>: {field.difficulty}/10
                </Typography>
                <Typography variant="body2" sx={{ mt: 1.5 }}>
                  {field.teachersNote}
                </Typography>
              </CardContent>
              <CardActions>
                <Button onClick={() => setEditingSubmissionIndex(index)}>
                  Edit
                </Button>
                <Button
                  onClick={() => {
                    submissionsFieldArray.remove(index);
                  }}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button onClick={() => setEditingSubmissionIndex(-1)}>
            Add Submission
          </Button>
          <EditSubmissionDialog
            open={editingSubmissionIndex !== null}
            onCancel={() => setEditingSubmissionIndex(null)}
            onSave={({ assignmentName, difficulty, teachersNote }) => {
              const submission = {
                studentId,
                assignmentName,
                dueDate: new Date().toISOString().slice(0, 10),
                difficulty,
                teachersNote,
              };
              if (editingSubmissionIndex === -1) {
                submissionsFieldArray.append(submission);
              } else {
                const submissionId =
                  submissionsFieldArray.fields[editingSubmissionIndex!].id;
                submissionsFieldArray.update(editingSubmissionIndex!, {
                  ...submission,
                  id: submissionId,
                });
              }
              setEditingSubmissionIndex(null);
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <LoadingButton
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            loading={updateStudent.isLoading}
          >
            Save Changes
          </LoadingButton>
        </Grid>
      </Grid>
    </form>
  );
}

import { useMemo, useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Stack,
  TextField,
  InputAdornment,
  LinearProgress,
} from '@mui/material';
import { Search } from '@mui/icons-material';

import { Student, Address, useStudents } from '../api';

function formatAddress(address?: Address) {
  if (address == null) {
    return '(No Address)';
  }
  const { city, state } = address!;
  return `${city}, ${state}`;
}

function searchStudents(students: Student[], searchText: string) {
  const lowerCaseSearchText = searchText.toLowerCase();
  return students
    .filter(
      (student) =>
        student.firstName.toLowerCase().includes(lowerCaseSearchText) ||
        student.lastName.toLowerCase().includes(lowerCaseSearchText),
    )
    .sort(
      (a, b) =>
        a.lastName.localeCompare(b.lastName) ||
        a.firstName.localeCompare(b.firstName),
    );
}

interface StudentListProps {
  selectedStudentId?: string;
  onSelectStudent: (studentId: string) => void;
}

export default function StudentList({
  selectedStudentId,
  onSelectStudent,
}: StudentListProps) {
  const [searchText, setSearchText] = useState('');
  const query = useStudents();
  const students = useMemo(
    () => searchStudents(query.data ?? [], searchText),
    [query.data, searchText],
  );

  return (
    <Stack>
      <TextField
        onChange={(event) => setSearchText(event.target.value)}
        value={searchText}
        placeholder="Search..."
        hiddenLabel
        fullWidth
        variant="filled"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />
      {query.isLoading ? (
        <LinearProgress />
      ) : (
        <List dense disablePadding>
          {students.map((student) => (
            <ListItem key={student.id} disablePadding disableGutters>
              <ListItemButton
                selected={student.id === selectedStudentId}
                onClick={() => onSelectStudent(student.id)}
              >
                <ListItemText
                  primary={`${student.lastName}, ${student.firstName}`}
                  secondary={formatAddress(student.address?.[0])}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Stack>
  );
}

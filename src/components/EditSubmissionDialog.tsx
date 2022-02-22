import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  Stack,
  Button,
} from '@mui/material';

interface EditSubmissionDialogProps {
  open: boolean;
  onCancel: () => void;
  onSave: ({
    assignmentName,
    difficulty,
    teachersNote,
  }: {
    assignmentName: string;
    difficulty: number;
    teachersNote: string;
  }) => void;
}

export default function EditSubmissionDialog({
  open,
  onCancel,
  onSave,
}: EditSubmissionDialogProps) {
  const [assignmentName, setAssignmentName] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [teachersNote, setTeachersNote] = useState('');

  useEffect(() => {
    setAssignmentName('');
    setDifficulty('');
    setTeachersNote('');
  }, [open]);

  const handleCancel = () => {
    onCancel();
  };

  const handleSave = () => {
    // TODO: Not the greatest validation.
    let numericDifficulty = parseInt(difficulty);
    if (isNaN(numericDifficulty) || numericDifficulty < 0) {
      numericDifficulty = 0;
    }
    if (numericDifficulty > 10) {
      numericDifficulty = 10;
    }
    onSave({
      assignmentName,
      difficulty: numericDifficulty,
      teachersNote,
    });
  };

  return (
    <Dialog open={open} onClose={onCancel} fullWidth>
      <DialogTitle>Submission</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <TextField
            label="Assignment Name"
            variant="standard"
            value={assignmentName}
            onChange={(event) => setAssignmentName(event.target.value)}
            fullWidth
          />
          <TextField
            label="Difficulty"
            variant="standard"
            value={difficulty.toString()}
            onChange={(event) => setDifficulty(event.target.value)}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            fullWidth
          />
          <TextField
            label="Teacher's Note"
            variant="standard"
            value={teachersNote}
            onChange={(event) => setTeachersNote(event.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave} autoFocus>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

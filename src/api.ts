import axios from 'axios';
import { useQuery, useMutation, QueryClient } from 'react-query';

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address?: Address[];
  allergies?: Allergy[];
  submissions?: Submission[];
}

export interface Address {
  id?: string;
  studentId?: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
}

export interface Allergy {
  id?: string;
  studentId?: string;
  severity: 'Low' | 'Medium' | 'High';
  type: 'Food' | 'Medicine' | 'Environmental';
  description: string;
}

export interface Submission {
  id?: string;
  studentId?: string;
  assignmentName: string;
  dueDate: string;
  difficulty: number;
  teachersNote: string;
}

const client = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const { data } = await client.get(queryKey[0] as string);
        return data;
      },
    },
  },
});

export function useStudents() {
  return useQuery<Student[]>('students');
}

export function useStudent(studentId: string) {
  return useQuery<Student>(`students/${studentId}`);
}

export function useUpdateStudent(studentId: string) {
  return useMutation(
    async (student: Student) => {
      const { address, allergies, submissions } = student;
      await Promise.all([
        // Create or update child resources.
        ...(address ?? []).map((address) =>
          address.id == null
            ? createStudentAddress(studentId, address)
            : updateStudentAddress(studentId, address.id, address),
        ),
        ...(allergies ?? []).map((allergy) =>
          allergy.id == null
            ? createStudentAllergy(studentId, allergy)
            : updateStudentAllergy(studentId, allergy.id, allergy),
        ),
        ...(submissions ?? []).map((submission) =>
          submission.id == null
            ? createStudentSubmission(studentId, submission)
            : updateStudentSubmission(studentId, submission.id, submission),
        ),
      ]);
      return await updateStudent(studentId, {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        dateOfBirth: student.dateOfBirth,
        address: [],
        allergies: [],
        submissions: [],
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('students');
        queryClient.invalidateQueries(`students/${studentId}`);
      },
    },
  );
}

export function updateStudent(studentId: string, student: Student) {
  return client.put(`students/${studentId}`, student);
}

export function deleteStudent(studentId: string) {
  return client.delete(`students/${studentId}`);
}

export function getStudentAddresses(studentId: string): Promise<Address[]> {
  return client.get(`students/${studentId}/address`).then((r) => r.data);
}

export function getStudentAddress(
  studentId: string,
  addressId: string,
): Promise<Address> {
  return client
    .get(`students/${studentId}/address/${addressId}`)
    .then((r) => r.data);
}

export function createStudentAddress(studentId: string, address: Address) {
  return client.post(`students/${studentId}/address`, address);
}

export function updateStudentAddress(
  studentId: string,
  addressId: string,
  address: Address,
) {
  return client.put(`students/${studentId}/address/${addressId}`, address);
}

export function deleteStudentAddress(studentId: string, addressId: string) {
  return client.delete(`students/${studentId}/address/${addressId}`);
}

export function getStudentAllergies(studentId: string): Promise<Allergy[]> {
  return client.get(`students/${studentId}/allergies`).then((r) => r.data);
}

export function getStudentAllergy(
  studentId: string,
  allergyId: string,
): Promise<Allergy> {
  return client
    .get(`students/${studentId}/allergies/${allergyId}`)
    .then((r) => r.data);
}

export function createStudentAllergy(studentId: string, allergy: Allergy) {
  return client.post(`students/${studentId}/allergies`, allergy);
}

export function updateStudentAllergy(
  studentId: string,
  allergyId: string,
  allergy: Allergy,
) {
  return client.put(`students/${studentId}/allergies/${allergyId}`, allergy);
}

export function getStudentSubmissions(
  studentId: string,
): Promise<Submission[]> {
  return client.get(`students/${studentId}/submissions`).then((r) => r.data);
}

export function getStudentSubmission(
  studentId: string,
  submissionId: string,
): Promise<Submission> {
  return client
    .get(`students/${studentId}/submissions/${submissionId}`)
    .then((r) => r.data);
}

export function createStudentSubmission(
  studentId: string,
  submission: Submission,
) {
  return client.post(`students/${studentId}/submissions`, submission);
}

export function updateStudentSubmission(
  studentId: string,
  submissionId: string,
  submission: Submission,
) {
  return client.put(
    `students/${studentId}/submissions/${submissionId}`,
    submission,
  );
}

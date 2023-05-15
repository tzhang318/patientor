import axios from "axios";
import { Entry, Patient, PatientFormValues } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data } = await axios.get<Patient[]>(
    `${apiBaseUrl}/patients`
  );

  return data;
};

const getPatient = async (id: string) => {
  const patient = await axios.get<Patient>(
    `${apiBaseUrl}/patients/${id}`
  );
  return patient;
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(
    `${apiBaseUrl}/patients`,
    object
  );
  return data;
};

const addEntry = async (object: Entry, patientId: string) => {
  const { data } = await axios.post<Patient>(
    `${apiBaseUrl}/patients/${patientId}/entries`,
    object
  );
  return data;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getAll, create, getPatient, addEntry
};


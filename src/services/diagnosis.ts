import axios from 'axios';
import { Diagnosis } from '../types';
import { apiBaseUrl } from "../constants";

export const getDiagnosis = async () => {
  return await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnosis`);
}

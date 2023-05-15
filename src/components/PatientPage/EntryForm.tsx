import { useMemo } from 'react';
import { Field, Form } from 'react-final-form';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment';
import { FormApi } from 'final-form';
import { Box, Stack, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Diagnosis, Entry } from '../../types';
import { MultiSelect } from '../formComponents/MultiSelect';

import './PatientPage.css';

type EntryFormProps = {
  patientId: string,
  diagnosis: Diagnosis[],
  onCancel: () => void,
  onAdd: (entry: Entry) => void
};

export const EntryForm = (props: EntryFormProps) => {
  const onSubmit = (values: Entry) => {
    const parsed = Date.parse(values.date);
    const date = moment(parsed).format('YYYY-MM-DD');
    props.onAdd({ ...values, date });
  }

  const diagnosisCodes = useMemo(()=> {
    const codes = props.diagnosis.reduce<string[]>((acc, curr) => {
      if (!acc.find(code => code === curr.code)) {
        return acc.concat(curr.code);
      }
      return acc;
    }, []);
    return codes;
  }, [props.diagnosis]);

  const handdleCancel = (form: FormApi<Entry, Partial<Entry>>) => {
    form.reset();
    props.onCancel();
  };

  const validateField = (val: string) => (val ? undefined : '* Required ...');

  const validateDate = (date: string) => Boolean(Date.parse(date)) ?
        undefined : 'Required';

  return (
    <Form
      onSubmit={onSubmit}
      handleCancel={handdleCancel}
      render={({handleSubmit, form, submitting, pristine, values}) => (
        <form onSubmit={handleSubmit}>
          <Stack direction="column" spacing={2}>
            <Field name='type'>
              {({ input, meta}) => (
                <FormControl fullWidth required >
                  <InputLabel>Healthcheck Category</InputLabel>
                  <Select {...input} label='Healthcheck Category' >
                    <MenuItem value='Hospital'>Hospital</MenuItem>
                    <MenuItem value='HealthCheck'>Health Check</MenuItem>
                    <MenuItem value='OccupationalHealthcare'>Occupational Healthcare</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Field>
            <Field name='description' validate={validateField}>
              {({input, meta}) => (
                <TextField
                  {...input}
                  variant="standard"
                  label="Description"
                  error={meta.touched && meta.error}
                  helperText={meta.error}
                />
              )}
            </Field>
            <Field name='date' validate={validateDate}>
              {({ input, meta}) => (
                <div>
                  <label>Date</label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker {...input} />
                  </LocalizationProvider>
                  {meta.touched && meta.error && <span>{meta.error}</span>}
                </div>
              )}
            </Field>
            <Field name='specialist' validate={validateField}>
              {({ input, meta }) => (
                <div>
                  <label>Specialist</label>
                  <input {...input} type='text' placeholder='provide doctor name here...' />
                  {meta.error && meta.touched && <span>{meta.error}</span>}
                </div>
              )}
            </Field>
            <Field name='diagnosisCodes' >
              {({ input }) => (
                <MultiSelect
                  {...input}
                  menuItems={diagnosisCodes}
                  label='Diagnosis Codes'
                  field='diagnosisCodes'
                />
              )}
            </Field>
            {values.type==='HealthCheck' &&
              <Field name='healthCheckRating' >
                {({ input, meta}) => (
                  <FormControl fullWidth required >
                    <InputLabel>Healthcheck Rating</InputLabel>
                    <Select {...input} label='Healthcheck Rating' >
                      <MenuItem value={0}>0</MenuItem>
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={2}>2</MenuItem>
                      <MenuItem value={3}>3</MenuItem>
                    </Select>
                  </FormControl>
                )}
              </Field>
            }
            {values.type === 'OccupationalHealthcare' &&
              <>
                <Field name='employerName' validate={validateField}>
                  {({input, meta}) => (
                    <TextField
                      {...input}
                      variant="standard"
                      label="Employer"
                      error={meta.touched && meta.error}
                      helperText={meta.error}
                    />
                  )}
                </Field>
                <Box>Sickleave</Box>
                <Field name='sickLeaveStart'>
                  {({input, meta}) => (
                    <div>
                      <label>Start</label>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker {...input} />
                      </LocalizationProvider>
                      {meta.touched && meta.error && <span>{meta.error}</span>}
                    </div>
                  )}
                </Field>
                <Field name='sickLeaveEnd'>
                  {({input, meta}) => (
                    <div>
                      <label>End</label>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker {...input} />
                      </LocalizationProvider>
                      {meta.touched && meta.error && <span>{meta.error}</span>}
                    </div>
                  )}
                </Field>
              </>
            }
            {values.type === 'Hospital' &&
              <>
                <Box>Discharge</Box>
                <Field name='dischargeDate' validate={validateField}>
                  {({input, meta}) => (
                    <div>
                      <label>Date</label>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker {...input} />
                      </LocalizationProvider>
                      {meta.touched && meta.error && <span>{meta.error}</span>}
                    </div>
                  )}
                </Field>
                <Field name='dischargeCriteria' validate={validateField}>
                  {({input, meta}) => (
                    <TextField
                      {...input}
                      variant='standard'
                      label='Criteria'
                      error={meta.touched && meta.error}
                      helperText={meta.error}
                    />
                  )}
                </Field>
              </>
            }
            <Box style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <Button
                disabled={submitting}
                variant='contained'
                color='warning'
                onClick={()=>handdleCancel(form)}
              >
                CANCEL
              </Button>
              <Button
                disabled={submitting || pristine}
                variant='contained'
                style={{ backgroundColor: 'lightgray', color: 'GrayText' }}
                type='submit'
              >
                ADD
              </Button>
            </Box>
          </Stack>
        </form>
      )}
    />
  )
};

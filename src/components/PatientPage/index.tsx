import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Card, CardContent, Stack, Typography, ListItem, Button } from '@mui/material';
import {
  Boy as BoyIcon,
  Girl as GirlIcon,
  Wc as WcIcon,
  Favorite as HeartIcon,
  Work as WorkIcon,
  Add as AddIcon
} from '@mui/icons-material';
import {
  Diagnosis,
  Patient,
  Gender,
  Entry,
  HealthCheckRating,
  OccupationalHealthcareEntry,
  HealthCheckEntry
  } from '../../types';
import patientService from '../../services/patients';
import { getDiagnosis } from '../../services/diagnosis';
import { EntryForm } from './EntryForm';

const PatientPage = () => {
  const [patient, setPatient] = useState<Patient>({} as Patient);
  const [diagnosis, setDiagnosis] = useState<Diagnosis[]>([] as Diagnosis[]);
  const [showForm, setShowForm] = useState(false);
  const { id } = useParams<Record<string, string | undefined>>();

  useEffect(() => {
    getDiagnosis().then(res => setDiagnosis(res.data));
  }, []);

  useEffect(() => {
    async function getOne(id: string) {
      return await patientService.getPatient(id);
    };

    if (id) {
      getOne(id).then(res =>
      {
        setPatient(res.data);
      });
    }
  }, [id]);

  const getGenderIcon = (gender: Gender)=> {
    switch (gender) {
      case Gender.Male: return <BoyIcon />;
      case Gender.Female: return <GirlIcon />;
      default: return <WcIcon />;
    }
  }

  const getDiagnose = (code: string): string => {
    const diagnose = diagnosis.find(d=>d.code === code);
    return diagnose?.name ?? '';
  };

  const getHeartCondition = (code: HealthCheckRating) => {
    let color;
    if (code === undefined) return null;
    switch (code) {
      case HealthCheckRating.Healthy:
        color = 'green';
        break;
      case HealthCheckRating.LowRisk:
        color = 'yellow';
        break;
      case HealthCheckRating.HighRisk:
        color = 'red';
        break;
      case HealthCheckRating.CriticalRisk:
        color = 'darkred';
        break;
      default:
        color = '';
    }
    return <HeartIcon style={{ color }} />;
  };

  const getVisitType = (visitType: string) => {
    if (visitType === 'HealthCheck') {
      return (
        <span
          style={{
            display: "inline-flex",
            flexDirection: "column",
            justifyContent: "Center",
            alignItems: "Center",
            marginLeft: "5px"
          }}
        >
          <WorkIcon style={{ fontSize: '1rem', color: 'black' }} />
          <AddIcon style={{
            fontSize: '0.6rem',
            color: 'white',
            marginTop: '-0.75rem',
            fontWeight: 'bold'
          }} />
        </span>
      )
    }
    return <WorkIcon style={{ fontSize: '1rem', color: 'black' }} />;
  };

  const toggleShowForm = () => setShowForm(!showForm);

  const onAdd = (entry: Entry) => {
    patientService.addEntry(entry, patient.id).then(data=>setPatient(data));
    toggleShowForm();
  };

  const onCancel = () => toggleShowForm();

  return (
    <Card>
        <CardContent>
          <Stack spacing={2} >
            <Typography variant='h4'>
              {patient.name}
              {getGenderIcon(patient.gender)}
            </Typography>
            <Typography variant='body1'>{`dateOfBirth: ${patient.dateOfBirth}`}</Typography>
            <Typography variant='body1'>{`occupation: ${patient.occupation}`}</Typography>
            {showForm &&
              <EntryForm 
                patientId={patient.id}
                onCancel={onCancel}
                onAdd={onAdd}
                diagnosis={diagnosis}
              />
            }
            {patient.entries?.length > 0 &&
              <Typography variant='h6' className='entries-header'>Entries</Typography>
            }
            {
              patient.entries?.map((entry: Entry) => {
                return (
                  <Box key={entry.id}>
                    <Typography variant='body1'>
                      {entry.date}
                      {getVisitType(entry.type)}
                      <span style={{ fontStyle: 'italic' }}>
                        {(entry as OccupationalHealthcareEntry).employerName}
                      </span>
                    </Typography>
                    <Typography variant='body1' fontStyle={'italic'}>
                      {entry.description}
                    </Typography>
                    {getHeartCondition((entry as HealthCheckEntry).healthCheckRating)}
                    {entry.diagnosisCodes?.map(code => {
                      return <ListItem key={code} sx={{ display: 'list-item' }}>{`${code} ${getDiagnose(code)}`}</ListItem>
                    })}
                    <Typography variant='body1'>{`diagnose by ${entry.specialist}`}</Typography>
                  </Box>
                )
              })
            }
          </Stack>
        </CardContent>
        <Button variant='contained' color='primary' onClick={toggleShowForm}>Add New Entry</Button>
    </Card>
  );
};

export default PatientPage;

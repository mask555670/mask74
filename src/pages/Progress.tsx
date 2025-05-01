import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  useTheme,
  alpha,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from '@mui/material';
import {
  Timeline,
  MonitorWeight,
  Height,
  FitnessCenter,
  Add as AddIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useLanguage } from '../context/LanguageContext';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import { format, parseISO } from 'date-fns';

interface Measurement {
  id: string;
  date: string;
  weight: number;
  height: number;
  chest: number;
  waist: number;
  hips: number;
  shoulders: number;
  forearm: number;
  glutes: number;
  biceps: number;
  thigh: number;
}

const Progress = () => {
  const theme = useTheme();
  const { t } = useLanguage();
  const [measurements, setMeasurements] = useLocalStorage<Measurement[]>('measurements', []);
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(new Date());
  const [selectedMeasurement, setSelectedMeasurement] = React.useState<Measurement | null>(null);
  const [newMeasurement, setNewMeasurement] = React.useState<Partial<Measurement>>({
    date: new Date().toISOString().split('T')[0],
    weight: 0,
    height: 0,
    chest: 0,
    waist: 0,
    hips: 0,
    shoulders: 0,
    forearm: 0,
    glutes: 0,
    biceps: 0,
    thigh: 0,
  });

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const measurement = measurements.find(m => m.date === formattedDate);
      setSelectedMeasurement(measurement || null);
    } else {
      setSelectedMeasurement(null);
    }
  };

  const handleOpen = () => {
    if (selectedDate) {
      setNewMeasurement({
        ...newMeasurement,
        date: format(selectedDate, 'yyyy-MM-dd'),
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleAddMeasurement = () => {
    if (newMeasurement.weight && newMeasurement.height) {
      const measurement: Measurement = {
        id: Date.now().toString(),
        date: newMeasurement.date || new Date().toISOString().split('T')[0],
        weight: newMeasurement.weight,
        height: newMeasurement.height,
        chest: newMeasurement.chest || 0,
        waist: newMeasurement.waist || 0,
        hips: newMeasurement.hips || 0,
        shoulders: newMeasurement.shoulders || 0,
        forearm: newMeasurement.forearm || 0,
        glutes: newMeasurement.glutes || 0,
        biceps: newMeasurement.biceps || 0,
        thigh: newMeasurement.thigh || 0,
      };
      
      // Если измерение на эту дату уже существует, обновляем его
      const existingIndex = measurements.findIndex(m => m.date === measurement.date);
      if (existingIndex !== -1) {
        const updatedMeasurements = [...measurements];
        updatedMeasurements[existingIndex] = measurement;
        setMeasurements(updatedMeasurements);
      } else {
        setMeasurements([...measurements, measurement]);
      }
      
      handleClose();
      setNewMeasurement({
        date: new Date().toISOString().split('T')[0],
        weight: 0,
        height: 0,
        chest: 0,
        waist: 0,
        hips: 0,
        shoulders: 0,
        forearm: 0,
        glutes: 0,
        biceps: 0,
        thigh: 0,
      });
      setSelectedMeasurement(measurement);
    }
  };

  const handleChange = (field: keyof Measurement) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewMeasurement({
      ...newMeasurement,
      [field]: field === 'date' ? event.target.value : Number(event.target.value),
    });
  };

  const chartData = React.useMemo(() => {
    return measurements
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(m => ({
        date: format(parseISO(m.date), 'dd MMM', { locale: ru }),
        вес: m.weight,
        обхват_груди: m.chest,
        обхват_талии: m.waist,
        обхват_бедер: m.hips,
        обхват_плеч: m.shoulders,
        обхват_предплечья: m.forearm,
        обхват_ягодиц: m.glutes,
        обхват_бицепса: m.biceps,
        обхват_бедра: m.thigh,
      }));
  }, [measurements]);

  const stats = React.useMemo(() => {
    const measurement = selectedMeasurement || measurements[measurements.length - 1];
    const previousMeasurement = measurements[measurements.indexOf(measurement) - 1];

    const calculateChange = (current: number, previous: number) => {
      if (!previous) return 0;
      return ((current - previous) / previous) * 100;
    };

    return [
      {
        title: 'Текущий вес',
        value: measurement?.weight || 0,
        unit: 'кг',
        change: calculateChange(
          measurement?.weight || 0,
          previousMeasurement?.weight || 0
        ),
        icon: <MonitorWeight />,
        color: theme.palette.primary.main,
      },
      {
        title: 'Рост',
        value: measurement?.height || 0,
        unit: 'см',
        change: 0,
        icon: <Height />,
        color: theme.palette.secondary.main,
      },
      {
        title: 'Обхват груди',
        value: measurement?.chest || 0,
        unit: 'см',
        change: calculateChange(
          measurement?.chest || 0,
          previousMeasurement?.chest || 0
        ),
        icon: <FitnessCenter />,
        color: theme.palette.success.main,
      },
      {
        title: 'Обхват талии',
        value: measurement?.waist || 0,
        unit: 'см',
        change: calculateChange(
          measurement?.waist || 0,
          previousMeasurement?.waist || 0
        ),
        icon: <FitnessCenter />,
        color: theme.palette.warning.main,
      },
      {
        title: 'Обхват плеч',
        value: measurement?.shoulders || 0,
        unit: 'см',
        change: calculateChange(
          measurement?.shoulders || 0,
          previousMeasurement?.shoulders || 0
        ),
        icon: <FitnessCenter />,
        color: theme.palette.info.main,
      },
      {
        title: 'Обхват предплечья',
        value: measurement?.forearm || 0,
        unit: 'см',
        change: calculateChange(
          measurement?.forearm || 0,
          previousMeasurement?.forearm || 0
        ),
        icon: <FitnessCenter />,
        color: theme.palette.info.main,
      },
      {
        title: 'Обхват ягодиц',
        value: measurement?.glutes || 0,
        unit: 'см',
        change: calculateChange(
          measurement?.glutes || 0,
          previousMeasurement?.glutes || 0
        ),
        icon: <FitnessCenter />,
        color: theme.palette.info.main,
      },
      {
        title: 'Обхват бицепса',
        value: measurement?.biceps || 0,
        unit: 'см',
        change: calculateChange(
          measurement?.biceps || 0,
          previousMeasurement?.biceps || 0
        ),
        icon: <FitnessCenter />,
        color: theme.palette.info.main,
      },
      {
        title: 'Обхват бедра',
        value: measurement?.thigh || 0,
        unit: 'см',
        change: calculateChange(
          measurement?.thigh || 0,
          previousMeasurement?.thigh || 0
        ),
        icon: <FitnessCenter />,
        color: theme.palette.info.main,
      },
    ];
  }, [selectedMeasurement, measurements, theme.palette]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ pb: 8 }}>
        <Box 
          sx={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Typography 
            variant="h5" 
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: theme.palette.primary.main,
              fontWeight: 'bold',
            }}
          >
            <Timeline /> {t('progress.title')}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpen}
            sx={{ borderRadius: 2 }}
          >
            {t('progress.add')}
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Календарь */}
          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3, borderRadius: 3 }}>
              <CardContent>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                  <DateCalendar
                    value={selectedDate}
                    onChange={handleDateChange}
                    sx={{
                      width: '100%',
                      '& .MuiPickersCalendarHeader-root': {
                        margin: '8px 0',
                      },
                      '& .MuiPickersDay-root': {
                        margin: '0 2px',
                      },
                    }}
                  />
                </LocalizationProvider>
              </CardContent>
            </Card>
          </Grid>

          {/* Статистика */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              {stats.map((stat, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      bgcolor: alpha(stat.color, 0.1),
                      height: '100%',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 2,
                          bgcolor: alpha(stat.color, 0.2),
                          color: stat.color,
                          mr: 1,
                        }}
                      >
                        {stat.icon}
                      </Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        {stat.title}
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                      {stat.value} {stat.unit}
                    </Typography>
                    {stat.change !== 0 && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: stat.change > 0 ? 'success.main' : 'error.main',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {stat.change > 0 ? '+' : ''}{stat.change.toFixed(1)}%
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* График */}
            <Card sx={{ mt: 3, p: 2, borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('progress.chart')}
                </Typography>
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="вес"
                        stroke={theme.palette.primary.main}
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="обхват_груди"
                        stroke={theme.palette.success.main}
                      />
                      <Line
                        type="monotone"
                        dataKey="обхват_талии"
                        stroke={theme.palette.warning.main}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Диалог добавления измерений */}
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>{t('progress.add')}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  label={t('progress.date')}
                  type="date"
                  value={newMeasurement.date}
                  onChange={handleChange('date')}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label={t('progress.weight')}
                  type="number"
                  value={newMeasurement.weight}
                  onChange={handleChange('weight')}
                  fullWidth
                  InputProps={{ endAdornment: 'кг' }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label={t('progress.height')}
                  type="number"
                  value={newMeasurement.height}
                  onChange={handleChange('height')}
                  fullWidth
                  InputProps={{ endAdornment: 'см' }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label={t('progress.chest')}
                  type="number"
                  value={newMeasurement.chest}
                  onChange={handleChange('chest')}
                  fullWidth
                  InputProps={{ endAdornment: 'см' }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label={t('progress.waist')}
                  type="number"
                  value={newMeasurement.waist}
                  onChange={handleChange('waist')}
                  fullWidth
                  InputProps={{ endAdornment: 'см' }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label={t('progress.hips')}
                  type="number"
                  value={newMeasurement.hips}
                  onChange={handleChange('hips')}
                  fullWidth
                  InputProps={{ endAdornment: 'см' }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label={t('progress.shoulders')}
                  type="number"
                  value={newMeasurement.shoulders}
                  onChange={handleChange('shoulders')}
                  fullWidth
                  InputProps={{ endAdornment: 'см' }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label={t('progress.forearm')}
                  type="number"
                  value={newMeasurement.forearm}
                  onChange={handleChange('forearm')}
                  fullWidth
                  InputProps={{ endAdornment: 'см' }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label={t('progress.glutes')}
                  type="number"
                  value={newMeasurement.glutes}
                  onChange={handleChange('glutes')}
                  fullWidth
                  InputProps={{ endAdornment: 'см' }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label={t('progress.biceps')}
                  type="number"
                  value={newMeasurement.biceps}
                  onChange={handleChange('biceps')}
                  fullWidth
                  InputProps={{ endAdornment: 'см' }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label={t('progress.thigh')}
                  type="number"
                  value={newMeasurement.thigh}
                  onChange={handleChange('thigh')}
                  fullWidth
                  InputProps={{ endAdornment: 'см' }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{t('progress.cancel')}</Button>
            <Button
              onClick={handleAddMeasurement}
              variant="contained"
              disabled={!newMeasurement.weight || !newMeasurement.height}
            >
              {t('common.save')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Progress; 
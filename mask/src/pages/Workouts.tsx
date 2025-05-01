import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Stack,
  Divider,
  Container,
  useTheme,
  alpha,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, FitnessCenter } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { ru } from 'date-fns/locale';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Exercise, Workout, Set } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { formatDate, parseDate, areDatesEqual } from '../utils/date';

const initialExercise: Exercise = {
  id: '',
  name: '',
  sets: [],
};

const Workouts = () => {
  const theme = useTheme();
  const { t } = useLanguage();
  const [workouts, setWorkouts] = useLocalStorage<Workout[]>('workouts', []);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [workoutName, setWorkoutName] = useState('');
  const [open, setOpen] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [exerciseForm, setExerciseForm] = useState<Exercise>(initialExercise);
  const [numberOfSets, setNumberOfSets] = useState(1);
  const [sets, setSets] = useState<Set[]>([{ id: '1', reps: 0, weight: 0 }]);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingWorkout, setIsEditingWorkout] = useState(false);
  const [editWorkoutDialogOpen, setEditWorkoutDialogOpen] = useState(false);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      const workout = workouts.find(w => 
        areDatesEqual(parseDate(w.date), date)
      );
      setCurrentWorkout(workout || null);
    } else {
      setCurrentWorkout(null);
    }
  };

  const handleAddWorkout = () => {
    if (selectedDate && workoutName) {
      const newWorkout: Workout = {
        id: Date.now().toString(),
        date: formatDate(selectedDate),
        name: workoutName,
        exercises: [],
      };
      const updatedWorkouts = [...workouts, newWorkout];
      setWorkouts(updatedWorkouts);
      setCurrentWorkout(newWorkout);
      setWorkoutName('');
    }
  };

  const handleOpenExerciseDialog = (workout: Workout, exerciseToEdit?: Exercise) => {
    setCurrentWorkout(workout);
    if (exerciseToEdit) {
      setExerciseForm(exerciseToEdit);
      setSets(exerciseToEdit.sets);
      setNumberOfSets(exerciseToEdit.sets.length);
      setIsEditing(true);
    } else {
      setExerciseForm(initialExercise);
      setSets([{ id: '1', reps: 0, weight: 0 }]);
      setNumberOfSets(1);
      setIsEditing(false);
    }
    setOpen(true);
  };

  const handleCloseExerciseDialog = () => {
    setOpen(false);
    setExerciseForm(initialExercise);
    setSets([{ id: '1', reps: 0, weight: 0 }]);
    setNumberOfSets(1);
    setIsEditing(false);
  };

  const handleAddSet = () => {
    setSets([...sets, { id: (sets.length + 1).toString(), reps: 0, weight: 0 }]);
    setNumberOfSets(prev => prev + 1);
  };

  const handleSetChange = (setId: string, field: keyof Set, value: number) => {
    setSets(prevSets =>
      prevSets.map(set =>
        set.id === setId ? { ...set, [field]: value } : set
      )
    );
  };

  const handleAddExercise = () => {
    if (currentWorkout && exerciseForm.name) {
      const newExercise: Exercise = {
        ...exerciseForm,
        id: isEditing ? exerciseForm.id : Date.now().toString(),
        sets: sets,
      };

      const updatedWorkout = {
        ...currentWorkout,
        exercises: isEditing
          ? currentWorkout.exercises.map(ex => 
              ex.id === newExercise.id ? newExercise : ex
            )
          : [...currentWorkout.exercises, newExercise],
      };

      setWorkouts(workouts.map(w => 
        w.id === currentWorkout.id ? updatedWorkout : w
      ));
      setCurrentWorkout(updatedWorkout);
      handleCloseExerciseDialog();
    }
  };

  const handleDeleteExercise = (workoutId: string, exerciseId: string) => {
    const updatedWorkouts = workouts.map(workout => {
      if (workout.id === workoutId) {
        return {
          ...workout,
          exercises: workout.exercises.filter(ex => ex.id !== exerciseId),
        };
      }
      return workout;
    });
    setWorkouts(updatedWorkouts);
    
    if (currentWorkout && currentWorkout.id === workoutId) {
      const updatedCurrentWorkout = updatedWorkouts.find(w => w.id === workoutId);
      setCurrentWorkout(updatedCurrentWorkout || null);
    }
  };

  const handleDeleteWorkout = (workoutId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту тренировку?')) {
      const updatedWorkouts = workouts.filter(w => w.id !== workoutId);
      setWorkouts(updatedWorkouts);
      setCurrentWorkout(null);
    }
  };

  const handleEditWorkout = () => {
    if (currentWorkout) {
      setWorkoutName(currentWorkout.name);
      setIsEditingWorkout(true);
      setEditWorkoutDialogOpen(true);
    }
  };

  const handleSaveWorkoutEdit = () => {
    if (currentWorkout && workoutName) {
      const updatedWorkout = {
        ...currentWorkout,
        name: workoutName,
      };
      setWorkouts(workouts.map(w => 
        w.id === currentWorkout.id ? updatedWorkout : w
      ));
      setCurrentWorkout(updatedWorkout);
      setEditWorkoutDialogOpen(false);
      setIsEditingWorkout(false);
      setWorkoutName('');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ pb: 8 }}>
        <Card 
          sx={{ 
            mb: 4,
            borderRadius: 3,
            boxShadow: theme.shadows[2],
            '&:hover': {
              boxShadow: theme.shadows[4],
            },
          }}
        >
          <CardContent>
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{
                mb: 3,
                fontWeight: 'bold',
                color: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <FitnessCenter /> {t('workouts.title')}
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
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
              </Grid>

              <Grid item xs={12} md={8}>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    label={t('workouts.name')}
                    value={workoutName}
                    onChange={(e) => setWorkoutName(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddWorkout}
                    disabled={!selectedDate || !workoutName}
                    fullWidth
                  >
                    {t('workouts.addWorkout')}
                  </Button>
                </Box>

                {currentWorkout && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">{currentWorkout.name}</Typography>
                      <Box>
                        <IconButton onClick={handleEditWorkout} color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteWorkout(currentWorkout.id)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>

                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenExerciseDialog(currentWorkout)}
                      fullWidth
                      sx={{ mb: 2 }}
                    >
                      {t('workouts.addExercise')}
                    </Button>

                    <List>
                      {currentWorkout.exercises.map((exercise) => (
                        <Paper key={exercise.id} sx={{ mb: 2, p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle1">{exercise.name}</Typography>
                            <Box>
                              <IconButton
                                onClick={() => handleOpenExerciseDialog(currentWorkout, exercise)}
                                color="primary"
                                size="small"
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                onClick={() => handleDeleteExercise(currentWorkout.id, exercise.id)}
                                color="error"
                                size="small"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {exercise.sets.map((set, index) => (
                              <Box key={set.id} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <Typography variant="body2" sx={{ minWidth: '40px' }}>
                                  {index + 1}.
                                </Typography>
                                <Typography variant="body2">
                                  {set.weight} кг × {set.reps} повторений
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Paper>
                      ))}
                    </List>
                  </Box>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* Диалог добавления/редактирования упражнения */}
      <Dialog open={open} onClose={handleCloseExerciseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditing ? t('workouts.editExercise') : t('workouts.addExercise')}
        </DialogTitle>
        <DialogContent>
          <TextField
            label={t('workouts.exerciseName')}
            value={exerciseForm.name}
            onChange={(e) => setExerciseForm({ ...exerciseForm, name: e.target.value })}
            fullWidth
            sx={{ mb: 2, mt: 1 }}
          />
          
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            {t('workouts.sets')}
          </Typography>
          
          {sets.map((set, index) => (
            <Box key={set.id} sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label={t('workouts.weight')}
                type="number"
                value={set.weight}
                onChange={(e) => handleSetChange(set.id, 'weight', Number(e.target.value))}
                sx={{ width: '50%' }}
              />
              <TextField
                label={t('workouts.reps')}
                type="number"
                value={set.reps}
                onChange={(e) => handleSetChange(set.id, 'reps', Number(e.target.value))}
                sx={{ width: '50%' }}
              />
            </Box>
          ))}
          
          <Button
            variant="outlined"
            onClick={handleAddSet}
            fullWidth
            sx={{ mb: 2 }}
          >
            {t('workouts.addSet')}
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseExerciseDialog}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleAddExercise}
            variant="contained"
            disabled={!exerciseForm.name}
          >
            {isEditing ? t('common.save') : t('common.add')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог редактирования тренировки */}
      <Dialog open={editWorkoutDialogOpen} onClose={() => setEditWorkoutDialogOpen(false)}>
        <DialogTitle>{t('workouts.editWorkout')}</DialogTitle>
        <DialogContent>
          <TextField
            label={t('workouts.name')}
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            fullWidth
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditWorkoutDialogOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSaveWorkoutEdit} variant="contained">
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Workouts; 
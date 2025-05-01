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
} from '@mui/material';
import {
  BarChart,
  Bar,
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
import { Workout } from '../types';

const Statistics = () => {
  const theme = useTheme();
  const [workouts] = useLocalStorage<Workout[]>('workouts', []);

  // Подготовка данных для графиков
  const last7DaysData = React.useMemo(() => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayWorkouts = workouts.filter(w => 
        new Date(w.date).toISOString().split('T')[0] === date
      );
      
      return {
        date: new Date(date).toLocaleDateString('ru-RU', { weekday: 'short' }),
        количество: dayWorkouts.length,
        упражнения: dayWorkouts.reduce((acc, w) => acc + w.exercises.length, 0),
      };
    });
  }, [workouts]);

  const exerciseStats = React.useMemo(() => {
    const stats: { [key: string]: number } = {};
    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        stats[exercise.name] = (stats[exercise.name] || 0) + 1;
      });
    });

    return Object.entries(stats)
      .map(([name, count]) => ({ name, количество: count }))
      .sort((a, b) => b.количество - a.количество)
      .slice(0, 5);
  }, [workouts]);

  const totalStats = React.useMemo(() => [
    {
      title: 'Всего тренировок',
      value: workouts.length,
      color: theme.palette.primary.main,
    },
    {
      title: 'Всего упражнений',
      value: workouts.reduce((acc, w) => acc + w.exercises.length, 0),
      color: theme.palette.secondary.main,
    },
    {
      title: 'Среднее упражнений',
      value: workouts.length 
        ? Math.round(workouts.reduce((acc, w) => acc + w.exercises.length, 0) / workouts.length)
        : 0,
      color: theme.palette.success.main,
    },
    {
      title: 'Дней подряд',
      value: calculateStreak(),
      color: theme.palette.grey[800],
    },
  ], [workouts, theme.palette]);

  function calculateStreak() {
    if (workouts.length === 0) return 0;

    const dates = workouts
      .map(w => new Date(w.date).toISOString().split('T')[0])
      .sort()
      .reverse();

    let streak = 1;
    const today = new Date().toISOString().split('T')[0];
    let currentDate = new Date(dates[0]);
    
    // Если последняя тренировка была не сегодня/вчера, стрик обнуляется
    if (dates[0] !== today && dates[0] !== new Date(Date.now() - 86400000).toISOString().split('T')[0]) {
      return 0;
    }

    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i]);
      const diffDays = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
        currentDate = prevDate;
      } else {
        break;
      }
    }

    return streak;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ pb: 8 }}>
        <Grid container spacing={3}>
          {totalStats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: 3,
                  boxShadow: theme.shadows[2],
                  '&:hover': {
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                <CardContent>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      mb: 1,
                      color: stat.color,
                      fontWeight: 'bold',
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: theme.palette.text.secondary,
                      fontWeight: 500,
                    }}
                  >
                    {stat.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}

          <Grid item xs={12} md={8}>
            <Card 
              sx={{ 
                height: '100%',
                borderRadius: 3,
                boxShadow: theme.shadows[2],
                '&:hover': {
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <CardContent>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 'bold',
                    color: theme.palette.text.primary,
                  }}
                >
                  Активность за последние 7 дней
                </Typography>
                <Box sx={{ height: 300, mt: 2 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={last7DaysData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.primary, 0.1)} />
                      <XAxis 
                        dataKey="date" 
                        stroke={theme.palette.text.secondary}
                      />
                      <YAxis stroke={theme.palette.text.secondary} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: theme.palette.background.paper,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 8,
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="количество"
                        stroke={theme.palette.primary.main}
                        strokeWidth={2}
                        dot={{ fill: theme.palette.primary.main }}
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="упражнения"
                        stroke={theme.palette.secondary.main}
                        strokeWidth={2}
                        dot={{ fill: theme.palette.secondary.main }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card 
              sx={{ 
                height: '100%',
                borderRadius: 3,
                boxShadow: theme.shadows[2],
                '&:hover': {
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <CardContent>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 'bold',
                    color: theme.palette.text.primary,
                  }}
                >
                  Топ упражнений
                </Typography>
                <Box sx={{ height: 300, mt: 2 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={exerciseStats}
                      layout="vertical"
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.primary, 0.1)} />
                      <XAxis type="number" stroke={theme.palette.text.secondary} />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        stroke={theme.palette.text.secondary}
                        width={100}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: theme.palette.background.paper,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 8,
                        }}
                      />
                      <Bar 
                        dataKey="количество" 
                        fill={theme.palette.primary.main}
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Statistics; 
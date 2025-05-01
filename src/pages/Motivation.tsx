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
  Avatar,
  Button,
  LinearProgress,
} from '@mui/material';
import {
  EmojiEvents,
  LocalFireDepartment,
  Timer,
  TrendingUp,
  WorkspacePremium,
} from '@mui/icons-material';

const achievements = [
  {
    title: 'Первая тренировка',
    description: 'Начните свой путь к здоровому образу жизни',
    icon: <LocalFireDepartment />,
    progress: 100,
    color: '#FF6B6B',
  },
  {
    title: '7 дней подряд',
    description: 'Тренируйтесь каждый день в течение недели',
    icon: <Timer />,
    progress: 71,
    color: '#4ECDC4',
  },
  {
    title: 'Силач',
    description: 'Выполните 100 повторений в одной тренировке',
    icon: <TrendingUp />,
    progress: 45,
    color: '#45B7D1',
  },
  {
    title: 'Мастер',
    description: 'Достигните 1000 повторений всего',
    icon: <WorkspacePremium />,
    progress: 30,
    color: '#96C93D',
  },
];

const quotes = [
  {
    text: 'Сила не приходит от физических возможностей. Она приходит от несгибаемой воли.',
    author: 'Махатма Ганди',
  },
  {
    text: 'Чтобы достичь цели, нужно прежде всего к ней идти.',
    author: 'Оноре де Бальзак',
  },
  {
    text: 'Успех — это способность шагать от одной неудачи к другой, не теряя энтузиазма.',
    author: 'Уинстон Черчилль',
  },
];

const Motivation = () => {
  const theme = useTheme();
  const [quoteIndex, setQuoteIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ pb: 8 }}>
        <Card 
          sx={{ 
            mb: 4,
            borderRadius: 3,
            boxShadow: theme.shadows[2],
            bgcolor: theme.palette.primary.main,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -20,
              right: -20,
              width: 120,
              height: 120,
              borderRadius: '50%',
              bgcolor: alpha('#fff', 0.1),
            }}
          />
          <CardContent sx={{ position: 'relative', py: 4 }}>
            <Typography 
              variant="h4" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                maxWidth: '80%',
              }}
            >
              "{quotes[quoteIndex].text}"
            </Typography>
            <Typography 
              variant="subtitle1"
              sx={{ 
                opacity: 0.8,
                fontStyle: 'italic',
              }}
            >
              — {quotes[quoteIndex].author}
            </Typography>
          </CardContent>
        </Card>

        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ 
            mb: 3,
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <EmojiEvents /> Достижения
        </Typography>

        <Grid container spacing={3}>
          {achievements.map((achievement, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: 3,
                  boxShadow: theme.shadows[2],
                  '&:hover': {
                    boxShadow: theme.shadows[4],
                    transform: 'translateY(-4px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(achievement.color, 0.1),
                        color: achievement.color,
                        mr: 2,
                      }}
                    >
                      {achievement.icon}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {achievement.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {achievement.description}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ flex: 1 }}
                      >
                        Прогресс
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                      >
                        {achievement.progress}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={achievement.progress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: alpha(achievement.color, 0.1),
                        '& .MuiLinearProgress-bar': {
                          bgcolor: achievement.color,
                        },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box 
          sx={{ 
            mt: 4,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button
            variant="outlined"
            size="large"
            sx={{
              borderRadius: 2,
              borderWidth: 2,
              fontWeight: 'bold',
              px: 4,
            }}
          >
            Посмотреть все достижения
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Motivation; 
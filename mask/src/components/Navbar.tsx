import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { FitnessCenter, Timeline, TrendingUp, EmojiEvents } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(() => {
    switch (location.pathname) {
      case '/workouts':
        return 1;
      case '/statistics':
        return 2;
      case '/motivation':
        return 3;
      default:
        return 0;
    }
  });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/workouts');
        break;
      case 2:
        navigate('/statistics');
        break;
      case 3:
        navigate('/motivation');
        break;
    }
  };

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation value={value} onChange={handleChange}>
        <BottomNavigationAction
          label="Прогресс"
          icon={<TrendingUp />}
        />
        <BottomNavigationAction
          label="Тренировки"
          icon={<FitnessCenter />}
        />
        <BottomNavigationAction
          label="Статистика"
          icon={<Timeline />}
        />
        <BottomNavigationAction
          label="Мотивация"
          icon={<EmojiEvents />}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default Navbar; 
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Grid,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Switch,
  FormControlLabel,
  Divider,
  Radio,
  RadioGroup,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  alpha,
} from '@mui/material';
import {
  Person,
  Edit,
  Settings,
  Save,
  Close,
  Lock,
  Visibility,
  VisibilityOff,
  Language,
  Check,
} from '@mui/icons-material';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useLanguage } from '../context/LanguageContext';

interface UserProfile {
  name: string;
  email: string;
  workoutsCount: number;
  streakDays: number;
  achievements: number;
  level: number;
}

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

const initialProfile: UserProfile = {
  name: 'Иван Иванов',
  email: 'ivan@example.com',
  workoutsCount: 0,
  streakDays: 0,
  achievements: 0,
  level: 1,
};

const languages: LanguageOption[] = [
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
];

const Profile = () => {
  const theme = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [profile, setProfile] = useLocalStorage<UserProfile>('userProfile', initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editProfile, setEditProfile] = useState<UserProfile>(profile);
  const [openSettings, setOpenSettings] = useState(false);
  const [openPrivacy, setOpenPrivacy] = useState(false);
  const [openLanguage, setOpenLanguage] = useState(false);
  const [privacySettings, setPrivacySettings] = useLocalStorage('privacySettings', {
    profileVisibility: 'public',
    showWorkouts: true,
    showProgress: true,
    showAchievements: true,
    showStatistics: true,
    allowFriendRequests: true,
  });

  const handleEditClick = () => {
    setEditProfile(profile);
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setProfile(editProfile);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof UserProfile) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditProfile({
      ...editProfile,
      [field]: event.target.value,
    });
  };

  const handlePrivacyChange = (setting: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrivacySettings({
      ...privacySettings,
      [setting]: event.target.checked,
    });
  };

  const handleProfileVisibilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrivacySettings({
      ...privacySettings,
      profileVisibility: event.target.checked ? 'public' : 'private',
    });
  };

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode);
    setOpenLanguage(false);
  };

  return (
    <Box>
      <Card 
        sx={{ 
          mb: 3,
          borderRadius: 3,
          boxShadow: theme.shadows[2],
          '&:hover': {
            boxShadow: theme.shadows[4],
          },
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: theme.palette.primary.main,
                mr: 3,
              }}
            >
              <Person sx={{ fontSize: 60 }} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              {isEditing ? (
                <Box>
                  <TextField
                    label={t('profile.name')}
                    value={editProfile.name}
                    onChange={handleInputChange('name')}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label={t('profile.email')}
                    value={editProfile.email}
                    onChange={handleInputChange('email')}
                    fullWidth
                  />
                </Box>
              ) : (
                <Box>
                  <Typography variant="h4" gutterBottom>
                    {profile.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {profile.email}
                  </Typography>
                </Box>
              )}
            </Box>
            <Box>
              {isEditing ? (
                <>
                  <IconButton
                    onClick={handleSaveClick}
                    sx={{ color: theme.palette.success.main }}
                  >
                    <Save />
                  </IconButton>
                  <IconButton
                    onClick={handleCancelClick}
                    sx={{ color: theme.palette.error.main }}
                  >
                    <Close />
                  </IconButton>
                </>
              ) : (
                <IconButton
                  onClick={handleEditClick}
                  sx={{ color: theme.palette.primary.main }}
                >
                  <Edit />
                </IconButton>
              )}
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {t('profile.stats.workouts')}
                  </Typography>
                  <Typography variant="h3">
                    {profile.workoutsCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: 'secondary.main', color: 'white' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {t('profile.stats.streak')}
                  </Typography>
                  <Typography variant="h3">
                    {profile.streakDays}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {t('profile.stats.achievements')}
                  </Typography>
                  <Typography variant="h3">
                    {profile.achievements}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: theme.palette.grey[800], color: 'white' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {t('profile.stats.level')}
                  </Typography>
                  <Typography variant="h3">
                    {profile.level}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card 
        sx={{ 
          mb: 3,
          borderRadius: 3,
          boxShadow: theme.shadows[2],
          '&:hover': {
            boxShadow: theme.shadows[4],
          },
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">
              {t('profile.settings.title')}
            </Typography>
            <Settings sx={{ ml: 1, color: 'text.secondary' }} />
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="outlined"
                sx={{ justifyContent: 'flex-start', py: 2 }}
                onClick={() => setOpenSettings(true)}
              >
                {t('profile.settings.notifications')}
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="outlined"
                sx={{ justifyContent: 'flex-start', py: 2 }}
                onClick={() => setOpenPrivacy(true)}
                startIcon={<Lock />}
              >
                {t('profile.settings.privacy')}
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="outlined"
                sx={{ justifyContent: 'flex-start', py: 2 }}
                onClick={() => setOpenLanguage(true)}
              >
                {t('profile.settings.language')}
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                sx={{ justifyContent: 'flex-start', py: 2 }}
              >
                {t('profile.settings.logout')}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Dialog
        open={openSettings}
        onClose={() => setOpenSettings(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Настройки уведомлений</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" gutterBottom>
              Настройте, какие уведомления вы хотите получать:
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
              >
                Напоминания о тренировках
              </Button>
              <Button
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
              >
                Достижения
              </Button>
              <Button
                fullWidth
                variant="outlined"
              >
                Новости и обновления
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSettings(false)}>Закрыть</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openPrivacy}
        onClose={() => setOpenPrivacy(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Lock sx={{ mr: 1 }} />
            Настройки приватности
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Видимость профиля
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={privacySettings.profileVisibility === 'public'}
                  onChange={handleProfileVisibilityChange}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {privacySettings.profileVisibility === 'public' ? (
                    <>
                      <Visibility sx={{ mr: 1, color: theme.palette.success.main }} />
                      <Typography>Публичный профиль</Typography>
                    </>
                  ) : (
                    <>
                      <VisibilityOff sx={{ mr: 1, color: theme.palette.error.main }} />
                      <Typography>Приватный профиль</Typography>
                    </>
                  )}
                </Box>
              }
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
              {privacySettings.profileVisibility === 'public' 
                ? 'Ваш профиль виден всем пользователям'
                : 'Ваш профиль виден только вам'}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Что показывать другим пользователям
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={privacySettings.showWorkouts}
                  onChange={handlePrivacyChange('showWorkouts')}
                  color="primary"
                />
              }
              label="Мои тренировки"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={privacySettings.showProgress}
                  onChange={handlePrivacyChange('showProgress')}
                  color="primary"
                />
              }
              label="Мой прогресс"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={privacySettings.showAchievements}
                  onChange={handlePrivacyChange('showAchievements')}
                  color="primary"
                />
              }
              label="Мои достижения"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={privacySettings.showStatistics}
                  onChange={handlePrivacyChange('showStatistics')}
                  color="primary"
                />
              }
              label="Моя статистика"
            />

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Социальные настройки
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={privacySettings.allowFriendRequests}
                  onChange={handlePrivacyChange('allowFriendRequests')}
                  color="primary"
                />
              }
              label="Разрешить запросы в друзья"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPrivacy(false)}>Закрыть</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openLanguage}
        onClose={() => setOpenLanguage(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Language sx={{ mr: 1 }} />
            {t('profile.language.title')}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {t('profile.language.select')}
            </Typography>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {languages.map((lang) => (
                <ListItem
                  key={lang.code}
                  button
                  onClick={() => handleLanguageChange(lang.code)}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
                >
                  <ListItemIcon>
                    {language === lang.code ? (
                      <Check color="primary" />
                    ) : (
                      <Box sx={{ width: 24 }} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={lang.nativeName}
                    secondary={lang.name}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLanguage(false)}>
            {t('profile.language.close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile; 
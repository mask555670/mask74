export const translations = {
  ru: {
    common: {
      cancel: 'Отмена',
      save: 'Сохранить',
      add: 'Добавить',
    },
    profile: {
      title: 'Профиль',
      edit: 'Редактировать',
      save: 'Сохранить',
      cancel: 'Отмена',
      name: 'Имя',
      email: 'Email',
      stats: {
        workouts: 'Тренировок',
        streak: 'Дней подряд',
        achievements: 'Достижений',
        level: 'Уровень'
      },
      settings: {
        title: 'Настройки',
        notifications: 'Уведомления',
        privacy: 'Приватность',
        language: 'Язык',
        logout: 'Выйти'
      },
      privacy: {
        title: 'Настройки приватности',
        visibility: 'Видимость профиля',
        public: 'Публичный профиль',
        private: 'Приватный профиль',
        showToOthers: 'Что показывать другим пользователям',
        workouts: 'Мои тренировки',
        progress: 'Мой прогресс',
        achievements: 'Мои достижения',
        statistics: 'Моя статистика',
        social: 'Социальные настройки',
        friendRequests: 'Разрешить запросы в друзья'
      },
      language: {
        title: 'Выбор языка',
        select: 'Выберите предпочитаемый язык интерфейса',
        close: 'Закрыть'
      }
    },
    workouts: {
      title: 'Тренировки',
      addWorkout: 'Добавить тренировку',
      empty: 'У вас пока нет тренировок',
      date: 'Дата',
      name: 'Название тренировки',
      exerciseName: 'Название упражнения',
      exercise: 'Упражнение',
      reps: 'Повторения',
      weight: 'Вес',
      sets: 'Подходы',
      addSet: 'Добавить подход',
      addExercise: 'Добавить упражнение',
      editWorkout: 'Редактировать тренировку',
      editExercise: 'Редактировать упражнение',
      set: (values: { number: number; reps?: number; weight?: number }) => {
        if (values.reps && values.weight) {
          return `Подход ${values.number}: ${values.reps} повторений × ${values.weight} кг`;
        }
        return `Подход ${values.number}`;
      },
    },
    progress: {
      title: 'Прогресс',
      add: 'Добавить измерение',
      date: 'Дата',
      weight: 'Вес',
      height: 'Рост',
      chest: 'Обхват груди',
      waist: 'Обхват талии',
      hips: 'Обхват бедер',
      shoulders: 'Обхват плеч',
      forearm: 'Обхват предплечья',
      glutes: 'Обхват ягодиц',
      biceps: 'Обхват бицепса',
      thigh: 'Обхват бедра',
      stats: 'Статистика',
      chart: 'Динамика изменений',
      cancel: 'Отмена',
    },
  },
  en: {
    profile: {
      title: 'Profile',
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      name: 'Name',
      email: 'Email',
      stats: {
        workouts: 'Workouts',
        streak: 'Day Streak',
        achievements: 'Achievements',
        level: 'Level'
      },
      settings: {
        title: 'Settings',
        notifications: 'Notifications',
        privacy: 'Privacy',
        language: 'Language',
        logout: 'Logout'
      },
      privacy: {
        title: 'Privacy Settings',
        visibility: 'Profile Visibility',
        public: 'Public Profile',
        private: 'Private Profile',
        showToOthers: 'What to show to other users',
        workouts: 'My Workouts',
        progress: 'My Progress',
        achievements: 'My Achievements',
        statistics: 'My Statistics',
        social: 'Social Settings',
        friendRequests: 'Allow Friend Requests'
      },
      language: {
        title: 'Language Selection',
        select: 'Select your preferred interface language',
        close: 'Close'
      }
    },
    workouts: {
      title: 'Workouts',
      add: 'Add Workout',
      empty: 'You have no workouts yet',
      date: 'Date',
      name: 'Name',
      exercise: 'Exercise',
      reps: 'Reps',
      weight: 'Weight',
      sets: 'Sets',
      addSet: 'Add Set',
      addExercise: 'Add Exercise',
      editWorkout: 'Edit Workout',
      editExercise: 'Edit Exercise',
      cancel: 'Cancel',
      save: 'Save',
      set: (values: { number: number; reps?: number; weight?: number }) => {
        if (values.reps && values.weight) {
          return `Set ${values.number}: ${values.reps} reps × ${values.weight} kg`;
        }
        return `Set ${values.number}`;
      },
    },
    progress: {
      title: 'Progress',
      add: 'Add Measurement',
      date: 'Date',
      weight: 'Weight',
      height: 'Height',
      chest: 'Chest',
      waist: 'Waist',
      hips: 'Hips',
      shoulders: 'Shoulders',
      forearm: 'Forearm',
      glutes: 'Glutes',
      biceps: 'Biceps',
      thigh: 'Thigh',
      stats: 'Statistics',
      chart: 'Progress Chart',
      cancel: 'Cancel',
    },
  },
  de: {
    profile: {
      title: 'Profil',
      edit: 'Bearbeiten',
      save: 'Speichern',
      cancel: 'Abbrechen',
      name: 'Name',
      email: 'E-Mail',
      stats: {
        workouts: 'Workouts',
        streak: 'Tage in Folge',
        achievements: 'Erfolge',
        level: 'Level'
      },
      settings: {
        title: 'Einstellungen',
        notifications: 'Benachrichtigungen',
        privacy: 'Datenschutz',
        language: 'Sprache',
        logout: 'Abmelden'
      },
      privacy: {
        title: 'Datenschutzeinstellungen',
        visibility: 'Profil-Sichtbarkeit',
        public: 'Öffentliches Profil',
        private: 'Privates Profil',
        showToOthers: 'Was anderen Nutzern angezeigt werden soll',
        workouts: 'Meine Workouts',
        progress: 'Mein Fortschritt',
        achievements: 'Meine Erfolge',
        statistics: 'Meine Statistiken',
        social: 'Soziale Einstellungen',
        friendRequests: 'Freundschaftsanfragen erlauben'
      },
      language: {
        title: 'Sprachauswahl',
        select: 'Wählen Sie Ihre bevorzugte Sprache',
        close: 'Schließen'
      }
    },
    workouts: {
      title: 'Workouts',
      add: 'Workout hinzufügen',
      empty: 'Sie haben noch keine Workouts',
      date: 'Datum',
      name: 'Name',
      exercise: 'Übung',
      reps: 'Wiederholungen',
      weight: 'Gewicht',
      sets: 'Sätze',
      addSet: 'Satz hinzufügen',
      addExercise: 'Übung hinzufügen',
      editWorkout: 'Workout bearbeiten',
      editExercise: 'Übung bearbeiten',
      cancel: 'Abbrechen',
      save: 'Speichern',
      set: (values: { number: number; reps?: number; weight?: number }) => {
        if (values.reps && values.weight) {
          return `Satz ${values.number}: ${values.reps} Wiederholungen × ${values.weight} kg`;
        }
        return `Satz ${values.number}`;
      },
    },
    progress: {
      title: 'Fortschritt',
      add: 'Messung hinzufügen',
      date: 'Datum',
      weight: 'Gewicht',
      height: 'Größe',
      chest: 'Brustumfang',
      waist: 'Taillenumfang',
      hips: 'Hüftumfang',
      shoulders: 'Schulterumfang',
      forearm: 'Unterarmumfang',
      glutes: 'Gesäßumfang',
      biceps: 'Bizepsumfang',
      thigh: 'Oberschenkelumfang',
      stats: 'Statistiken',
      chart: 'Fortschrittsdiagramm',
      cancel: 'Abbrechen',
    },
  }
}; 
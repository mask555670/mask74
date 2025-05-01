export interface Measurement {
  id: string;
  date: string;
  height: number;
  weight: number;
  biceps: number;
  thigh: number;
  waist: number;
  chest: number;
  shoulders: number;
  forearms: number;
}

export interface Set {
  id: string;
  reps: number;
  weight: number;
}

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
}

export interface Workout {
  id: string;
  date: Date;
  name: string;
  exercises: Exercise[];
} 
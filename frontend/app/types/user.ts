export type UserProfile = {
  firstName: string;
  lastName: string;
  createdAt: string;
  age: number;
  weight: number;
  height: number;
  profilePicture: string;
};

export type UserStatistics = {
  totalDistance: string;
  totalSessions: number;
  totalDuration: number;
};

export type UserInfo = {
  profile: UserProfile;
  statistics: UserStatistics;
};

export type HeartRate = {
  min: number;
  max: number;
  average: number;
};

export type UserActivity = {
  date: string;
  distance: number;
  duration: number;
  heartRate: HeartRate;
  caloriesBurned: number;
};


import type { UserActivity, UserInfo } from "../types/user";

export const mockUserInfo: UserInfo  = {
  profile: {
    firstName: "Sophie",
    lastName: "Martin",
    createdAt: "2025-01-01",
    age: 32,
    weight: 60,
    height: 165,
    profilePicture: "/images/profile-picture.png",
  },
  statistics: {
    totalDistance: "2250.2",
    totalSessions: 348,
    totalDuration: 14625,
  },
};

export const mockUserActivity: UserActivity[] = [
  {
    date: "2025-06-01",
    distance: 4.8,
    duration: 31,
    heartRate: {
      min: 143,
      max: 179,
      average: 166,
    },
    caloriesBurned: 345,
  },
  {
    date: "2025-06-07",
    distance: 9.5,
    duration: 62,
    heartRate: {
      min: 138,
      max: 180,
      average: 161,
    },
    caloriesBurned: 665,
  },
  {
    date: "2025-06-12",
    distance: 6.3,
    duration: 40,
    heartRate: {
      min: 142,
      max: 177,
      average: 164,
    },
    caloriesBurned: 445,
  },
  {
    date: "2025-06-15",
    distance: 4.5,
    duration: 29,
    heartRate: {
      min: 144,
      max: 179,
      average: 167,
    },
    caloriesBurned: 325,
  },
  {
    date: "2025-06-22",
    distance: 11.2,
    duration: 72,
    heartRate: {
      min: 135,
      max: 180,
      average: 159,
    },
    caloriesBurned: 765,
  },
  {
    date: "2025-06-29",
    distance: 5.7,
    duration: 37,
    heartRate: {
      min: 142,
      max: 177,
      average: 164,
    },
    caloriesBurned: 405,
  },
];


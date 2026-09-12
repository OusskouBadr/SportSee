import type { UserActivity, UserInfo } from "../types/user";

export type DashboardUser = {
  fullName: string;
  firstName: string;
  profilePicture: string;
  createdAt: string;
  totalDistance: number;
  totalSessions: number;
  totalDuration: number;
};

export type DashboardActivity = {
  date: string;
  distance: number;
  duration: number;
  minHeartRate: number;
  maxHeartRate: number;
  averageHeartRate: number;
  caloriesBurned: number;
};

export function adaptUserInfo(userInfo: UserInfo): DashboardUser {
  return {
    fullName: `${userInfo.profile.firstName} ${userInfo.profile.lastName}`,
    firstName: userInfo.profile.firstName,
    profilePicture: userInfo.profile.profilePicture,
    createdAt: userInfo.profile.createdAt,

    totalDistance: Number(userInfo.statistics.totalDistance),
    totalSessions: userInfo.statistics.totalSessions,
    totalDuration: userInfo.statistics.totalDuration,
  };
}

export function adaptUserActivity(
  activities: UserActivity[]
): DashboardActivity[] {
  return activities.map((activity) => ({
    date: activity.date,
    distance: activity.distance,
    duration: activity.duration,
    minHeartRate: activity.heartRate.min,
    maxHeartRate: activity.heartRate.max,
    averageHeartRate: activity.heartRate.average,
    caloriesBurned: activity.caloriesBurned,
  }));
}

export type ProfileUser = {
  fullName: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  createdAt: string;
  age: number;
  weight: number;
  height: number;
  totalDistance: number;
  totalSessions: number;
  totalDuration: number;
  totalCalories: number;
};

export function adaptUserProfile(
  userInfo: UserInfo,
  activities: UserActivity[]
  ) : ProfileUser {
  const totalCalories = activities.reduce(
    (total, activity) => total + activity.caloriesBurned,
    0
  );

  return {
    fullName: `${userInfo.profile.firstName} ${userInfo.profile.lastName}`,
    firstName: userInfo.profile.firstName,
    lastName: userInfo.profile.lastName,
    profilePicture: userInfo.profile.profilePicture,
    createdAt: userInfo.profile.createdAt,
    age: userInfo.profile.age,
    weight: userInfo.profile.weight,
    height: userInfo.profile.height,

    totalDistance: Number(userInfo.statistics.totalDistance),
    totalSessions: userInfo.statistics.totalSessions,
    totalDuration: userInfo.statistics.totalDuration,

    totalCalories,
  };
}


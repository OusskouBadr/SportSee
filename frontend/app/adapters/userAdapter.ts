import type { UserActivity, UserInfo } from "../types/user";

export type DashboardUser = {
  fullName: string;
  firstName: string;
  profilePicture: string;
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

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DashboardActivity } from "../../../adapters/userAdapter";

import "./DistanceChart.css";

type DistanceChartProps = {
  activities: DashboardActivity[];
  periodOffset: number;
};

type WeekData = {
  name: string;
  distance: number;
  startDate: string;
  endDate: string;
};

function formatTooltipDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
  })
    .format(date)
    .replace("/", ".");
}

function getFourWeeks(
  activities: DashboardActivity[],
  periodOffset: number
): WeekData[] {
  if (activities.length === 0) {
    return [];
  }

  const sortedActivities = [...activities].sort(
    (a, b) =>
      new Date(a.date).getTime() -
      new Date(b.date).getTime()
  );

  const latestDate = new Date(
    `${sortedActivities[sortedActivities.length - 1].date}T12:00:00`
  );

  const daysSinceMonday =
    (latestDate.getDay() + 6) % 7;

  const currentWeekStart = new Date(latestDate);

  currentWeekStart.setDate(
    latestDate.getDate() - daysSinceMonday
  );

  // Chaque clic déplace toute la fenêtre de 4 semaines
  currentWeekStart.setDate(
    currentWeekStart.getDate() + periodOffset * 28
  );

  return Array.from({ length: 4 }, (_, index) => {
    const weeksAgo = 3 - index;

    const start = new Date(currentWeekStart);

    start.setDate(
      currentWeekStart.getDate() - weeksAgo * 7
    );

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const distance = sortedActivities
      .filter((activity) => {
        const activityDate = new Date(
          `${activity.date}T12:00:00`
        );

        return (
          activityDate >= start &&
          activityDate <= end
        );
      })
      .reduce(
        (total, activity) =>
          total + activity.distance,
        0
      );

    return {
      name: `S${index + 1}`,
      distance: Number(distance.toFixed(1)),
      startDate: formatTooltipDate(start),
      endDate: formatTooltipDate(end),
    };
  });
}

type TooltipProps = {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: WeekData;
  }>;
};

function DistanceTooltip({
  active,
  payload,
}: TooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="distance-tooltip">
      <span>
        {data.startDate} au {data.endDate}
      </span>

      <strong>{payload[0].value} km</strong>
    </div>
  );
}

export function DistanceChart({
  activities,
  periodOffset,
}: DistanceChartProps) {
  const data = getFourWeeks(
    activities,
    periodOffset
  );

  return (
    <div className="distance-chart">
      <div className="distance-chart-container">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="#eeeeee"
            />

            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={{
                stroke: "#aaaaaa",
              }}
              tick={{
                fontSize: 11,
                fill: "#777777",
              }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{
                fontSize: 10,
                fill: "#999999",
              }}
            />

            <Tooltip
              content={<DistanceTooltip />}
              cursor={{
                fill: "transparent",
              }}
            />

            <Bar
              dataKey="distance"
              fill="#AAB5FF"
              barSize={14}
              radius={[8, 8, 8, 8]}
              activeBar={{
                fill: "#0B23F4",
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="distance-chart-legend">
        <span className="distance-chart-legend-dot" />
        <span>Km</span>
      </div>
    </div>
  );
}
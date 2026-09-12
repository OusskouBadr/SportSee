import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useState } from "react";

import type { DashboardActivity } from "../../../adapters/userAdapter";

import "./HeartRateChart.css";

type HeartRateChartProps = {
  activities: DashboardActivity[];
};

type HeartRateData = {
  day: string;
  date: string;
  min: number;
  max: number;
  average: number;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(`${date}T12:00:00`));
}

function formatFullDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR").format(
    new Date(`${date}T12:00:00`)
  );
}

function getHeartRateData(
  activities: DashboardActivity[]
): HeartRateData[] {
  return [...activities]
    .sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
    )
    .slice(-7)
    .map((activity) => ({
      day: formatDate(activity.date),
      date: formatFullDate(activity.date),
      min: activity.minHeartRate,
      max: activity.maxHeartRate,
      average: activity.averageHeartRate,
    }));
}

/* =========================
   TOOLTIP
   ========================= */

type TooltipProps = {
  active?: boolean;
  payload?: Array<{
    payload: HeartRateData;
  }>;
};

function HeartRateTooltip({
  active,
  payload,
}: TooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="heart-tooltip">
      <span>{data.date}</span>

      <p>
        Min : <strong>{data.min} BPM</strong>
      </p>

      <p>
        Max : <strong>{data.max} BPM</strong>
      </p>

      <p>
        Moyenne : <strong>{data.average} BPM</strong>
      </p>
    </div>
  );
}

/* =========================
   POINT BLEU
   ========================= */

type DotProps = {
  cx?: number;
  cy?: number;
  isHovered?: boolean;
};

function AverageDot({
  cx,
  cy,
  isHovered,
}: DotProps) {
  if (cx === undefined || cy === undefined) {
    return null;
  }

  /*
   * La Line est normalement positionnée
   * au centre du groupe des deux barres.
   * On décale donc son point légèrement
   * vers la droite pour le placer au-dessus
   * de la barre Max.
   */
  return (
    <circle
      cx={cx + 7}
      cy={cy}
      r={3}
      fill={
        isHovered ? "#0B23F4" : "#AAB5FF"
      }
    />
  );
}

function ActiveAverageDot({
  cx,
  cy,
}: DotProps) {
  if (cx === undefined || cy === undefined) {
    return null;
  }

  return (
    <circle
      cx={cx + 7}
      cy={cy}
      r={5}
      fill="#0B23F4"
      stroke="#FFFFFF"
      strokeWidth={2}
    />
  );
}

/* =========================
   GRAPH
   ========================= */

export function HeartRateChart({
  activities,
} : HeartRateChartProps) {
  const data = getHeartRateData(activities);

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="heart-rate-chart">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <ComposedChart
          data={data}
          barGap={4}
          margin={{
            top: 15,
            right: 10,
            left: -15,
            bottom: 0,
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
        <CartesianGrid
          vertical={false}
          strokeDasharray="3 3"
          stroke="#EEEEEE"
        />

          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={{
              stroke: "#AAAAAA",
            }}
            tick={{
              fontSize: 10,
              fill: "#777777",
            }}
          />

          <YAxis
            domain={["dataMin - 5", "dataMax + 5"]}
            tickLine={false}
            axisLine={false}
            tick={{
              fontSize: 10,
              fill: "#999999",
            }}
          />

          <Tooltip
            content={<HeartRateTooltip />}
            cursor={{
              fill: "transparent",
            }}
          />

          {/* Fréquence cardiaque minimale */}
          <Bar
            dataKey="min"
            fill="#FFC1B8"
            barSize={10}
            radius={[6, 6, 6, 6]}
          />

          {/* Fréquence cardiaque maximale */}
          <Bar
            dataKey="max"
            fill="#F4320B"
            barSize={10}
            radius={[6, 6, 6, 6]}
          />

          {/* Fréquence cardiaque moyenne */}
          <Line
            type="monotone"
            dataKey="average"
            stroke={
              isHovered ? "#0B23F4" : "#D7DCFF"
            }
            strokeWidth={2}
            dot={<AverageDot isHovered={isHovered}/>}
            activeDot={<ActiveAverageDot />}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
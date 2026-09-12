import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import "./WeeklyGoalChart.css";

type WeeklyGoalChartProps = {
  completed: number;
  goal: number;
};

export function WeeklyGoalChart({
  completed,
  goal,
}: WeeklyGoalChartProps) {
  const safeCompleted = Math.min(completed, goal);

  const remaining = Math.max(
    goal - safeCompleted,
    0
  );

  const data = [
    {
      name: "Réalisées",
      value: safeCompleted,
    },
    {
      name: "Restantes",
      value: remaining,
    },
  ];

  return (
    <div className="weekly-goal-chart-wrapper">
      <div className="weekly-goal-remaining">
        <span className="weekly-dot weekly-dot-remaining" />

        <span>
          {remaining} restant
          {remaining > 1 ? "s" : ""}
        </span>
      </div>

      <div className="weekly-goal-chart">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={48}
              outerRadius={70}
              startAngle={120}
              endAngle={-240}
              stroke="none"
            >
              <Cell fill="#0B23F4" />
              <Cell fill="#AAB5FF" />
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="weekly-goal-completed">
        <span className="weekly-dot weekly-dot-completed" />

        <span>
          {safeCompleted} réalisée
          {safeCompleted > 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
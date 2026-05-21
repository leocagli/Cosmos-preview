import { useMemo, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DailyCount } from "./cosmosPayOverviewAnalytics";
import { PANEL_SURFACE_CARD_CLASS } from "../panel/panelLayout";

const TOOLTIP_STYLE: CSSProperties = {
  backgroundColor: "rgba(28, 22, 40, 0.96)",
  border: "1px solid rgba(42, 36, 56, 0.9)",
  borderRadius: "12px",
  fontSize: "12px",
  color: "#fafafa",
};

const AXIS = { fill: "var(--cosmos-palette-muted)", fontSize: 11 };
const GRID = { stroke: "rgba(163, 158, 187, 0.12)" };

type ActivityChartProps = {
  data: DailyCount[];
};

export function CosmosPayDevActivityChart({ data }: ActivityChartProps) {
  const { t } = useTranslation();
  const chartData = useMemo(() => data.map((d) => ({ ...d, name: d.label })), [data]);

  return (
    <div className={[PANEL_SURFACE_CARD_CLASS, "p-4 sm:p-5"].join(" ")}>
      <div className="relative z-[1]">
        <div className="mb-4">
          <h3 className="m-0 font-display text-base font-semibold text-cosmos-text">{t("cosmosPayDev.overviewChartActivityTitle")}</h3>
          <p className="m-0 mt-1 text-xs text-cosmos-muted">{t("cosmosPayDev.overviewChartActivitySubtitle")}</p>
        </div>
        <div className="h-[200px] w-full min-h-[180px] sm:h-[240px] sm:min-h-[220px]">
        {chartData.every((d) => d.count === 0) ? (
          <p className="flex h-full items-center justify-center text-sm text-cosmos-muted m-0">{t("cosmosPayDev.overviewChartEmpty")}</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="cpVolumeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(63, 142, 252)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="rgb(63, 142, 252)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid {...GRID} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={AXIS} tickLine={false} axisLine={{ stroke: "var(--cosmos-palette-border)" }} />
              <YAxis allowDecimals={false} width={36} tick={AXIS} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                labelStyle={{ color: "var(--cosmos-palette-text)" }}
                formatter={(value: number | string) => [value, t("cosmosPayDev.overviewChartLinks")]}
              />
              <Area
                type="monotone"
                dataKey="count"
                name={t("cosmosPayDev.overviewChartLinks")}
                stroke="rgb(63, 142, 252)"
                strokeWidth={2}
                fill="url(#cpVolumeGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
        </div>
      </div>
    </div>
  );
}

type StatusSlice = { name: string; value: number; color: string };

type StatusChartProps = {
  active: number;
  archived: number;
};

export function CosmosPayDevStatusChart({ active, archived }: StatusChartProps) {
  const { t } = useTranslation();
  const data: StatusSlice[] = useMemo(
    () => [
      { name: t("cosmosPayDev.linksStatusActive"), value: active, color: "rgb(45, 212, 191)" },
      { name: t("cosmosPayDev.linksStatusArchived"), value: archived, color: "rgb(251, 191, 36)" },
    ],
    [active, archived, t],
  );

  const total = active + archived;

  return (
    <div className={[PANEL_SURFACE_CARD_CLASS, "p-4 sm:p-5"].join(" ")}>
      <div className="relative z-[1]">
        <div className="mb-2">
          <h3 className="m-0 font-display text-base font-semibold text-cosmos-text">{t("cosmosPayDev.overviewChartStatusTitle")}</h3>
          <p className="m-0 mt-1 text-xs text-cosmos-muted">{t("cosmosPayDev.overviewChartStatusSubtitle")}</p>
        </div>
        <div className="h-[200px] w-full min-h-[180px] sm:h-[240px] sm:min-h-[220px]">
        {total === 0 ? (
          <p className="flex h-full items-center justify-center text-sm text-cosmos-muted m-0">{t("cosmosPayDev.overviewChartEmpty")}</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={56}
                outerRadius={88}
                paddingAngle={2}
                stroke="var(--cosmos-palette-border)"
                strokeWidth={1}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(value: number | string) => [value, t("cosmosPayDev.overviewChartCount")]}
              />
              <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        )}
        </div>
      </div>
    </div>
  );
}

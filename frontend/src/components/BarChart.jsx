import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";


const QUERY_COLORS = {
  SELECT: "#38bdf8",
  INSERT: "#22c55e",
  UPDATE: "#f59e0b",
  DELETE: "#ef4444",
  CREATE: "#a78bfa",
  ALTER: "#f97316",
  DROP: "#dc2626",
  TRUNCATE: "#e11d48",
  GRANT: "#14b8a6",
  REVOKE: "#ec4899",
};
export default function QueryChart({ data = [] }) {

  return (

    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

      {/* Header */}

      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="text-xl font-semibold text-white">
            Query Activity
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Database operations by query type
          </p>

        </div>

      </div>


      {/* Chart */}

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: -10,
            bottom: 5,
          }}
          barCategoryGap="25%"
        >

          {/* Grid */}

          <CartesianGrid
            stroke="#1e293b"
            vertical={false}
            strokeDasharray="3 3"
          />


          {/* X Axis */}

          <XAxis
  dataKey="query"
  tick={{
    fill: "#94a3b8",
    fontSize: 11,
  }}
  axisLine={{
    stroke: "#334155",
  }}
  tickLine={false}
  interval={0}
  angle={-25}
  textAnchor="end"
  height={60}
/>

          {/* Y Axis */}

          <YAxis
            allowDecimals={false}
            tick={{
              fill: "#94a3b8",
              fontSize: 12,
            }}
            axisLine={false}
            tickLine={false}
          />


          {/* Tooltip */}

          <Tooltip
            cursor={{
              fill: "rgba(51, 65, 85, 0.25)",
            }}
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "10px",
              color: "#f8fafc",
            }}
            labelStyle={{
              color: "#94a3b8",
              marginBottom: "4px",
            }}
            formatter={(value) => [
              value,
              "Queries",
            ]}
          />


          {/* Bars */}

          <Bar
            dataKey="count"
            name="Queries"
            radius={[6, 6, 0, 0]}
            maxBarSize={55}
          >

            {data.map((entry, index) => (

              <Cell
                key={`cell-${index}`}
                fill={
                  QUERY_COLORS[
                    entry.query?.toUpperCase()
                  ] || "#38bdf8"
                }
              />

            ))}

          </Bar>

        </BarChart>

      </ResponsiveContainer>

    </div>

  );
}
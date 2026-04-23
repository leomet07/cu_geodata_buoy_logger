'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { BuoyLog } from '@/lib/data'

interface WindChartProps {
  data: BuoyLog[]
}

export default function WindChart({ data }: WindChartProps) {
  const chartData = data.map((log) => ({
    time: new Date(log.program_timestamp_utc).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    wind_speed: log.wind_speed_m_s,
  }))

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
        <XAxis dataKey="time" stroke="#71717a" tick={{ fontSize: 11 }} />
        <YAxis stroke="#71717a" tick={{ fontSize: 11 }} unit=" m/s" />
        <Tooltip
          contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: 6 }}
          labelStyle={{ color: '#a1a1aa' }}
          itemStyle={{ color: '#38bdf8' }}
        />
        <Line type="monotone" dataKey="wind_speed" stroke="#38bdf8" dot={false} strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}

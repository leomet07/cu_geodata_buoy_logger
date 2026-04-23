'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { BuoyLog } from '@/lib/data'

interface TempHumidityChartProps {
  data: BuoyLog[]
}

export default function TempHumidityChart({ data }: TempHumidityChartProps) {
  const chartData = data.map((log) => ({
    time: new Date(log.program_timestamp_utc).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    temperature: log.air_temperature_C,
    humidity: log.relative_humidity_percent,
  }))

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
        <XAxis dataKey="time" stroke="#71717a" tick={{ fontSize: 11 }} />
        <YAxis stroke="#71717a" tick={{ fontSize: 11 }} />
        <Tooltip
          contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: 6 }}
          labelStyle={{ color: '#a1a1aa' }}
        />
        <Legend wrapperStyle={{ color: '#a1a1aa', fontSize: 12 }} />
        <Line type="monotone" dataKey="temperature" name="Temp (°C)" stroke="#f97316" dot={false} strokeWidth={2} />
        <Line type="monotone" dataKey="humidity" name="Humidity (%)" stroke="#a78bfa" dot={false} strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}

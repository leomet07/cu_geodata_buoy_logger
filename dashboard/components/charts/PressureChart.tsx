'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { BuoyLog } from '@/lib/data'

interface PressureChartProps {
  data: BuoyLog[]
}

export default function PressureChart({ data }: PressureChartProps) {
  const chartData = data.map((log) => ({
    time: new Date(log.program_timestamp_utc).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    pressure: log.pressure_hPa,
  }))

  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="pressureGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
        <XAxis dataKey="time" stroke="#71717a" tick={{ fontSize: 11 }} />
        <YAxis stroke="#71717a" tick={{ fontSize: 11 }} unit=" hPa" domain={['auto', 'auto']} />
        <Tooltip
          contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: 6 }}
          labelStyle={{ color: '#a1a1aa' }}
          itemStyle={{ color: '#34d399' }}
        />
        <Area type="monotone" dataKey="pressure" stroke="#34d399" fill="url(#pressureGradient)" strokeWidth={2} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

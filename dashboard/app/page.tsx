import { getRecentBuoyLogs } from '@/lib/data'
import MetricCard from '@/components/MetricCard'
import WindChart from '@/components/charts/WindChart'
import TempHumidityChart from '@/components/charts/TempHumidityChart'
import PressureChart from '@/components/charts/PressureChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function DashboardPage() {
  const logs = await getRecentBuoyLogs(50)
  const latest = logs[logs.length - 1]

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Buoy Logger Dashboard</h1>
        {latest && (
          <p className="text-zinc-400 text-sm mt-1">
            Node {latest.node_letter} · Last update:{' '}
            {new Date(latest.program_timestamp_utc).toLocaleString()}
          </p>
        )}
      </div>

      {logs.length === 0 ? (
        <p className="text-zinc-400">No data found in the database.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <MetricCard title="Wind Speed" value={latest.wind_speed_m_s} unit="m/s" />
            <MetricCard title="Temperature" value={latest.air_temperature_C} unit="°C" />
            <MetricCard title="Humidity" value={latest.relative_humidity_percent} unit="%" />
            <MetricCard title="Pressure" value={latest.pressure_hPa} unit="hPa" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">Wind Speed</CardTitle>
              </CardHeader>
              <CardContent>
                <WindChart data={logs} />
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">Temperature & Humidity</CardTitle>
              </CardHeader>
              <CardContent>
                <TempHumidityChart data={logs} />
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 md:col-span-2 xl:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">Atmospheric Pressure</CardTitle>
              </CardHeader>
              <CardContent>
                <PressureChart data={logs} />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </main>
  )
}

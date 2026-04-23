import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface MetricCardProps {
  title: string
  value: number | string
  unit: string
}

export default function MetricCard({ title, value, unit }: MetricCardProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-zinc-400">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">
          {typeof value === 'number' ? value.toFixed(1) : value}
          <span className="text-sm font-normal text-zinc-400 ml-1">{unit}</span>
        </div>
      </CardContent>
    </Card>
  )
}

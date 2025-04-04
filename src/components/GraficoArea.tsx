
import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

// Dados para o gráfico das métricas ambientais
const data = [
  { mes: 'Jan', reciclagem: 65, plantio: 40, economiaAgua: 24 },
  { mes: 'Fev', reciclagem: 59, plantio: 45, economiaAgua: 28 },
  { mes: 'Mar', reciclagem: 80, plantio: 50, economiaAgua: 26 },
  { mes: 'Abr', reciclagem: 81, plantio: 55, economiaAgua: 35 },
  { mes: 'Mai', reciclagem: 90, plantio: 60, economiaAgua: 40 },
  { mes: 'Jun', reciclagem: 95, plantio: 70, economiaAgua: 45 },
  { mes: 'Jul', reciclagem: 100, plantio: 80, economiaAgua: 50 },
  { mes: 'Ago', reciclagem: 120, plantio: 90, economiaAgua: 55 },
  { mes: 'Set', reciclagem: 110, plantio: 85, economiaAgua: 48 },
  { mes: 'Out', reciclagem: 105, plantio: 82, economiaAgua: 46 },
  { mes: 'Nov', reciclagem: 100, plantio: 85, economiaAgua: 50 },
  { mes: 'Dez', reciclagem: 115, plantio: 88, economiaAgua: 52 },
];

const config = {
  reciclagem: {
    label: 'Reciclagem (kg)',
    theme: {
      light: '#4C7C54',
      dark: '#4C7C54',
    },
  },
  plantio: {
    label: 'Árvores Plantadas',
    theme: {
      light: '#8B5A2B',
      dark: '#8B5A2B',
    },
  },
  economiaAgua: {
    label: 'Economia de Água (L)',
    theme: {
      light: '#6EB5C0',
      dark: '#6EB5C0',
    },
  },
};

export function GraficoArea() {
  return (
    <ChartContainer className="aspect-video h-[300px] p-1" config={config}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="mes"
            className="text-xs font-medium"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            className="text-xs font-medium"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <ChartTooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <ChartTooltipContent
                    className="border-none bg-background/80 backdrop-blur-sm"
                    payload={payload}
                  />
                );
              }

              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="reciclagem"
            stroke="var(--color-reciclagem)"
            fill="var(--color-reciclagem)"
            strokeWidth={2}
            activeDot={{ r: 6 }}
            fillOpacity={0.2}
          />
          <Area
            type="monotone"
            dataKey="plantio"
            stroke="var(--color-plantio)"
            fill="var(--color-plantio)"
            strokeWidth={2}
            activeDot={{ r: 6 }}
            fillOpacity={0.2}
          />
          <Area
            type="monotone"
            dataKey="economiaAgua"
            stroke="var(--color-economiaAgua)"
            fill="var(--color-economiaAgua)"
            strokeWidth={2}
            activeDot={{ r: 6 }}
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

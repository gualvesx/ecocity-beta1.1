
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

// Dados em tempo real simulados para métricas ambientais
const data = [
  { mes: 'Jan', desmatamento: 150, reflorestamento: 40, qualidadeAr: 65 },
  { mes: 'Fev', desmatamento: 180, reflorestamento: 45, qualidadeAr: 62 },
  { mes: 'Mar', desmatamento: 210, reflorestamento: 50, qualidadeAr: 58 },
  { mes: 'Abr', desmatamento: 250, reflorestamento: 55, qualidadeAr: 54 },
  { mes: 'Mai', desmatamento: 320, reflorestamento: 80, qualidadeAr: 50 },
  { mes: 'Jun', desmatamento: 380, reflorestamento: 110, qualidadeAr: 45 },
  { mes: 'Jul', desmatamento: 310, reflorestamento: 150, qualidadeAr: 48 },
  { mes: 'Ago', desmatamento: 280, reflorestamento: 190, qualidadeAr: 52 },
  { mes: 'Set', desmatamento: 250, reflorestamento: 220, qualidadeAr: 56 },
  { mes: 'Out', desmatamento: 210, reflorestamento: 240, qualidadeAr: 60 },
  { mes: 'Nov', desmatamento: 180, reflorestamento: 260, qualidadeAr: 63 },
  { mes: 'Dez', desmatamento: 160, reflorestamento: 280, qualidadeAr: 68 },
];

const config = {
  desmatamento: {
    label: 'Área Desmatada (hectares)',
    theme: {
      light: '#E53935',
      dark: '#E53935',
    },
  },
  reflorestamento: {
    label: 'Área Reflorestada (hectares)',
    theme: {
      light: '#4CAF50',
      dark: '#4CAF50',
    },
  },
  qualidadeAr: {
    label: 'Qualidade do Ar (índice)',
    theme: {
      light: '#3498DB',
      dark: '#3498DB',
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
            dataKey="desmatamento"
            stroke="var(--color-desmatamento)"
            fill="var(--color-desmatamento)"
            strokeWidth={2}
            activeDot={{ r: 6 }}
            fillOpacity={0.2}
          />
          <Area
            type="monotone"
            dataKey="reflorestamento"
            stroke="var(--color-reflorestamento)"
            fill="var(--color-reflorestamento)"
            strokeWidth={2}
            activeDot={{ r: 6 }}
            fillOpacity={0.2}
          />
          <Area
            type="monotone"
            dataKey="qualidadeAr"
            stroke="var(--color-qualidadeAr)"
            fill="var(--color-qualidadeAr)"
            strokeWidth={2}
            activeDot={{ r: 6 }}
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

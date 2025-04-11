
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
import { useLanguage } from '@/contexts/LanguageContext';

export function GraficoArea() {
  const { t } = useLanguage();
  
  // Dados em tempo real simulados para métricas ambientais de Presidente Prudente
  const data = [
    { mes: t('jan'), desmatamento: 32, reflorestamento: 18, qualidadeAr: 65 },
    { mes: t('feb'), desmatamento: 28, reflorestamento: 22, qualidadeAr: 68 },
    { mes: t('mar'), desmatamento: 36, reflorestamento: 24, qualidadeAr: 63 },
    { mes: t('apr'), desmatamento: 42, reflorestamento: 28, qualidadeAr: 60 },
    { mes: t('may'), desmatamento: 48, reflorestamento: 35, qualidadeAr: 58 },
    { mes: t('jun'), desmatamento: 52, reflorestamento: 42, qualidadeAr: 55 },
    { mes: t('jul'), desmatamento: 46, reflorestamento: 48, qualidadeAr: 58 },
    { mes: t('aug'), desmatamento: 41, reflorestamento: 52, qualidadeAr: 62 },
    { mes: t('sep'), desmatamento: 37, reflorestamento: 58, qualidadeAr: 65 },
    { mes: t('oct'), desmatamento: 31, reflorestamento: 64, qualidadeAr: 68 },
    { mes: t('nov'), desmatamento: 29, reflorestamento: 68, qualidadeAr: 70 },
    { mes: t('dec'), desmatamento: 27, reflorestamento: 72, qualidadeAr: 72 },
  ];

  const config = {
    desmatamento: {
      label: t('deforested-area'),
      theme: {
        light: '#E53935',
        dark: '#E53935',
      },
    },
    reflorestamento: {
      label: t('reforested-area'),
      theme: {
        light: '#4CAF50',
        dark: '#4CAF50',
      },
    },
    qualidadeAr: {
      label: t('air-quality-index'),
      theme: {
        light: '#3498DB',
        dark: '#3498DB',
      },
    },
  };

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

'use client';
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Clock, AlertTriangle, CircleCheckBig, LoaderCircle, Calendar } from 'lucide-react';
import useSWR from 'swr';
import { getAgendamentos } from '@/actions/agendamentoService';
import { Agendamento } from '@prisma/client';

export default function Dashboard() {
    const { data, error, isLoading } = useSWR('/agendamentos', getAgendamentos);

    function agruparAgendamentosPorMes(agendamentos: Agendamento[]) {
        const anoAtual = new Date().getFullYear();
        const meses = [
            'Janeiro',
            'Fevereiro',
            'Março',
            'Abril',
            'Maio',
            'Junho',
            'Julho',
            'Agosto',
            'Setembro',
            'Outubro',
            'Novembro',
            'Dezembro',
        ];

        // Inicializar contadores para todos os meses
        const dadosPorMes = meses.map((mes) => ({
            mes,
            total: 0,
            concluidos: 0,
            agendados: 0,
            cancelados: 0,
        }));

        // Contar agendamentos por mês
        agendamentos.forEach((agendamento: Agendamento) => {
            const dataAgendamento = new Date(agendamento.dataHora);
            if (dataAgendamento.getFullYear() === anoAtual) {
                const mesIndex = dataAgendamento.getMonth();
                dadosPorMes[mesIndex].total++;

                if (agendamento.status === 'Concluído') {
                    dadosPorMes[mesIndex].concluidos++;
                } else if (agendamento.status === 'Agendado') {
                    dadosPorMes[mesIndex].agendados++;
                } else if (agendamento.status === 'Cancelado') {
                    dadosPorMes[mesIndex].cancelados++;
                }
            }
        });

        return dadosPorMes;
    }

    if (isLoading) {
        return <LoaderCircle className="animate-spin" />;
    }

    if (error || !data) {
        return (
            <div className="flex w-full h-full items-center justify-center">
                <AlertTriangle color="red" />
                <p>Erro ao buscar paciente!</p>
            </div>
        );
    }

    const dadosChart = agruparAgendamentosPorMes(data);
    const totalAgendamentos = dadosChart.reduce((acc, curr) => acc + curr.total, 0);
    const totalConcluidos = dadosChart.reduce((acc, curr) => acc + curr.concluidos, 0);
    const totalAgendados = dadosChart.reduce((acc, curr) => acc + curr.agendados, 0);
    const totalCancelados = dadosChart.reduce((acc, curr) => acc + curr.cancelados, 0);

    return (
        <div className="h-screen">
            <h2 className="text-3xl font-bold mb-8">Gerenciamento de Exames</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-card rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="text-[#4ac97e]">
                            <CircleCheckBig className="h-8 w-8" />
                        </div>
                        <span className="text-4xl font-bold">{totalConcluidos}</span>
                    </div>
                    <p className="text-[#d0d5dd]">Total de exames concluídos</p>
                </div>

                <div className="bg-card rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="text-[#79b5ec]">
                            <Clock className="h-8 w-8" />
                        </div>
                        <span className="text-4xl font-bold">{totalAgendados}</span>
                    </div>
                    <p className="text-[#d0d5dd]">Total de exames agendados</p>
                </div>

                <div className="bg-card rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="text-[#ff4f4e]">
                            <AlertTriangle className="h-8 w-8" />
                        </div>
                        <span className="text-4xl font-bold">{totalCancelados}</span>
                    </div>
                    <p className="text-[#d0d5dd]">Total de exames cancelados</p>
                </div>
            </div>
            <div className="w-full pb-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Agendamentos por Mês - {new Date().getFullYear()}
                            </CardTitle>
                            <CardDescription>
                                Evolução dos agendamentos ao longo do ano
                            </CardDescription>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold">{totalAgendamentos}</div>
                            <p className="text-xs text-muted-foreground">Total no ano</p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={{
                                concluidos: {
                                    label: 'Concluídos',
                                    color: '#24ae7c', // Verde
                                },
                                agendados: {
                                    label: 'Agendados',
                                    color: '#79b5ec', // Azul
                                },
                                cancelados: {
                                    label: 'Cancelados',
                                    color: '#f37877', // Vermelho
                                },
                            }}
                            className="h-[400px]"
                        >
                            <LineChart
                                accessibilityLayer
                                data={dadosChart}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="mes"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                />
                                <YAxis />
                                <ChartTooltip
                                    cursor={{ strokeDasharray: '3 3' }}
                                    content={
                                        <ChartTooltipContent
                                            formatter={(value, name) => [
                                                value,
                                                name === 'concluidos'
                                                    ? ' - Concluídos'
                                                    : name === 'agendados'
                                                    ? ' - Agendados'
                                                    : ' - Cancelados',
                                            ]}
                                        />
                                    }
                                />

                                {/* Linha dos Concluídos */}
                                <Line
                                    type="monotone"
                                    dataKey="concluidos"
                                    stroke="var(--color-concluidos)"
                                    strokeWidth={3}
                                    dot={{ fill: 'var(--color-concluidos)', strokeWidth: 2, r: 4 }}
                                    activeDot={{
                                        r: 6,
                                        stroke: 'var(--color-concluidos)',
                                        strokeWidth: 2,
                                    }}
                                />

                                {/* Linha dos Agendados */}
                                <Line
                                    type="monotone"
                                    dataKey="agendados"
                                    stroke="var(--color-agendados)"
                                    strokeWidth={3}
                                    dot={{ fill: 'var(--color-agendados)', strokeWidth: 2, r: 4 }}
                                    activeDot={{
                                        r: 6,
                                        stroke: 'var(--color-agendados)',
                                        strokeWidth: 2,
                                    }}
                                />

                                {/* Linha dos Cancelados */}
                                <Line
                                    type="monotone"
                                    dataKey="cancelados"
                                    stroke="var(--color-cancelados)"
                                    strokeWidth={3}
                                    dot={{ fill: 'var(--color-cancelados)', strokeWidth: 2, r: 4 }}
                                    activeDot={{
                                        r: 6,
                                        stroke: 'var(--color-cancelados)',
                                        strokeWidth: 2,
                                    }}
                                />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Car, Clock, PlusCircle } from "lucide-react";

const Dashboard = () => {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ganhos do Dia</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 184,30</div>
            <p className="text-xs text-muted-foreground">
              Saldo de hoje (corridas - despesas)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Corridas Concluídas</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Total de corridas hoje
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horas Online</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8h 32m</div>
            <p className="text-xs text-muted-foreground">
              Tempo total de trabalho hoje
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Button size="lg" className="flex items-center justify-start gap-2 h-12">
            <PlusCircle className="h-5 w-5" />
            <span>Registrar Corrida</span>
          </Button>
          <Button size="lg" className="flex items-center justify-start gap-2 h-12">
            <PlusCircle className="h-5 w-5" />
            <span>Registrar Despesa</span>
          </Button>
          <Button size="lg" className="flex items-center justify-start gap-2 h-12">
            <PlusCircle className="h-5 w-5" />
            <span>Registrar Manutenção</span>
          </Button>
          <Button size="lg" className="flex items-center justify-start gap-2 h-12">
            <PlusCircle className="h-5 w-5" />
            <span>Adicionar Zona de Risco</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
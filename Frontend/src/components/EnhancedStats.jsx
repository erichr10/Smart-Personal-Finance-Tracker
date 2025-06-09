import { DollarSign, TrendingDown, TrendingUp, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const EnhancedStats = ({ transactions }) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const currentMonthTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear;
  });

  const totalIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const netAmount = totalIncome - totalExpenses;

  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  
  const prevMonthTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate.getMonth() === prevMonth && 
           transactionDate.getFullYear() === prevYear;
  });

  const prevMonthExpenses = prevMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const expenseChange = prevMonthExpenses > 0 
    ? ((totalExpenses - prevMonthExpenses) / prevMonthExpenses) * 100 
    : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (percentage) => {
    const sign = percentage > 0 ? '+' : '';
    return `${sign}${percentage.toFixed(1)}%`;
  };

  const stats = [
    {
      title: 'Total Income',
      value: formatCurrency(totalIncome),
      icon: TrendingUp,
      bgGradient: 'from-green-500/10 to-emerald-500/10',
      iconBg: 'bg-green-500',
      textColor: 'text-green-600',
      change: null,
      changeIcon: ArrowUp,
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(totalExpenses),
      icon: TrendingDown,
      bgGradient: 'from-red-500/10 to-rose-500/10',
      iconBg: 'bg-red-500',
      textColor: 'text-red-600',
      change: prevMonthExpenses > 0 ? formatPercentage(expenseChange) : null,
      changeIcon: expenseChange > 0 ? ArrowUp : ArrowDown,
    },
    {
      title: 'Net Amount',
      value: formatCurrency(netAmount),
      icon: DollarSign,
      bgGradient: netAmount >= 0 ? 'from-blue-500/10 to-cyan-500/10' : 'from-orange-500/10 to-red-500/10',
      iconBg: netAmount >= 0 ? 'bg-blue-500' : 'bg-orange-500',
      textColor: netAmount >= 0 ? 'text-blue-600' : 'text-orange-600',
      change: null,
      changeIcon: netAmount >= 0 ? ArrowUp : ArrowDown,
    },
    {
      title: 'Transactions',
      value: currentMonthTransactions.length.toString(),
      icon: Calendar,
      bgGradient: 'from-purple-500/10 to-violet-500/10',
      iconBg: 'bg-purple-500',
      textColor: 'text-purple-600',
      change: null,
      changeIcon: Calendar,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className={`relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.iconBg} shadow-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              {stat.change && (
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    stat.change.startsWith('+')
                      ? 'bg-red-100 text-red-600'
                      : 'bg-green-100 text-green-600'
                  }`}
                >
                  <stat.changeIcon className="h-3 w-3" />
                  {stat.change}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
              <p className={`text-3xl font-bold ${stat.textColor} mb-1`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground">This month</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EnhancedStats;

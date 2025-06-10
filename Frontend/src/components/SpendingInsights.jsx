import { AlertTriangle, TrendingUp, Target, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SpendingInsights = ({ transactions, budgets }) => {
  const currentMonth = new Date().toISOString().slice(0, 7);

  const currentMonthTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate.toISOString().slice(0, 7) === currentMonth;
  });

  const currentMonthExpenses = currentMonthTransactions.filter(t => t.type === 'expense');
  const currentMonthBudgets = budgets.filter(budget => budget.month === currentMonth);

  const insights = [];

  // Over-budget categories
  const overBudgetCategories = currentMonthBudgets.filter(budget => {
    const actualSpending = currentMonthExpenses
      .filter(t => t.category === budget.category)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    return actualSpending > budget.amount;
  });

  if (overBudgetCategories.length > 0) {
    insights.push({
      type: 'warning',
      icon: AlertTriangle,
      title: 'Over Budget Alert',
      description: `You're over budget in ${overBudgetCategories.length} ${overBudgetCategories.length === 1 ? 'category' : 'categories'}: ${overBudgetCategories.map(b => b.category).join(', ')}`,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    });
  }

  // Top spending category
  const categorySpending = currentMonthExpenses.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + Math.abs(transaction.amount);
    return acc;
  }, {});

  const topSpendingCategory = Object.entries(categorySpending).reduce(
    (max, [category, amount]) => (amount > max.amount ? { category, amount } : max),
    { category: '', amount: 0 }
  );

  if (topSpendingCategory.category) {
    insights.push({
      type: 'info',
      icon: TrendingUp,
      title: 'Top Spending Category',
      description: `${topSpendingCategory.category} accounts for $${topSpendingCategory.amount.toFixed(2)} of your expenses this month`,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    });
  }

  // Budget adherence
  const categoriesOnTrack = currentMonthBudgets.filter(budget => {
    const actualSpending = currentMonthExpenses
      .filter(t => t.category === budget.category)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    return actualSpending <= budget.amount * 0.8;
  });

  if (categoriesOnTrack.length > 0) {
    insights.push({
      type: 'success',
      icon: Target,
      title: 'Budget Goals on Track',
      description: `You're doing well in ${categoriesOnTrack.length} ${categoriesOnTrack.length === 1 ? 'category' : 'categories'}: ${categoriesOnTrack.map(b => b.category).join(', ')}`,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    });
  }

  // Monthly spending trend
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const lastMonthStr = lastMonth.toISOString().slice(0, 7);

  const lastMonthExpenses = transactions
    .filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.toISOString().slice(0, 7) === lastMonthStr && transaction.type === 'expense';
    })
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const currentMonthTotal = currentMonthExpenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);

  if (lastMonthExpenses > 0) {
    const percentChange = ((currentMonthTotal - lastMonthExpenses) / lastMonthExpenses) * 100;

    insights.push({
      type: percentChange > 10 ? 'warning' : percentChange < -10 ? 'success' : 'info',
      icon: Calendar,
      title: 'Monthly Spending Trend',
      description: `Your spending is ${Math.abs(percentChange).toFixed(1)}% ${percentChange > 0 ? 'higher' : 'lower'} than last month`,
      color: percentChange > 10 ? 'text-red-600 dark:text-red-400' : percentChange < -10 ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400',
      bgColor: percentChange > 10 ? 'bg-red-50 dark:bg-red-900/20' : percentChange < -10 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-blue-50 dark:bg-blue-900/20',
    });
  }

  if (insights.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No insights available yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Add more transactions and budgets to see spending insights
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {insights.map((insight, index) => {
        const Icon = insight.icon;
        return (
          <Card key={index} className={`border-l-4 ${insight.bgColor}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Icon className={`h-5 w-5 mt-0.5 ${insight.color}`} />
                <div>
                  <h4 className="font-medium">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {insight.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SpendingInsights;

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const BudgetComparisonChart = ({ transactions, budgets }) => {
  const currentMonth = new Date().toISOString().slice(0, 7);

  // Get current month budgets
  const currentMonthBudgets = budgets.filter(budget => budget.month === currentMonth);

  // Calculate actual spending per category
  const actualSpending = currentMonthBudgets.reduce((acc, budget) => {
    const categorySpending = transactions
      .filter(transaction => {
        const transactionDate = new Date(transaction.date);
        const transactionMonth = transactionDate.toISOString().slice(0, 7);
        return (
          transactionMonth === currentMonth &&
          transaction.type === 'expense' &&
          transaction.category === budget.category
        );
      })
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    acc[budget.category] = categorySpending;
    return acc;
  }, {});

  const chartData = currentMonthBudgets.map(budget => ({
    category:
      budget.category.length > 10
        ? budget.category.slice(0, 10) + '...'
        : budget.category,
    budget: Number(budget.amount.toFixed(2)),
    actual: Number((actualSpending[budget.category] || 0).toFixed(2)),
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg shadow-lg p-3">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey === 'budget' ? 'Budget' : 'Actual'}: ${entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-muted-foreground">No budget data to display</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="category"
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
            tickFormatter={value => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="budget"
            fill="hsl(217, 91%, 60%)"
            radius={[4, 4, 0, 0]}
            name="Budget"
          />
          <Bar
            dataKey="actual"
            fill="hsl(0, 84%, 60%)"
            radius={[4, 4, 0, 0]}
            name="Actual"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetComparisonChart;

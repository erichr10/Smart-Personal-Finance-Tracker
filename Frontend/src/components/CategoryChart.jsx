import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// Expected props:
// transactions: Array of { id, amount, description, category, date, type }
const CategoryChart = ({ transactions }) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Filter current month expenses only
  const currentMonthExpenses = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear &&
      transaction.type === 'expense'
    );
  });

  // Group by category
  const categoryData = currentMonthExpenses.reduce((acc, transaction) => {
    const category = transaction.category;
    acc[category] = (acc[category] || 0) + Math.abs(transaction.amount);
    return acc;
  }, {});

  const chartData = Object.entries(categoryData).map(([category, amount]) => ({
    name: category,
    value: Number(amount.toFixed(2)),
  }));

  const COLORS = [
    'hsl(142, 76%, 36%)',
    'hsl(0, 84%, 60%)',
    'hsl(217, 91%, 60%)',
    'hsl(45, 93%, 47%)',
    'hsl(262, 83%, 58%)',
    'hsl(13, 100%, 67%)',
    'hsl(173, 58%, 39%)',
    'hsl(197, 71%, 52%)',
    'hsl(43, 74%, 49%)',
    'hsl(27, 96%, 61%)',
    'hsl(339, 82%, 52%)',
    'hsl(280, 100%, 70%)',
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg shadow-lg p-3">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm" style={{ color: payload[0].color }}>
            ${payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-muted-foreground">No expense data for this month</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;

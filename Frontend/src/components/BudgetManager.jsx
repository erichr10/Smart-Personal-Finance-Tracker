import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORIES } from '@/types/transaction';
import { toast } from 'sonner';

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api";

const BudgetManager = ({ transactions, budgets, onBudgetUpdate }) => {
  const [newBudget, setNewBudget] = useState({
    category: '',
    amount: '',
    month: new Date().toISOString().slice(0, 7) // YYYY-MM format
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newBudget.category || !newBudget.amount || !newBudget.month) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/budgets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newBudget,
          amount: parseFloat(newBudget.amount)
        })
      });

      if (!response.ok) throw new Error('Failed to save budget');

      toast.success('Budget saved successfully');
      setNewBudget({
        category: '',
        amount: '',
        month: new Date().toISOString().slice(0, 7)
      });
      onBudgetUpdate();
    } catch (error) {
      toast.error('Error saving budget');
      console.error('Error saving budget:', error);
    }
  };

  const calculateSpending = (category, month) => {
    return transactions
      .filter(t => 
        t.category === category && 
        t.type === 'expense' && 
        t.date.startsWith(month)
      )
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  };

  const currentMonth = new Date().toISOString().slice(0, 7);

  return (
    <div className="space-y-6">
      {/* Budget Form */}
      <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Set New Budget</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                value={newBudget.category}
                onValueChange={(value) => setNewBudget(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.filter(cat => cat !== 'Income').map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                placeholder="Budget Amount"
                value={newBudget.amount}
                onChange={(e) => setNewBudget(prev => ({ ...prev, amount: e.target.value }))}
                min="0"
                step="0.01"
              />

              <Input
                type="month"
                value={newBudget.month}
                onChange={(e) => setNewBudget(prev => ({ ...prev, month: e.target.value }))}
              />

              <Button type="submit" className="md:col-span-3">
                Set Budget
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Budget Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets
          .filter(budget => budget.month === currentMonth)
          .map(({ category, amount }) => {
            const spent = calculateSpending(category, currentMonth);
            const remaining = amount - spent;
            const status = remaining >= 0 ? 'text-green-500' : 'text-red-500';
            const percentage = (spent / amount) * 100;

            return (
              <Card key={category} className="bg-card/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <h3 className="font-medium mb-3 text-lg">{category}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Budget</span>
                      <span className="font-medium">${amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Spent</span>
                      <span className="font-medium">${spent.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Remaining</span>
                      <span className={`font-medium ${status}`}>
                        ${Math.abs(remaining).toFixed(2)}
                        {remaining < 0 ? ' over' : ''}
                      </span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${percentage > 100 ? 'bg-red-500' : percentage > 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
};

export default BudgetManager;

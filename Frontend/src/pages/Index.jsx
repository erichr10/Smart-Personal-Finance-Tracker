import { useState, useEffect } from 'react';
import { Wallet, Plus, TrendingUp, CreditCard, PieChart, Target, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import MonthlyChart from '@/components/MonthlyChart';
import CategoryChart from '@/components/CategoryChart';
import BudgetManager from '@/components/BudgetManager';
import BudgetComparisonChart from '@/components/BudgetComparisonChart';
import SpendingInsights from '@/components/SpendingInsights';
import EnhancedHeader from '@/components/EnhancedHeader';
import EnhancedStats from '@/components/EnhancedStats';
import { toast } from 'sonner';

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api";

const Index = () => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_URL}/transactions`);
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      toast.error('Error loading transactions');
      console.error('Error loading transactions:', error);
    }
  };

  const fetchBudgets = async () => {
    try {
      const response = await fetch(`${API_URL}/budgets`);
      if (!response.ok) throw new Error('Failed to fetch budgets');
      const data = await response.json();
      setBudgets(data);
    } catch (error) {
      toast.error('Error loading budgets');
      console.error('Error loading budgets:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchBudgets();
  }, []);

  const handleAddTransaction = async (transaction) => {
    try {
      const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction)
      });
      
      if (!response.ok) throw new Error('Failed to add transaction');
      
      const newTransaction = await response.json();
      setTransactions(prev => [newTransaction, ...prev]);
      setShowForm(false);
      toast.success('Transaction added successfully');
    } catch (error) {
      toast.error('Error adding transaction');
      console.error('Error adding transaction:', error);
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleUpdateTransaction = async (updatedTransaction) => {
    if (editingTransaction) {
      try {
        const response = await fetch(`${API_URL}/transactions/${editingTransaction.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedTransaction)
        });

        if (!response.ok) throw new Error('Failed to update transaction');

        const updated = await response.json();
        setTransactions(prev =>
          prev.map(t => t.id === editingTransaction.id ? updated : t)
        );
        setShowForm(false);
        setEditingTransaction(null);
        toast.success('Transaction updated successfully');
      } catch (error) {
        toast.error('Error updating transaction');
        console.error('Error updating transaction:', error);
      }
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete transaction');

      setTransactions(prev => prev.filter(t => t.id !== id));
      toast.success('Transaction deleted successfully');
    } catch (error) {
      toast.error('Error deleting transaction');
      console.error('Error deleting transaction:', error);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <EnhancedHeader onAddTransaction={() => setShowForm(true)} />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <EnhancedStats transactions={transactions} />

          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur-sm border shadow-lg">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground cursor-pointer">Dashboard</TabsTrigger>
              <TabsTrigger value="budgets" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground cursor-pointer">Budgets</TabsTrigger>
              <TabsTrigger value="insights" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground cursor-pointer">Insights</TabsTrigger>
              <TabsTrigger value="transactions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground cursor-pointer">Transactions</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6 mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Monthly Income vs Expenses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MonthlyChart transactions={transactions} />
                  </CardContent>
                </Card>

                <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-primary" />
                      Category Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CategoryChart transactions={transactions} />
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.slice(0, 5).map(transaction => (
                      <div key={transaction.id} className="flex justify-between items-center p-4 rounded-lg bg-gradient-to-r from-muted/50 to-transparent border border-border/50 hover:shadow-md transition-all duration-200">
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <span className={`inline-block w-2 h-2 rounded-full ${
                              transaction.type === 'expense' ? 'bg-red-500' : 'bg-green-500'
                            }`}></span>
                            {transaction.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold text-lg ${transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                            {transaction.type === 'expense' ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                    {transactions.length === 0 && (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                          <CreditCard className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground text-lg font-medium">No transactions yet</p>
                        <p className="text-sm text-muted-foreground mt-1">Add your first transaction to get started!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="budgets" className="space-y-6 mt-8">
              <div className="space-y-6">
                {/* Budget vs Actual Chart */}
                <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Budget vs Actual Spending
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BudgetComparisonChart transactions={transactions} budgets={budgets} />
                  </CardContent>
                </Card>
                
                {/* Budget Manager */}
                <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardContent className="p-6">
                  <BudgetManager transactions={transactions} budgets={budgets} onBudgetUpdate={fetchBudgets} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6 mt-8">
              <SpendingInsights transactions={transactions} budgets={budgets} />
            </TabsContent>

            <TabsContent value="transactions" className="space-y-6 mt-8">
              <TransactionList
                transactions={transactions}
                onEdit={handleEditTransaction}
                onDelete={handleDeleteTransaction}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {showForm && (
        <TransactionForm
          transaction={editingTransaction}
          onSubmit={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  );
};

export default Index;


import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();
const prisma = new PrismaClient();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Get all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: 'desc' }
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Create a transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const { amount, description, category, date, type } = req.body;
    const transaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(amount),
        description,
        category,
        date: new Date(date),
        type
      }
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// Update a transaction
app.put('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description, category, date, type } = req.body;
    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        amount: parseFloat(amount),
        description,
        category,
        date: new Date(date),
        type
      }
    });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

// Delete a transaction
app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.transaction.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

// Get all budgets
app.get('/api/budgets', async (req, res) => {
  try {
    const budgets = await prisma.budget.findMany();
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
});

// Create or update a budget
app.post('/api/budgets', async (req, res) => {
  try {
    const { category, amount, month } = req.body;
    const budget = await prisma.budget.upsert({
      where: {
        category_month: {
          category,
          month
        }
      },
      update: { amount: parseFloat(amount) },
      create: {
        category,
        amount: parseFloat(amount),
        month
      }
    });
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create/update budget' });
  }
});

// Static file serving in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist'); // since it's now copied into Backend

  if (fs.existsSync(distPath)) {
    console.log('Serving frontend from:', distPath);
    app.use(express.static(distPath));

    // Catch-all fallback **without route parsing**
    app.use((req, res, next) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    console.warn('⚠️ Frontend dist folder not found. Skipping static file setup.');
  }
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
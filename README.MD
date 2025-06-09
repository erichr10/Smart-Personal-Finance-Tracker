# 💸 FinSight: Personal Finance Tracker

A full-stack personal finance tracking app designed to help users stay on top of their spending and budgeting — built with **React.js**, **Tailwind CSS**, **shadcn/ui**, **Prisma ORM**, **PostgreSQL**, and **Node js and Express js**.

---

## 🔮 Features

- 💼 **Transaction Management** – add, edit, and delete income/expense transactions with date and description
- 📊 **Visual Insights** – monthly expense bar chart, category-wise pie chart, and budget vs actual comparisons using **Recharts**
- 🧩 **Component Library: shadcn/ui** – consistent UI elements with accessibility baked in
- 🗂️ **Category Tracking** – predefined categories like Groceries, Healthcare, and Travel
- 💰 **Budgeting Tools** – set monthly budgets and receive over-budget alerts
- 🧠 **Spending Insights** – analyze trends, top spending categories, and overall financial health
- 🚀 **Fast & Responsive** – built with **Tailwind CSS** and optimized for all screen sizes
- ⚙️ **PostgreSQL** – reliable data storage with performance optimization
- ✅ **Form Validation** – client-side and backend validation for required fields and input format

---

## 🛠 Tech Stack

| Layer        | Tech Used                                 |
|--------------|-------------------------------------------|
| Frontend     | React.js and Vite, Tailwind CSS, shadcn/ui |
| Charts       | Recharts                                  |
| Backend      | Node.js, Express.js (via API routes)      |
| ORM          | Prisma ORM                                |
| Database     | PostgreSQL (Dockerized)                   |
| Styling      | Tailwind CSS                              |
| Deployment   | Vercel / Netlify / render                        |
| Versioning   | Git & GitHub                              |

---

## 📊 Dashboard & Insights

- **Dashboard Summary**: Total monthly expenses, latest transactions, and a category breakdown
- **Charts**:
  - Bar Chart for monthly expenses
  - Pie Chart for category-wise expenses
  - Budget vs Actual Chart
- **Insights**: Over-budget alerts, top categories, and historical spending trends

---


## ⚙️ Installation

1. **Fork this repository:** 
   Click the Fork button located in the top-right corner of this page.

2. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/Smart-Personal-Finance-Tracker.git
   ```
3. **Create .env file:**
   In root directories create `.env` and set:

   ```bash
   PORT=5000
   DATABASE_URL="<Your PostgreSQL DB URI>"
   ```

4. **Install dependencies:**
   Frontend:
   ```bash
   npm install  
   ```
   Backend:
   ```bash
   npm install     
   npx prisma init
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Start the servers:**
   Frontend:
   ```bash
   npm run dev
   ```
   Backend:
   ```bash
   npm run dev
   ```
   
6. **Access the application:**
   ```bash
   http://localhost:5173/
   ```


## 📧 Contact Information

For questions or inquiries, please contact [Neeraj Gupta](mailto:guptaneeraj2811@gmail.com).
   

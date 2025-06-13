# Smart Personal Finance Tracker 📊💰

Welcome to the **Smart Personal Finance Tracker**! This full-stack application helps you manage your finances effectively. With a focus on spending and budgeting, it empowers you to take control of your financial health.

[![Releases](https://img.shields.io/github/release/erichr10/Smart-Personal-Finance-Tracker.svg)](https://github.com/erichr10/Smart-Personal-Finance-Tracker/releases)

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Getting Started](#getting-started)
4. [Usage](#usage)
5. [Contributing](#contributing)
6. [License](#license)
7. [Contact](#contact)

## Features

- **Track Spending**: Easily log your daily expenses.
- **Budget Management**: Set and monitor budgets for different categories.
- **Data Visualization**: View your financial data through interactive charts.
- **User Authentication**: Secure your data with user accounts.
- **Responsive Design**: Use the app on any device, from desktops to mobile.

## Technologies Used

This project utilizes a variety of technologies to deliver a seamless user experience:

- **Backend**: 
  - [Express.js](https://expressjs.com/) for server-side logic.
  - [Node.js](https://nodejs.org/) as the runtime environment.
  - [PostgreSQL](https://www.postgresql.org/) for database management.
  - [Prisma](https://www.prisma.io/) as the ORM for database interactions.

- **Frontend**:
  - [React.js](https://reactjs.org/) for building user interfaces.
  - [Recharts](https://recharts.org/en-US/) for data visualization.
  - [Tailwind CSS](https://tailwindcss.com/) for styling.
  - [Shadcn UI](https://ui.shadcn.com/) for pre-designed components.
  - [Vite](https://vitejs.dev/) for fast development and build processes.

## Getting Started

To get started with the Smart Personal Finance Tracker, follow these steps:

### Prerequisites

Make sure you have the following installed on your machine:

- Node.js (version 14 or later)
- PostgreSQL (version 12 or later)
- Git

### Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/erichr10/Smart-Personal-Finance-Tracker.git
cd Smart-Personal-Finance-Tracker
```

### Install Dependencies

Next, install the required dependencies for both the frontend and backend:

```bash
# For backend
cd server
npm install

# For frontend
cd ../client
npm install
```

### Set Up the Database

1. Create a PostgreSQL database.
2. Update the database configuration in the `.env` file located in the `server` directory.
3. Run the migration scripts to set up the database schema:

```bash
npx prisma migrate dev --name init
```

### Start the Application

You can now start both the backend and frontend servers:

```bash
# Start backend
cd server
npm start

# Start frontend
cd ../client
npm start
```

The application should now be running on `http://localhost:3000`.

## Usage

Once the application is running, you can create an account or log in. After logging in, you can:

- Add expenses and categorize them.
- Set monthly budgets and track your progress.
- Visualize your spending habits through interactive charts.

Explore the app to discover more features and make the most of your financial data!

## Releases

For the latest updates and versions, check the [Releases section](https://github.com/erichr10/Smart-Personal-Finance-Tracker/releases). Here, you can download the latest version of the application and follow the installation instructions.

## Contributing

We welcome contributions! If you'd like to help improve the Smart Personal Finance Tracker, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.

Please ensure your code adheres to the project's coding standards and includes tests where applicable.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

For any inquiries or feedback, feel free to reach out:

- **Author**: Eric R.
- **Email**: eric@example.com
- **GitHub**: [erichr10](https://github.com/erichr10)

Thank you for checking out the Smart Personal Finance Tracker! We hope it helps you manage your finances more effectively.
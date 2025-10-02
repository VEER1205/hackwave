# PaisaBuddy: Financial Literacy & Stock Trading Simulator

## Team Details
- **Project Lead**: Veer Dodiya
- **Team Members**: Pushpendra Singh Rathod,Falgun Patel,Dhruv Bhadreshwara

## Project Abstract
**PaisaBuddy** is a web-based platform designed to improve financial literacy and provide users with a hands-on experience in stock trading through a real-time simulator. The platform includes various modules such as interactive financial literacy courses, a personalized financial dashboard, and a stock trading game that simulates the Indian market, enabling users to practice risk-free trading.

## Domain and Tools Used

### Domain
- **Financial Literacy**: Provides users with a comprehensive understanding of financial principles and practices.
- **Stock Trading Simulation**: A simulated trading environment for users to practice stock trading in the Indian market.
- **Authentication & Security**: A robust, secure system for user login and data protection.

### Tools and Technologies
This project is built using modern full-stack technologies:

- **Node.js**: The back-end runtime environment used to build the application.
- **Express**: A web application framework for server-side development.
- **EJS (Embedded JavaScript)**: Used for server-side templating to dynamically render HTML pages.
- **MySQL**: Relational database used for storing user data and course information.
- **bcrypt**: A library used for securely hashing user passwords.
- **Passport.js**: Authentication middleware to support social logins like Google, GitHub, and LinkedIn.
- **connect-flash**: Middleware for handling and displaying flash messages to users.

## Features

- **Financial Dashboard**: A personalized dashboard to track financial insights and key metrics.
- **Indian Stock Trading Simulator**: A module that allows users to practice stock trading using real-time data from the Indian stock market, without any risk.
- **Financial Literacy Courses**: Interactive modules designed to educate users on various financial topics, such as investments, budgeting, and saving.
- **Secure User Authentication**: A secure login system with support for traditional email/password login as well as social login options (Google, GitHub, LinkedIn).
- **Password Management**: A password reset functionality to help users recover their accounts securely.
- **Dynamic UI**: Front-end pages built using EJS for dynamic server-side rendering.

## File Structure Overview

- `dashboard.ejs`: The user's main dashboard page.
- `trading.ejs`: The interface for the stock trading simulator.
- `course.ejs`: The template for displaying financial literacy courses.
- `login.ejs`, `forgot.ejs`, `reset-password.ejs`: Pages related to authentication.
- `servers.js`: The main server file that handles all routing and server-side logic.
- `auth.js`: Contains functions for user authentication.
- `schemaa.js`: Defines the structure of the database tables.
- `package.json`: Contains metadata and project dependencies.

## Getting Started

To set up and run the project locally, follow these steps:

### Prerequisites
- Node.js (LTS version recommended)
- MySQL database instance

### Installation

1. Clone the repository or extract the project files.
2. Navigate to the project directory in your terminal.
3. Install the required dependencies by running:

    ```bash
    npm install
    ```

### Database Configuration

1. Set up a MySQL database.
2. Update the database connection details in `servers.js` or `schemaa.js` to match your local setup.

### Running the Application

1. Start the server by running:

    ```bash
    node servers.js
    ```

2. The application will be accessible at `https://paisabuddy-xzcz.onrender.com/` (or the port defined in your `servers.js` file).

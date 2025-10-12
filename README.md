# TradeMaster Pro

A comprehensive trading and investment platform that combines AI-powered insights, virtual trading, educational courses, and real-time market analysis to help users master the art of trading.

## Features

### Authentication System
- User registration and login with multiple OAuth options (Google, GitHub, LinkedIn)
- Secure password authentication
- Modern, split-screen design with glassmorphism effects

### Trading Dashboard
- **Virtual Trading Environment**: Practice trading with ₹10,00,000 virtual balance
- **Real-time Market Data**: Live updates for NIFTY 50, SENSEX, and BANKNIFTY indices
- **Stock Analysis**: Interactive charts with multiple timeframes (1M, 3M, 6M, 1Y, 3Y, Max)
- **Prediction Bar**: AI-powered momentum, trend, and volatility scoring system
- **Watchlist Management**: Create and manage custom watchlists for stocks and mutual funds
- **Portfolio Tracking**: Monitor your investments, profits, and losses in real-time

### AI Assistant
- Trading co-pilot for strategy backtesting
- Technical indicator analysis
- Market news updates
- Smart alerts and recommendations
- Expert recommendations tracker
- Market signal tracking

### Educational Platform
- Interactive trading courses
- Virtual wallet system (1000 tokens)
- Beginner to pro learning path
- Expert-led curriculum

### Daily Quiz
- Finance and trading knowledge tests
- 15-question format with progress tracking
- Multiple-choice questions covering bull markets, trading concepts, and financial terminology

### User Experience
- Personalized dashboard with user greeting
- Financial overview cards (Total Profit, Total Loss, Net Worth)
- Portfolio growth trends
- Investment distribution visualization
- Real-time notifications and market alerts

## Tech Stack

### Frontend
- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with gradients, animations, and responsive design
- **JavaScript** - Interactive features and dynamic content

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **RESTful APIs** - For data exchange

### Database
- **MySQL** - Relational database for user data, transactions, and market information

## Team

### Frontend Development
- **Falgun Patel** - UI/UX Implementation, Trading Interface
- **Heet Chheda** - Authentication System, Dashboard Components

### Backend Development
- **Pushpendra Singh Rathod** - API Development, Database Architecture
- **Shardul Dalvi** - Server Configuration, Authentication Logic
- **Veer Dodiya** - Data Integration, Market APIs

### Documentation & Presentation
- **Aryan Jagadish Keni** - README, PPT, Video Documentation

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/trademaster-pro.git
   cd trademaster-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure database**
   - Create a MySQL database named `trademaster_db`
   - Update database credentials in `config/database.js`
   ```javascript
   module.exports = {
     host: 'localhost',
     user: 'your_username',
     password: 'your_password',
     database: 'trademaster_db'
   };
   ```

4. **Run database migrations**
   ```bash
   npm run migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
trademaster-pro/
├── frontend/
│   ├── assets/
│   │   ├── css/
│   │   ├── js/
│   │   └── images/
│   ├── pages/
│   │   ├── index.html
│   │   ├── login.html
│   │   ├── dashboard.html
│   │   ├── trading.html
│   │   ├── ai-assistant.html
│   │   ├── quiz.html
│   │   └── courses.html
│   └── components/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── config/
├── database/
│   ├── migrations/
│   └── seeds/
├── docs/
│   ├── presentation.pptx
│   └── demo-video.mp4
└── README.md
```

## Key Functionalities

### Virtual Trading System
- Buy and sell stocks with virtual currency
- Real-time profit/loss calculations
- Transaction history tracking
- Portfolio performance analytics

### Market Analysis
- Technical indicators and chart patterns
- Historical data visualization
- Price prediction algorithms
- Momentum and volatility scoring

### Learning Management
- Structured course modules
- Progress tracking
- Token-based reward system
- Quiz assessments

## Future Enhancements

- Mobile application (iOS & Android)
- Social trading features
- Advanced charting tools
- Options and futures trading
- Cryptocurrency integration
- Community forums
- Live webinars and workshops

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact

For questions or support, please contact any team member:
- Falgun Patel - [dodiyaveer12@gmail.com](mailto:dodiyaveer12@gmail.com)
- Project Repository - [GitHub]((https://github.com/VEER1205))

## Acknowledgments

- Market data providers
- Open-source community
- Educational resources and mentors
- All team members for their dedicated efforts

---

**Disclaimer**: This is an educational platform for learning trading concepts. Virtual trading results do not guarantee real-world trading success. Always consult with financial advisors before making investment decisions.

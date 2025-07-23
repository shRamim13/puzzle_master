# Treasure Hunt Game - MERN Stack

A team-based treasure hunt game built with MongoDB, Express.js, React.js, and Node.js.

## Features

- 🎯 **Team-based gameplay** (4-5 members per team)
- 🧩 **5 levels** with 3 difficulty options (easy, medium, hard)
- 📱 **QR code integration** for physical treasure points
- 🏆 **Real-time leaderboard**
- 👥 **Admin panel** for managing puzzles and treasure points
- ⏱️ **Time tracking** and scoring system
- 🎨 **Modern UI** with Ant Design

## Quick Start with Docker

### Prerequisites
- Docker
- Docker Compose

### 1. Clone the repository
```bash
git clone <repository-url>
cd puzzle_master
```

### 2. Run with Docker Compose
```bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

### 3. Access the application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

### 4. Stop the application
```bash
docker-compose down
```

## Manual Setup (Without Docker)

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Environment Variables

Create `.env` file in backend directory:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/treasure_hunt
PORT=5000
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

## Database Setup

Run the sample data script:
```bash
cd backend
node scripts/insertData.js
```

## Sample Login Credentials

### Admin
- Email: `admin@treasurehunt.com`
- Password: `admin123`

### Team Captains
- Email: `team1@treasurehunt.com`
- Password: `team123`
- Email: `team2@treasurehunt.com`
- Password: `team123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new team
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile

### Game
- `POST /api/game/start` - Start new game
- `GET /api/game/current` - Get current game
- `POST /api/game/submit-answer` - Submit puzzle answer
- `GET /api/game/available-difficulties` - Get available difficulties
- `GET /api/game/leaderboard` - Get leaderboard

### Puzzles
- `GET /api/puzzles/random` - Get random puzzle
- `POST /api/puzzles/:id/verify` - Verify answer

### Treasure
- `GET /api/treasure` - Get all treasures
- `POST /api/treasure/verify` - Verify treasure code

## Game Flow

1. **Team Registration**: Team captains register their teams
2. **Game Start**: Teams start the treasure hunt
3. **Puzzle Solving**: Teams solve puzzles of chosen difficulty
4. **Treasure Hints**: After solving, teams get location hints
5. **Physical Hunt**: Teams find physical treasure points
6. **QR Scanning**: Teams scan QR codes for next puzzles
7. **Final Treasure**: Teams claim the final treasure

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: React.js, Ant Design, Axios
- **Authentication**: JWT
- **Database**: MongoDB Atlas
- **Deployment**: Docker, Docker Compose

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 
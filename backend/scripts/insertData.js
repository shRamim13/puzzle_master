const mongoose = require('mongoose');
const User = require('../models/User');
const Puzzle = require('../models/Puzzle');
const Treasure = require('../models/Treasure');
require('dotenv').config();

const samplePuzzles = [
  {
    level: 1,
    difficulty: 'easy',
    questionType: 'riddle',
    question: 'What has keys, but no locks; space, but no room; and you can enter, but not go in?',
    answer: 'keyboard',
    hints: 'Think about computer input device',
    points: 10
  },
  {
    level: 1,
    difficulty: 'easy',
    questionType: 'math',
    question: 'What is 15 + 27?',
    answer: '42',
    hints: 'Simple addition',
    points: 5
  },
  {
    level: 2,
    difficulty: 'medium',
    questionType: 'science',
    question: 'What is the chemical symbol for gold?',
    answer: 'Au',
    hints: 'From Latin word Aurum',
    points: 15
  },
  {
    level: 2,
    difficulty: 'medium',
    questionType: 'riddle',
    question: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?',
    answer: 'echo',
    hints: 'Sound reflection',
    points: 15
  },
  {
    level: 3,
    difficulty: 'hard',
    questionType: 'science',
    question: 'What is the largest planet in our solar system?',
    answer: 'Jupiter',
    hints: 'Gas giant',
    points: 20
  }
];

const sampleTreasures = [
  {
    code: 'TREASURE1',
    level: 1,
    difficulty: 'easy',
    clue: 'Look under the big tree near the entrance',
    location: 'Main Gate Area',
    nextDestination: 'Go to the fountain',
    points: 10,
    isActive: true
  },
  {
    code: 'TREASURE2',
    level: 1,
    difficulty: 'easy',
    clue: 'Check behind the fountain',
    location: 'Central Fountain',
    nextDestination: 'Find the library',
    points: 10,
    isActive: true
  },
  {
    code: 'TREASURE3',
    level: 2,
    difficulty: 'medium',
    clue: 'Search near the library entrance',
    location: 'Library Building',
    nextDestination: 'Head to the garden',
    points: 15,
    isActive: true
  },
  {
    code: 'TREASURE4',
    level: 2,
    difficulty: 'medium',
    clue: 'Look for the hidden spot in the garden',
    location: 'Botanical Garden',
    nextDestination: 'Find the cafeteria',
    points: 15,
    isActive: true
  },
  {
    code: 'TREASURE5',
    level: 3,
    difficulty: 'hard',
    clue: 'Check the cafeteria notice board',
    location: 'Student Cafeteria',
    nextDestination: 'Final destination - Admin Building',
    points: 20,
    isActive: true
  }
];

const sampleUsers = [
  {
    username: 'admin',
    email: 'admin@treasurehunt.com',
    password: 'admin123',
    role: 'admin',
    score: 0
  },
  {
    username: 'team1_captain',
    email: 'team1@treasurehunt.com',
    password: 'team123',
    role: 'captain',
    teamName: 'Team Alpha',
    teamMembers: [
      { name: 'Alice', email: 'alice@team1.com' },
      { name: 'Bob', email: 'bob@team1.com' },
      { name: 'Charlie', email: 'charlie@team1.com' }
    ],
    score: 0
  },
  {
    username: 'team2_captain',
    email: 'team2@treasurehunt.com',
    password: 'team123',
    role: 'captain',
    teamName: 'Team Beta',
    teamMembers: [
      { name: 'David', email: 'david@team2.com' },
      { name: 'Eva', email: 'eva@team2.com' },
      { name: 'Frank', email: 'frank@team2.com' }
    ],
    score: 0
  }
];

async function insertData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Puzzle.deleteMany({});
    await Treasure.deleteMany({});
    console.log('Cleared existing data');

    // Insert users first
    const users = await User.insertMany(sampleUsers);
    console.log(`Inserted ${users.length} users`);

    // Get admin user for createdBy field
    const adminUser = users.find(user => user.role === 'admin');

    // Add createdBy to puzzles
    const puzzlesWithCreator = samplePuzzles.map(puzzle => ({
      ...puzzle,
      createdBy: adminUser._id
    }));

    // Insert puzzles
    const puzzles = await Puzzle.insertMany(puzzlesWithCreator);
    console.log(`Inserted ${puzzles.length} puzzles`);

    // Insert treasures
    const treasures = await Treasure.insertMany(sampleTreasures);
    console.log(`Inserted ${treasures.length} treasures`);

    console.log('✅ All data inserted successfully!');
    console.log('\n📋 Sample Login Credentials:');
    console.log('Admin: admin@treasurehunt.com / admin123');
    console.log('Team 1: team1@treasurehunt.com / team123');
    console.log('Team 2: team2@treasurehunt.com / team123');

  } catch (error) {
    console.error('Error inserting data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

insertData(); 
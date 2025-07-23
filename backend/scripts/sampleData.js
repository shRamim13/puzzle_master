const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Puzzle = require('../models/Puzzle');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for sample data');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

const createSampleData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Puzzle.deleteMany({});
    console.log('Cleared existing data');

    // Create Admin
    const admin = new User({
      username: 'admin',
      email: 'admin@treasurehunt.com',
      password: 'admin123',
      role: 'admin'
    });
    await admin.save();
    console.log('✅ Admin created: admin@treasurehunt.com / admin123');

    // Create Team Captains
    const teams = [
      {
        username: 'team1_captain',
        email: 'team1@treasurehunt.com',
        password: 'team123',
        teamName: 'Dragon Hunters',
        teamMembers: [
          { name: 'Alice', email: 'alice@team1.com' },
          { name: 'Bob', email: 'bob@team1.com' },
          { name: 'Charlie', email: 'charlie@team1.com' },
          { name: 'Diana', email: 'diana@team1.com' }
        ]
      },
      {
        username: 'team2_captain',
        email: 'team2@treasurehunt.com',
        password: 'team123',
        teamName: 'Puzzle Masters',
        teamMembers: [
          { name: 'Eve', email: 'eve@team2.com' },
          { name: 'Frank', email: 'frank@team2.com' },
          { name: 'Grace', email: 'grace@team2.com' },
          { name: 'Henry', email: 'henry@team2.com' }
        ]
      },
      {
        username: 'team3_captain',
        email: 'team3@treasurehunt.com',
        password: 'team123',
        teamName: 'Treasure Seekers',
        teamMembers: [
          { name: 'Ivy', email: 'ivy@team3.com' },
          { name: 'Jack', email: 'jack@team3.com' },
          { name: 'Kate', email: 'kate@team3.com' },
          { name: 'Leo', email: 'leo@team3.com' }
        ]
      }
    ];

    for (const team of teams) {
      const captain = new User({
        username: team.username,
        email: team.email,
        password: team.password,
        role: 'captain',
        teamName: team.teamName,
        teamMembers: team.teamMembers
      });
      await captain.save();
      console.log(`✅ Team created: ${team.email} / ${team.password}`);
    }

    // Create Sample Puzzles
    const puzzles = [
      // Level 1 - Easy
      {
        level: 1,
        difficulty: 'easy',
        question: 'What has keys, but no locks; space, but no room; and you can enter, but not go in?',
        answer: 'keyboard',
        questionType: 'riddle',
        points: 10,
        hints: ['Think about computer input', 'You type on it']
      },
      {
        level: 1,
        difficulty: 'easy',
        question: 'What is 2 + 2?',
        answer: '4',
        questionType: 'math',
        points: 10,
        hints: ['Basic addition']
      },
      {
        level: 1,
        difficulty: 'easy',
        question: 'What is the capital of Bangladesh?',
        answer: 'dhaka',
        questionType: 'question',
        points: 10,
        hints: ['Largest city in Bangladesh']
      },

      // Level 1 - Medium
      {
        level: 1,
        difficulty: 'medium',
        question: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?',
        answer: 'echo',
        questionType: 'riddle',
        points: 20,
        hints: ['Sound related', 'Bounces back']
      },
      {
        level: 1,
        difficulty: 'medium',
        question: 'What is 15 x 7?',
        answer: '105',
        questionType: 'math',
        points: 20,
        hints: ['Multiplication']
      },
      {
        level: 1,
        difficulty: 'medium',
        question: 'What does HTML stand for?',
        answer: 'hypertext markup language',
        questionType: 'internet',
        points: 20,
        hints: ['Web development language']
      },

      // Level 1 - Hard
      {
        level: 1,
        difficulty: 'hard',
        question: 'The more you take, the more you leave behind. What am I?',
        answer: 'footsteps',
        questionType: 'riddle',
        points: 30,
        hints: ['Walking related', 'You leave them behind']
      },
      {
        level: 1,
        difficulty: 'hard',
        question: 'What is the square root of 144?',
        answer: '12',
        questionType: 'math',
        points: 30,
        hints: ['12 x 12 = 144']
      },
      {
        level: 1,
        difficulty: 'hard',
        question: 'What does API stand for in programming?',
        answer: 'application programming interface',
        questionType: 'internet',
        points: 30,
        hints: ['Programming interface']
      },

      // Level 2 - Easy
      {
        level: 2,
        difficulty: 'easy',
        question: 'What has a head and a tail but no body?',
        answer: 'coin',
        questionType: 'riddle',
        points: 10,
        hints: ['Money related', 'You flip it']
      },
      {
        level: 2,
        difficulty: 'easy',
        question: 'What is 5 x 8?',
        answer: '40',
        questionType: 'math',
        points: 10,
        hints: ['Multiplication']
      },
      {
        level: 2,
        difficulty: 'easy',
        question: 'What is the largest planet in our solar system?',
        answer: 'jupiter',
        questionType: 'science',
        points: 10,
        hints: ['Gas giant']
      },

      // Level 2 - Medium
      {
        level: 2,
        difficulty: 'medium',
        question: 'What gets wetter and wetter the more it dries?',
        answer: 'towel',
        questionType: 'riddle',
        points: 20,
        hints: ['Bathroom item', 'Used for drying']
      },
      {
        level: 2,
        difficulty: 'medium',
        question: 'What is 25% of 80?',
        answer: '20',
        questionType: 'math',
        points: 20,
        hints: ['Percentage calculation']
      },
      {
        level: 2,
        difficulty: 'medium',
        question: 'What does CSS stand for?',
        answer: 'cascading style sheets',
        questionType: 'internet',
        points: 20,
        hints: ['Web styling language']
      },

      // Level 2 - Hard
      {
        level: 2,
        difficulty: 'hard',
        question: 'What has cities, but no houses; forests, but no trees; and rivers, but no water?',
        answer: 'map',
        questionType: 'riddle',
        points: 30,
        hints: ['Shows locations', 'Paper or digital']
      },
      {
        level: 2,
        difficulty: 'hard',
        question: 'What is 3 to the power of 4?',
        answer: '81',
        questionType: 'math',
        points: 30,
        hints: ['3 x 3 x 3 x 3']
      },
      {
        level: 2,
        difficulty: 'hard',
        question: 'What is the chemical symbol for gold?',
        answer: 'au',
        questionType: 'science',
        points: 30,
        hints: ['Periodic table element']
      },

      // Level 3 - Easy
      {
        level: 3,
        difficulty: 'easy',
        question: 'What has keys that open no door, space but no room, and you can enter but not go in?',
        answer: 'keyboard',
        questionType: 'riddle',
        points: 10,
        hints: ['Computer input device']
      },
      {
        level: 3,
        difficulty: 'easy',
        question: 'What is 12 + 15?',
        answer: '27',
        questionType: 'math',
        points: 10,
        hints: ['Simple addition']
      },
      {
        level: 3,
        difficulty: 'easy',
        question: 'What is the main component of the sun?',
        answer: 'hydrogen',
        questionType: 'science',
        points: 10,
        hints: ['Lightest element']
      },

      // Level 3 - Medium
      {
        level: 3,
        difficulty: 'medium',
        question: 'What comes once in a minute, twice in a moment, but never in a thousand years?',
        answer: 'm',
        questionType: 'riddle',
        points: 20,
        hints: ['Letter in the alphabet']
      },
      {
        level: 3,
        difficulty: 'medium',
        question: 'What is 60% of 50?',
        answer: '30',
        questionType: 'math',
        points: 20,
        hints: ['Percentage calculation']
      },
      {
        level: 3,
        difficulty: 'medium',
        question: 'What does URL stand for?',
        answer: 'uniform resource locator',
        questionType: 'internet',
        points: 20,
        hints: ['Web address']
      },

      // Level 3 - Hard
      {
        level: 3,
        difficulty: 'hard',
        question: 'What breaks when you say it?',
        answer: 'silence',
        questionType: 'riddle',
        points: 30,
        hints: ['Opposite of sound']
      },
      {
        level: 3,
        difficulty: 'hard',
        question: 'What is the square of 13?',
        answer: '169',
        questionType: 'math',
        points: 30,
        hints: ['13 x 13']
      },
      {
        level: 3,
        difficulty: 'hard',
        question: 'What is the atomic number of carbon?',
        answer: '6',
        questionType: 'science',
        points: 30,
        hints: ['Periodic table element']
      },

      // Level 4 - Easy
      {
        level: 4,
        difficulty: 'easy',
        question: 'What has legs, but doesn\'t walk?',
        answer: 'table',
        questionType: 'riddle',
        points: 10,
        hints: ['Furniture item']
      },
      {
        level: 4,
        difficulty: 'easy',
        question: 'What is 8 x 9?',
        answer: '72',
        questionType: 'math',
        points: 10,
        hints: ['Multiplication']
      },
      {
        level: 4,
        difficulty: 'easy',
        question: 'What is the closest planet to Earth?',
        answer: 'venus',
        questionType: 'science',
        points: 10,
        hints: ['Morning star']
      },

      // Level 4 - Medium
      {
        level: 4,
        difficulty: 'medium',
        question: 'What has many keys, but no locks; space, but no room; and you can enter, but not go in?',
        answer: 'keyboard',
        questionType: 'riddle',
        points: 20,
        hints: ['Computer input']
      },
      {
        level: 4,
        difficulty: 'medium',
        question: 'What is 75% of 100?',
        answer: '75',
        questionType: 'math',
        points: 20,
        hints: ['Percentage']
      },
      {
        level: 4,
        difficulty: 'medium',
        question: 'What does HTTP stand for?',
        answer: 'hypertext transfer protocol',
        questionType: 'internet',
        points: 20,
        hints: ['Web protocol']
      },

      // Level 4 - Hard
      {
        level: 4,
        difficulty: 'hard',
        question: 'What is always in front of you but can\'t be seen?',
        answer: 'future',
        questionType: 'riddle',
        points: 30,
        hints: ['Time related']
      },
      {
        level: 4,
        difficulty: 'hard',
        question: 'What is 4 to the power of 3?',
        answer: '64',
        questionType: 'math',
        points: 30,
        hints: ['4 x 4 x 4']
      },
      {
        level: 4,
        difficulty: 'hard',
        question: 'What is the chemical symbol for silver?',
        answer: 'ag',
        questionType: 'science',
        points: 30,
        hints: ['Periodic table']
      },

      // Level 5 - Easy
      {
        level: 5,
        difficulty: 'easy',
        question: 'What has a face and two hands but no arms or legs?',
        answer: 'clock',
        questionType: 'riddle',
        points: 10,
        hints: ['Time telling device']
      },
      {
        level: 5,
        difficulty: 'easy',
        question: 'What is 20 + 25?',
        answer: '45',
        questionType: 'math',
        points: 10,
        hints: ['Addition']
      },
      {
        level: 5,
        difficulty: 'easy',
        question: 'What is the hardest natural substance on Earth?',
        answer: 'diamond',
        questionType: 'science',
        points: 10,
        hints: ['Precious stone']
      },

      // Level 5 - Medium
      {
        level: 5,
        difficulty: 'medium',
        question: 'What can travel around the world while staying in a corner?',
        answer: 'stamp',
        questionType: 'riddle',
        points: 20,
        hints: ['Postal item']
      },
      {
        level: 5,
        difficulty: 'medium',
        question: 'What is 50% of 120?',
        answer: '60',
        questionType: 'math',
        points: 20,
        hints: ['Half of 120']
      },
      {
        level: 5,
        difficulty: 'medium',
        question: 'What does DNS stand for?',
        answer: 'domain name system',
        questionType: 'internet',
        points: 20,
        hints: ['Internet naming system']
      },

      // Level 5 - Hard
      {
        level: 5,
        difficulty: 'hard',
        question: 'What is so fragile that saying its name breaks it?',
        answer: 'silence',
        questionType: 'riddle',
        points: 30,
        hints: ['Opposite of noise']
      },
      {
        level: 5,
        difficulty: 'hard',
        question: 'What is the square root of 225?',
        answer: '15',
        questionType: 'math',
        points: 30,
        hints: ['15 x 15 = 225']
      },
      {
        level: 5,
        difficulty: 'hard',
        question: 'What is the atomic number of oxygen?',
        answer: '8',
        questionType: 'science',
        points: 30,
        hints: ['Essential for breathing']
      }
    ];

    for (const puzzle of puzzles) {
      const newPuzzle = new Puzzle({
        ...puzzle,
        createdBy: admin._id
      });
      await newPuzzle.save();
    }

    console.log(`✅ Created ${puzzles.length} puzzles`);
    console.log('\n🎉 Sample data created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@treasurehunt.com / admin123');
    console.log('Team 1: team1@treasurehunt.com / team123');
    console.log('Team 2: team2@treasurehunt.com / team123');
    console.log('Team 3: team3@treasurehunt.com / team123');

  } catch (error) {
    console.error('Error creating sample data:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
connectDB().then(() => {
  createSampleData();
}); 
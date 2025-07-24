const mongoose = require('mongoose');
const User = require('../models/User');
const Puzzle = require('../models/Puzzle');
const Treasure = require('../models/Treasure');
const QRCode = require('../models/QRCode');
require('dotenv').config();

const createSampleData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Puzzle.deleteMany({});
    await Treasure.deleteMany({});
    await QRCode.deleteMany({});

    // Create Admin User
    const admin = new User({
      username: 'admin',
      email: 'admin@treasurehunt.com',
      password: 'admin123',
      role: 'admin'
    });
    await admin.save();
    console.log('✅ Admin created: admin@treasurehunt.com / admin123');

    // Create Sample Teams
    const teams = [
      {
        username: 'team1',
        email: 'team1@treasurehunt.com',
        password: 'team123',
        teamName: 'Adventure Seekers',
        teamMembers: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson']
      },
      {
        username: 'team2',
        email: 'team2@treasurehunt.com',
        password: 'team123',
        teamName: 'Treasure Hunters',
        teamMembers: ['Alex Brown', 'Emma Davis', 'Chris Lee', 'Lisa Garcia']
      },
      {
        username: 'team3',
        email: 'team3@treasurehunt.com',
        password: 'team123',
        teamName: 'Explorer Squad',
        teamMembers: ['David Miller', 'Anna Taylor', 'Tom Wilson', 'Kate Anderson']
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
      // Level 1
      {
        level: 1,
        question: 'What has keys, but no locks; space, but no room; and you can enter, but not go in?',
        answer: 'keyboard',
        questionType: 'riddle',
        points: 10,
        hints: ['Think about computer input', 'You type on it'],
        createdBy: admin._id
      },
      {
        level: 1,
        question: 'What is 2 + 2?',
        answer: '4',
        questionType: 'math',
        points: 10,
        hints: ['Basic addition'],
        createdBy: admin._id
      },
      {
        level: 1,
        question: 'What is the capital of Bangladesh?',
        answer: 'dhaka',
        questionType: 'question',
        points: 10,
        hints: ['Largest city in Bangladesh'],
        createdBy: admin._id
      },

      // Level 2
      {
        level: 2,
        question: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?',
        answer: 'echo',
        questionType: 'riddle',
        points: 15,
        hints: ['Sound related', 'Bounces back'],
        createdBy: admin._id
      },
      {
        level: 2,
        question: 'What is 15 x 7?',
        answer: '105',
        questionType: 'math',
        points: 15,
        hints: ['Multiplication'],
        createdBy: admin._id
      },
      {
        level: 2,
        question: 'What does HTML stand for?',
        answer: 'hypertext markup language',
        questionType: 'internet',
        points: 15,
        hints: ['Web development language'],
        createdBy: admin._id
      },

      // Level 3
      {
        level: 3,
        question: 'The more you take, the more you leave behind. What am I?',
        answer: 'footsteps',
        questionType: 'riddle',
        points: 20,
        hints: ['Walking related', 'You leave them behind'],
        createdBy: admin._id
      },
      {
        level: 3,
        question: 'What is the square root of 144?',
        answer: '12',
        questionType: 'math',
        points: 20,
        hints: ['12 x 12 = 144'],
        createdBy: admin._id
      },
      {
        level: 3,
        question: 'What does API stand for in programming?',
        answer: 'application programming interface',
        questionType: 'internet',
        points: 20,
        hints: ['Programming interface'],
        createdBy: admin._id
      },

      // Level 4
      {
        level: 4,
        question: 'What has a head and a tail but no body?',
        answer: 'coin',
        questionType: 'riddle',
        points: 25,
        hints: ['Money related', 'You flip it'],
        createdBy: admin._id
      },
      {
        level: 4,
        question: 'What is 5 x 8?',
        answer: '40',
        questionType: 'math',
        points: 25,
        hints: ['Multiplication'],
        createdBy: admin._id
      },
      {
        level: 4,
        question: 'What is the largest planet in our solar system?',
        answer: 'jupiter',
        questionType: 'science',
        points: 25,
        hints: ['Gas giant'],
        createdBy: admin._id
      },

      // Level 5
      {
        level: 5,
        question: 'What is always in front of you but can\'t be seen?',
        answer: 'future',
        questionType: 'riddle',
        points: 30,
        hints: ['Time-related'],
        createdBy: admin._id
      },
      {
        level: 5,
        question: 'What is the chemical symbol for gold?',
        answer: 'Au',
        questionType: 'science',
        points: 30,
        hints: ['From Latin word Aurum'],
        createdBy: admin._id
      },
      {
        level: 5,
        question: 'What is the speed of light in meters per second?',
        answer: '300000000',
        questionType: 'science',
        points: 30,
        hints: ['Very fast speed'],
        createdBy: admin._id
      }
    ];

    const savedPuzzles = await Puzzle.insertMany(puzzles);
    console.log(`✅ Created ${savedPuzzles.length} puzzles`);

    // Create Sample Treasures
    const treasures = [
      {
        code: 'TREASURE001',
        level: 1,
        clue: 'Look for the ancient tree near the fountain',
        location: 'Central Park Fountain',
        nextDestination: 'Library Entrance'
      },
      {
        code: 'TREASURE002',
        level: 2,
        clue: 'Find the hidden door behind the bookshelf',
        location: 'Library Entrance',
        nextDestination: 'Cafeteria'
      },
      {
        code: 'TREASURE003',
        level: 3,
        clue: 'Check under the third table from the window',
        location: 'Cafeteria',
        nextDestination: 'Gymnasium'
      },
      {
        code: 'TREASURE004',
        level: 4,
        clue: 'Look for the golden key in the equipment room',
        location: 'Gymnasium',
        nextDestination: 'Auditorium'
      },
      {
        code: 'TREASURE005',
        level: 5,
        clue: 'The final treasure awaits in the spotlight',
        location: 'Auditorium',
        nextDestination: 'Game Complete!'
      }
    ];

    const savedTreasures = await Treasure.insertMany(treasures);
    console.log(`✅ Created ${savedTreasures.length} treasures`);

    // Create Sample QR Codes
    const qrCodes = [
      {
        code: 'QR001',
        level: 1,
        puzzleId: savedPuzzles[0]._id,
        clue: 'Scan this QR code to get your first puzzle',
        location: 'Main Entrance',
        redirectUrl: '/game'
      },
      {
        code: 'QR002',
        level: 2,
        puzzleId: savedPuzzles[3]._id,
        clue: 'Find the QR code near the fountain',
        location: 'Central Park Fountain',
        redirectUrl: '/game'
      },
      {
        code: 'QR003',
        level: 3,
        puzzleId: savedPuzzles[6]._id,
        clue: 'Look for the QR code in the library',
        location: 'Library Entrance',
        redirectUrl: '/game'
      },
      {
        code: 'QR004',
        level: 4,
        puzzleId: savedPuzzles[9]._id,
        clue: 'Check the cafeteria for the QR code',
        location: 'Cafeteria',
        redirectUrl: '/game'
      },
      {
        code: 'QR005',
        level: 5,
        puzzleId: savedPuzzles[12]._id,
        clue: 'Final QR code in the gymnasium',
        location: 'Gymnasium',
        redirectUrl: '/game'
      }
    ];

    const savedQRCodes = await QRCode.insertMany(qrCodes);
    console.log(`✅ Created ${savedQRCodes.length} QR codes`);

    console.log('\n🎉 Sample data created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@treasurehunt.com / admin123');
    console.log('Teams: team1@treasurehunt.com / team123');
    console.log('       team2@treasurehunt.com / team123');
    console.log('       team3@treasurehunt.com / team123');

  } catch (error) {
    console.error('Error creating sample data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

createSampleData(); 
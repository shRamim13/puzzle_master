const mongoose = require('mongoose');
const Puzzle = require('../models/Puzzle');
const User = require('../models/User');
require('dotenv').config();

const additionalPuzzles = [
  // Level 1 - Easy (already have 2)
  {
    level: 1,
    difficulty: 'easy',
    questionType: 'riddle',
    question: 'What gets wetter and wetter the more it dries?',
    answer: 'towel',
    hints: 'Think about bathroom item',
    points: 10
  },
  {
    level: 1,
    difficulty: 'easy',
    questionType: 'math',
    question: 'What is 8 x 6?',
    answer: '48',
    hints: 'Simple multiplication',
    points: 10
  },
  
  // Level 1 - Medium
  {
    level: 1,
    difficulty: 'medium',
    questionType: 'science',
    question: 'What is the chemical symbol for water?',
    answer: 'H2O',
    hints: 'Two elements combined',
    points: 15
  },
  {
    level: 1,
    difficulty: 'medium',
    questionType: 'riddle',
    question: 'What has cities, but no houses; forests, but no trees; and rivers, but no water?',
    answer: 'map',
    hints: 'Used for navigation',
    points: 15
  },
  
  // Level 1 - Hard
  {
    level: 1,
    difficulty: 'hard',
    questionType: 'science',
    question: 'What is the atomic number of carbon?',
    answer: '6',
    hints: 'Periodic table element',
    points: 20
  },
  {
    level: 1,
    difficulty: 'hard',
    questionType: 'riddle',
    question: 'The more you take, the more you leave behind. What am I?',
    answer: 'footsteps',
    hints: 'Think about walking',
    points: 20
  },
  
  // Level 2 - Easy
  {
    level: 2,
    difficulty: 'easy',
    questionType: 'math',
    question: 'What is 25 + 17?',
    answer: '42',
    hints: 'Simple addition',
    points: 10
  },
  {
    level: 2,
    difficulty: 'easy',
    questionType: 'riddle',
    question: 'What has a head and a tail but no body?',
    answer: 'coin',
    hints: 'Used for money',
    points: 10
  },
  
  // Level 2 - Medium (already have 2)
  {
    level: 2,
    difficulty: 'medium',
    questionType: 'science',
    question: 'What is the largest organ in the human body?',
    answer: 'skin',
    hints: 'Covers your body',
    points: 15
  },
  
  // Level 2 - Hard
  {
    level: 2,
    difficulty: 'hard',
    questionType: 'science',
    question: 'What is the speed of light in meters per second?',
    answer: '300000000',
    hints: 'Very fast speed',
    points: 20
  },
  {
    level: 2,
    difficulty: 'hard',
    questionType: 'riddle',
    question: 'What comes once in a minute, twice in a moment, but never in a thousand years?',
    answer: 'm',
    hints: 'Think about letters in words',
    points: 20
  },
  
  // Level 3 - Easy
  {
    level: 3,
    difficulty: 'easy',
    questionType: 'math',
    question: 'What is 12 x 8?',
    answer: '96',
    hints: 'Simple multiplication',
    points: 10
  },
  {
    level: 3,
    difficulty: 'easy',
    questionType: 'riddle',
    question: 'What has keys that open no door, space but no room, and you can enter but not go in?',
    answer: 'keyboard',
    hints: 'Computer input device',
    points: 10
  },
  
  // Level 3 - Medium
  {
    level: 3,
    difficulty: 'medium',
    questionType: 'science',
    question: 'What is the chemical symbol for iron?',
    answer: 'Fe',
    hints: 'From Latin word Ferrum',
    points: 15
  },
  {
    level: 3,
    difficulty: 'medium',
    questionType: 'riddle',
    question: 'What has legs, but doesn\'t walk?',
    answer: 'table',
    hints: 'Furniture item',
    points: 15
  },
  
  // Level 3 - Hard (already have 1)
  {
    level: 3,
    difficulty: 'hard',
    questionType: 'science',
    question: 'What is the molecular formula for glucose?',
    answer: 'C6H12O6',
    hints: 'Sugar molecule',
    points: 20
  },
  
  // Level 4 - Easy
  {
    level: 4,
    difficulty: 'easy',
    questionType: 'math',
    question: 'What is 15 x 7?',
    answer: '105',
    hints: 'Simple multiplication',
    points: 10
  },
  {
    level: 4,
    difficulty: 'easy',
    questionType: 'riddle',
    question: 'What has a face and two hands but no arms or legs?',
    answer: 'clock',
    hints: 'Tells time',
    points: 10
  },
  
  // Level 4 - Medium
  {
    level: 4,
    difficulty: 'medium',
    questionType: 'science',
    question: 'What is the chemical symbol for silver?',
    answer: 'Ag',
    hints: 'From Latin word Argentum',
    points: 15
  },
  {
    level: 4,
    difficulty: 'medium',
    questionType: 'riddle',
    question: 'What gets bigger when you take away from it?',
    answer: 'hole',
    hints: 'Empty space',
    points: 15
  },
  
  // Level 4 - Hard
  {
    level: 4,
    difficulty: 'hard',
    questionType: 'science',
    question: 'What is the atomic number of oxygen?',
    answer: '8',
    hints: 'Essential for breathing',
    points: 20
  },
  {
    level: 4,
    difficulty: 'hard',
    questionType: 'riddle',
    question: 'What has keys, no locks; space, no room; and you can enter, but not go in?',
    answer: 'keyboard',
    hints: 'Computer input device',
    points: 20
  },
  
  // Level 5 - Easy
  {
    level: 5,
    difficulty: 'easy',
    questionType: 'math',
    question: 'What is 18 x 9?',
    answer: '162',
    hints: 'Simple multiplication',
    points: 10
  },
  {
    level: 5,
    difficulty: 'easy',
    questionType: 'riddle',
    question: 'What has a thumb and four fingers but is not alive?',
    answer: 'glove',
    hints: 'Worn on hands',
    points: 10
  },
  
  // Level 5 - Medium
  {
    level: 5,
    difficulty: 'medium',
    questionType: 'science',
    question: 'What is the chemical symbol for copper?',
    answer: 'Cu',
    hints: 'From Latin word Cuprum',
    points: 15
  },
  {
    level: 5,
    difficulty: 'medium',
    questionType: 'riddle',
    question: 'What has many keys but no locks, space but no room, and you can enter but not go in?',
    answer: 'keyboard',
    hints: 'Computer input device',
    points: 15
  },
  
  // Level 5 - Hard
  {
    level: 5,
    difficulty: 'hard',
    questionType: 'science',
    question: 'What is the molecular formula for carbon dioxide?',
    answer: 'CO2',
    hints: 'Greenhouse gas',
    points: 20
  },
  {
    level: 5,
    difficulty: 'hard',
    questionType: 'riddle',
    question: 'What is always in front of you but can\'t be seen?',
    answer: 'future',
    hints: 'Time-related',
    points: 20
  }
];

async function addMorePuzzles() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get admin user for createdBy field
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.error('Admin user not found');
      return;
    }

    // Add createdBy to puzzles
    const puzzlesWithCreator = additionalPuzzles.map(puzzle => ({
      ...puzzle,
      createdBy: adminUser._id
    }));

    // Insert puzzles
    const puzzles = await Puzzle.insertMany(puzzlesWithCreator);
    console.log(`✅ Added ${puzzles.length} new puzzles`);

    // Show summary
    const allPuzzles = await Puzzle.find({});
    console.log('\n📊 Puzzle Summary:');
    for (let level = 1; level <= 5; level++) {
      for (const difficulty of ['easy', 'medium', 'hard']) {
        const count = allPuzzles.filter(p => p.level === level && p.difficulty === difficulty).length;
        console.log(`Level ${level} ${difficulty}: ${count} puzzles`);
      }
    }

  } catch (error) {
    console.error('Error adding puzzles:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

addMorePuzzles(); 
const mongoose = require('mongoose');
const Treasure = require('../models/Treasure');
require('dotenv').config();

const additionalTreasures = [
  // Level 1 - Easy (already have 2)
  {
    code: 'TREASURE1_EASY2',
    level: 1,
    difficulty: 'easy',
    clue: 'Look under the bench near the entrance',
    location: 'Main Gate Bench',
    nextDestination: 'Go to the fountain area',
    points: 10,
    isActive: true
  },
  
  // Level 1 - Medium
  {
    code: 'TREASURE1_MEDIUM1',
    level: 1,
    difficulty: 'medium',
    clue: 'Check the notice board near the fountain',
    location: 'Fountain Notice Board',
    nextDestination: 'Find the library building',
    points: 15,
    isActive: true
  },
  {
    code: 'TREASURE1_MEDIUM2',
    level: 1,
    difficulty: 'medium',
    clue: 'Look behind the statue in the garden',
    location: 'Garden Statue',
    nextDestination: 'Head to the library',
    points: 15,
    isActive: true
  },
  
  // Level 1 - Hard
  {
    code: 'TREASURE1_HARD1',
    level: 1,
    difficulty: 'hard',
    clue: 'Search near the old oak tree',
    location: 'Old Oak Tree',
    nextDestination: 'Find the library entrance',
    points: 20,
    isActive: true
  },
  {
    code: 'TREASURE1_HARD2',
    level: 1,
    difficulty: 'hard',
    clue: 'Check the hidden compartment in the wall',
    location: 'Hidden Wall Compartment',
    nextDestination: 'Go to the library',
    points: 20,
    isActive: true
  },
  
  // Level 2 - Easy
  {
    code: 'TREASURE2_EASY1',
    level: 2,
    difficulty: 'easy',
    clue: 'Look under the welcome mat',
    location: 'Library Welcome Mat',
    nextDestination: 'Find the reading room',
    points: 10,
    isActive: true
  },
  {
    code: 'TREASURE2_EASY2',
    level: 2,
    difficulty: 'easy',
    clue: 'Check the book return slot',
    location: 'Book Return Slot',
    nextDestination: 'Head to the reading area',
    points: 10,
    isActive: true
  },
  
  // Level 2 - Medium (already have 2)
  {
    code: 'TREASURE2_MEDIUM3',
    level: 2,
    difficulty: 'medium',
    clue: 'Search the reference section',
    location: 'Reference Section',
    nextDestination: 'Find the garden area',
    points: 15,
    isActive: true
  },
  
  // Level 2 - Hard
  {
    code: 'TREASURE2_HARD1',
    level: 2,
    difficulty: 'hard',
    clue: 'Look in the rare books section',
    location: 'Rare Books Section',
    nextDestination: 'Go to the botanical garden',
    points: 20,
    isActive: true
  },
  {
    code: 'TREASURE2_HARD2',
    level: 2,
    difficulty: 'hard',
    clue: 'Check the librarian\'s desk',
    location: 'Librarian\'s Desk',
    nextDestination: 'Find the garden entrance',
    points: 20,
    isActive: true
  },
  
  // Level 3 - Easy
  {
    code: 'TREASURE3_EASY1',
    level: 3,
    difficulty: 'easy',
    clue: 'Look under the garden bench',
    location: 'Garden Bench',
    nextDestination: 'Find the cafeteria',
    points: 10,
    isActive: true
  },
  {
    code: 'TREASURE3_EASY2',
    level: 3,
    difficulty: 'easy',
    clue: 'Check the flower pot near the entrance',
    location: 'Garden Flower Pot',
    nextDestination: 'Head to the student cafeteria',
    points: 10,
    isActive: true
  },
  
  // Level 3 - Medium
  {
    code: 'TREASURE3_MEDIUM1',
    level: 3,
    difficulty: 'medium',
    clue: 'Search near the fountain in the garden',
    location: 'Garden Fountain',
    nextDestination: 'Find the cafeteria building',
    points: 15,
    isActive: true
  },
  {
    code: 'TREASURE3_MEDIUM2',
    level: 3,
    difficulty: 'medium',
    clue: 'Look behind the garden shed',
    location: 'Garden Shed',
    nextDestination: 'Go to the cafeteria',
    points: 15,
    isActive: true
  },
  
  // Level 3 - Hard (already have 1)
  {
    code: 'TREASURE3_HARD2',
    level: 3,
    difficulty: 'hard',
    clue: 'Check the hidden path in the garden',
    location: 'Hidden Garden Path',
    nextDestination: 'Find the cafeteria entrance',
    points: 20,
    isActive: true
  },
  
  // Level 4 - Easy
  {
    code: 'TREASURE4_EASY1',
    level: 4,
    difficulty: 'easy',
    clue: 'Look under the cafeteria table',
    location: 'Cafeteria Table',
    nextDestination: 'Find the admin building',
    points: 10,
    isActive: true
  },
  {
    code: 'TREASURE4_EASY2',
    level: 4,
    difficulty: 'easy',
    clue: 'Check the vending machine',
    location: 'Cafeteria Vending Machine',
    nextDestination: 'Head to the admin building',
    points: 10,
    isActive: true
  },
  
  // Level 4 - Medium
  {
    code: 'TREASURE4_MEDIUM1',
    level: 4,
    difficulty: 'medium',
    clue: 'Search the cafeteria kitchen',
    location: 'Cafeteria Kitchen',
    nextDestination: 'Find the admin building entrance',
    points: 15,
    isActive: true
  },
  {
    code: 'TREASURE4_MEDIUM2',
    level: 4,
    difficulty: 'medium',
    clue: 'Look behind the cafeteria counter',
    location: 'Cafeteria Counter',
    nextDestination: 'Go to the admin building',
    points: 15,
    isActive: true
  },
  
  // Level 4 - Hard
  {
    code: 'TREASURE4_HARD1',
    level: 4,
    difficulty: 'hard',
    clue: 'Check the cafeteria storage room',
    location: 'Cafeteria Storage Room',
    nextDestination: 'Find the admin building lobby',
    points: 20,
    isActive: true
  },
  {
    code: 'TREASURE4_HARD2',
    level: 4,
    difficulty: 'hard',
    clue: 'Look in the cafeteria office',
    location: 'Cafeteria Office',
    nextDestination: 'Head to the admin building',
    points: 20,
    isActive: true
  },
  
  // Level 5 - Easy
  {
    code: 'TREASURE5_EASY1',
    level: 5,
    difficulty: 'easy',
    clue: 'Look under the admin desk',
    location: 'Admin Desk',
    nextDestination: 'Find the final treasure room',
    points: 10,
    isActive: true
  },
  {
    code: 'TREASURE5_EASY2',
    level: 5,
    difficulty: 'easy',
    clue: 'Check the admin building lobby',
    location: 'Admin Building Lobby',
    nextDestination: 'Go to the treasure room',
    points: 10,
    isActive: true
  },
  
  // Level 5 - Medium
  {
    code: 'TREASURE5_MEDIUM1',
    level: 5,
    difficulty: 'medium',
    clue: 'Search the admin conference room',
    location: 'Admin Conference Room',
    nextDestination: 'Find the final treasure location',
    points: 15,
    isActive: true
  },
  {
    code: 'TREASURE5_MEDIUM2',
    level: 5,
    difficulty: 'medium',
    clue: 'Look in the admin building hallway',
    location: 'Admin Building Hallway',
    nextDestination: 'Head to the treasure room',
    points: 15,
    isActive: true
  },
  
  // Level 5 - Hard
  {
    code: 'TREASURE5_HARD1',
    level: 5,
    difficulty: 'hard',
    clue: 'Check the admin building basement',
    location: 'Admin Building Basement',
    nextDestination: 'Find the final treasure',
    points: 20,
    isActive: true
  },
  {
    code: 'TREASURE5_HARD2',
    level: 5,
    difficulty: 'hard',
    clue: 'Look in the admin building attic',
    location: 'Admin Building Attic',
    nextDestination: 'Go to the final treasure room',
    points: 20,
    isActive: true
  }
];

async function addMoreTreasures() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Insert treasures
    const treasures = await Treasure.insertMany(additionalTreasures);
    console.log(`✅ Added ${treasures.length} new treasure points`);

    // Show summary
    const allTreasures = await Treasure.find({});
    console.log('\n📊 Treasure Summary:');
    for (let level = 1; level <= 5; level++) {
      for (const difficulty of ['easy', 'medium', 'hard']) {
        const count = allTreasures.filter(t => t.level === level && t.difficulty === difficulty).length;
        console.log(`Level ${level} ${difficulty}: ${count} treasures`);
      }
    }

  } catch (error) {
    console.error('Error adding treasures:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

addMoreTreasures(); 
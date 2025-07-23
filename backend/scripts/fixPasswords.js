const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function fixPasswords() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all users
    const users = await User.find({});
    console.log(`Found ${users.length} users`);

    for (const user of users) {
      // Check if password is already hashed
      if (!user.password.startsWith('$2b$')) {
        console.log(`Fixing password for ${user.email}`);
        
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        
        // Update user with hashed password
        await User.findByIdAndUpdate(user._id, { password: hashedPassword });
        console.log(`✅ Password fixed for ${user.email}`);
      } else {
        console.log(`Password already hashed for ${user.email}`);
      }
    }

    console.log('✅ All passwords fixed!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@treasurehunt.com / admin123');
    console.log('Team 1: team1@treasurehunt.com / team123');
    console.log('Team 2: team2@treasurehunt.com / team123');

  } catch (error) {
    console.error('Error fixing passwords:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

fixPasswords(); 
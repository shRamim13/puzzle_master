const Treasure = require('../models/Treasure');
const User = require('../models/User');

// Get all treasures
exports.getAllTreasures = async (req, res) => {
  try {
    const treasures = await Treasure.find().sort({ level: 1, difficulty: 1 });
    res.json(treasures);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get treasure by code
exports.getTreasureByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const treasure = await Treasure.findOne({ code, isActive: true });
    
    if (!treasure) {
      return res.status(404).json({ message: 'Treasure not found' });
    }
    
    res.json(treasure);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Verify treasure code
exports.verifyTreasureCode = async (req, res) => {
  try {
    const { code } = req.body;
    const { userId } = req.user;

    const treasure = await Treasure.findOne({ code, isActive: true });
    
    if (!treasure) {
      return res.status(404).json({ message: 'Invalid treasure code' });
    }

    // Check if already completed by this team
    const alreadyCompleted = treasure.completedBy.some(
      completion => completion.teamId.toString() === userId
    );

    if (alreadyCompleted) {
      return res.status(400).json({ 
        message: 'Treasure already completed by your team',
        treasure: treasure
      });
    }

    // Add completion record
    treasure.completedBy.push({
      teamId: userId,
      completedAt: new Date()
    });
    await treasure.save();

    // Update user score
    const user = await User.findById(userId);
    if (user) {
      user.score += treasure.points;
      await user.save();
    }

    res.json({
      message: 'Treasure completed successfully!',
      treasure: treasure,
      pointsEarned: treasure.points
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new treasure
exports.createTreasure = async (req, res) => {
  try {
    const treasureData = req.body;
    
    // Generate unique code if not provided
    if (!treasureData.code) {
      treasureData.code = generateUniqueCode();
    }

    const treasure = new Treasure(treasureData);
    await treasure.save();
    
    res.status(201).json(treasure);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Treasure code already exists' });
    } else {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

// Update treasure
exports.updateTreasure = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const treasure = await Treasure.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!treasure) {
      return res.status(404).json({ message: 'Treasure not found' });
    }
    
    res.json(treasure);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete treasure
exports.deleteTreasure = async (req, res) => {
  try {
    const { id } = req.params;
    
    const treasure = await Treasure.findByIdAndDelete(id);
    
    if (!treasure) {
      return res.status(404).json({ message: 'Treasure not found' });
    }
    
    res.json({ message: 'Treasure deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get treasure statistics
exports.getTreasureStats = async (req, res) => {
  try {
    const totalTreasures = await Treasure.countDocuments();
    const activeTreasures = await Treasure.countDocuments({ isActive: true });
    const completedTreasures = await Treasure.aggregate([
      {
        $group: {
          _id: null,
          totalCompletions: { $sum: { $size: '$completedBy' } }
        }
      }
    ]);

    res.json({
      totalTreasures,
      activeTreasures,
      totalCompletions: completedTreasures[0]?.totalCompletions || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper function to generate unique code
function generateUniqueCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
} 
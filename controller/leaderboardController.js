const User = require('../models/user.model');

const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({}, 'totalamount name');
    
    let userLeaderBoard = [];
    users.forEach(user => {
      userLeaderBoard.push({ name: user.name, total_cost: user.totalamount || 0 });
    });
    userLeaderBoard.sort((a, b) => b.total_cost - a.total_cost);
    res.status(201).json(userLeaderBoard);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
}
module.exports={getLeaderboard,}
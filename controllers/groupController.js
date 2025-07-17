const Group = require('../models/Group');

exports.getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({ creator: req.user.id });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createGroup = async (req, res) => {
  try {
    const { name } = req.body;
    const group = await Group.create({
      name,
      creator: req.user.id,
      members: [req.user.id]
    });
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateGroup = async (req, res) => {
  try {
    const group = await Group.findOneAndUpdate(
      { _id: req.params.id, creator: req.user.id },
      { name: req.body.name },
      { new: true }
    );
    if (!group) return res.status(404).json({ message: 'Group not found or unauthorized' });
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const group = await Group.findOneAndDelete({
      _id: req.params.id,
      creator: req.user.id
    });
    if (!group) return res.status(404).json({ message: 'Group not found or unauthorized' });
    res.json({ message: 'Group deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const User = require("../models/User");

exports.addFriend = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const { friendEmail } = req.body;

    const friend = await User.findOne({ email: friendEmail });
    if (!friend) return res.status(404).json({ message: "Ami introuvable" });

    if (friend._id.toString() === currentUserId) {
      return res.status(400).json({ message: "Vous ne pouvez pas vous ajouter vous-même" });
    }

    const currentUser = await User.findById(currentUserId);
    if (currentUser.friends.includes(friend._id)) {
      return res.status(400).json({ message: "Ami déjà ajouté" });
    }

    currentUser.friends.push(friend._id);
    await currentUser.save();

    res.json({ message: "Ami ajouté avec succès" });

  } catch (err) {
    console.error("Erreur ajout ami:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate("friends", "name email");
    res.json(user.friends);
  } catch (err) {
    console.error("Erreur récupération amis:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

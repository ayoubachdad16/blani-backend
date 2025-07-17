const Event = require("../models/Event");

exports.createEvent = async (req, res) => {
  try {
    const { title, date, location, description } = req.body;
    const event = await Event.create({
      title,
      date,
      location,
      description,
      createdBy: req.user.userId, // depuis token
    });

    res.status(201).json({ message: "Événement créé avec succès", event });
  } catch (err) {
    console.error("Erreur création événement:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

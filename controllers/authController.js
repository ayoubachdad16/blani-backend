const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendVerificationEmail = require('../utils/sendEmail');

// 🎟️ Access Token → courte durée
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30m' });
};

// 🔁 Refresh Token → plus longue durée
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
};

// ▶️ REGISTER
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email déjà utilisé.' });

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = await User.create({
      username,
      email,
      password,
      verificationToken,
      emailVerified: false
    });

    await sendVerificationEmail(email, verificationToken);

    res.status(200).json({ message: 'Un email de vérification a été envoyé.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// ▶️ VERIFY EMAIL
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).send('Lien de vérification invalide ou expiré.');
    }

    user.emailVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return res.redirect('https://blani-backend.onrender.com/email-verified');
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la vérification de l'email.");
  }
};

// ▶️ RESEND EMAIL VERIFICATION
exports.resendVerification = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: "Adresse déjà vérifiée." });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.verificationToken = token;
    await user.save();

    await sendVerificationEmail(user.email, token);

    res.status(200).json({ message: 'Email de vérification renvoyé avec succès.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de l’envoi de l’email." });
  }
};

// ▶️ LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    const cookieOptions = {
      httpOnly: true,
      sameSite: 'Lax',
      secure: false,
      path: '/',
    };

    if (rememberMe) {
      cookieOptions.maxAge = 30 * 24 * 60 * 60 * 1000;
    }

    res.cookie('refreshToken', refreshToken, cookieOptions);

    res.status(200).json({
      accessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ▶️ GET ME
exports.getMe = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.sendStatus(404);

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      emailVerified: user.emailVerified
    });
  } catch (err) {
    res.sendStatus(403);
  }
};

// ▶️ REFRESH TOKEN
exports.refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(403).json({ message: 'No refresh token' });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    const accessToken = generateAccessToken(decoded.id);
    res.json({ accessToken });
  });
};

// ▶️ LOGOUT
exports.logout = (req, res) => {
  res.clearCookie('refreshToken', {
    path: '/',
    httpOnly: true,
    sameSite: 'Lax',
    secure: false,
  });
  res.json({ message: 'Logged out' });
};

const express = require('express');
const {
  register,
  login,
  logout,
  refreshToken,
  verifyEmail,
  resendVerification,
  getMe
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refreshToken);
router.get('/me', getMe);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);

module.exports = router;

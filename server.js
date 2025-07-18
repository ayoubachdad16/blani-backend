const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const authRoutes = require('./routes/authRoutes');
const groupRoutes = require('./routes/groupRoutes');
const allowedOrigins = [
  'http://localhost:3000',
  'https://blani.site'
];
const app = express();

// ✅ Middleware CORS d'abord
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ✅ Ensuite JSON et cookie-parser
app.use(express.json());
app.use(cookieParser());

// ✅ Puis seulement maintenant les routes
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);

// ✅ Connexion Mongo
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected.');
    app.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch(err => console.error(err));

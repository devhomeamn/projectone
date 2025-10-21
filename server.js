const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/db');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Debug: সব request log করো
app.use((req, res, next) => {
  console.log('➡️', req.method, req.originalUrl);
  next();
});

// ✅ Import routes
const authRoutes = require('./routes/authRoutes');
const sectionRoutes = require('./routes/sectionRoutes');
const recordRoutes = require('./routes/recordRoutes');


 // ✅ must come BEFORE static serve

// ✅ API routes অবশ্যই প্রথমে রাখো
app.use('/api/auth', authRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/records', recordRoutes);

// ✅ Manual test route (backend check)
app.get('/api/test', (req, res) => {
  res.json({ message: '✅ Manual route working fine' });
});

// ✅ Static serve (সবচেয়ে শেষে)
app.use(express.static(path.join(__dirname, 'frontend')));

// ✅ Root page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'login.html'));
});

// ✅ Database sync
sequelize.sync({ alter: true })
  .then(() => console.log('✅ Database synced'))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

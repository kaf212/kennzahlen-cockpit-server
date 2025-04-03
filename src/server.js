const express = require('express');
const authRoutes = require('./routes/authRoutes');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(3000, () => {
    console.log('✅ Server läuft auf http://localhost:3000');
});

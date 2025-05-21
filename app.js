const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com MongoDB
mongoose.connect(process.env.MONGO_URI, {
  
}).then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Erro ao conectar:', err));

// Rotas
const participantRoutes = require('./routes/participants');
app.use('/api/participants', participantRoutes);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

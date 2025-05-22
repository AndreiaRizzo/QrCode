const express = require('express');
const router = express.Router();
const Participant = require('../models/Participant');
const QRCode = require('qrcode');

// Cadastrar participante e gerar QRCode
router.post('/', async (req, res) => {
  try {
    const { nome, email, cpf } = req.body;
    const newParticipant = new Participant({ nome, email, cpf });

    const saved = await newParticipant.save();

    const qrCodeData = `${saved._id}`;
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);

    saved.qrCode = qrCodeImage;
    await saved.save();

    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar participante' });
  }
});

// Listar todos os participantes
router.get('/', async (req, res) => {
  const list = await Participant.find();
  res.json(list);
});

// Confirmar presença via QRCode (usando ID do participante)
router.post('/confirmar/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const participant = await Participant.findById(id);

    if (!participant) return res.status(404).json({ error: 'Participante não encontrado' });
    if (participant.presenca) return res.status(400).json({ error: 'Presença já confirmada' });

    participant.presenca = true;
    participant.dataHoraPresenca = new Date();
    await participant.save();

    res.json({ message: 'Presença confirmada com sucesso!', participante: participant });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao confirmar presença' });
  }
});






// Já foi declarado no topo: const QRCode = require('qrcode');

router.get('/:id/qrcode', async (req, res) => {
  try {
    const { id } = req.params;
    const participant = await Participant.findById(id);

    if (!participant) return res.status(404).json({ error: 'Participante não encontrado' });

    // Gera o QR code como buffer PNG
    const buffer = await QRCode.toBuffer(id);

    res.setHeader('Content-Type', 'image/png');
    res.send(buffer);

  } catch (err) {
    res.status(500).json({ error: 'Erro ao gerar QR Code' });
  }
});

// POST: Cadastrar participante
router.post('/cadastrar', (req, res) => {
  const { nome, cpf, email, telefone } = req.body;

  if (!nome || !cpf || !email || !telefone) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
  }

  // Verifica se o CPF já está cadastrado
  const existente = participants.find(p => p.cpf === cpf);
  if (existente) {
    return res.status(400).json({ erro: 'Participante com este CPF já cadastrado.' });
  }

  participants.push({ nome, cpf, email, telefone });
  res.status(201).json({ mensagem: 'Participante cadastrado com sucesso!' });
});

// GET: Buscar participante pelo CPF
router.get('/buscar', async (req, res) => {
  const { cpf } = req.query;

  try {
    if (!cpf) {
      return res.status(400).json({ error: 'CPF é obrigatório para busca.' });
    }

    const participante = await Participant.findOne({ cpf });

    if (!participante) {
      return res.status(404).json({ error: 'Participante não encontrado.' });
    }

    res.json(participante);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar participante.' });
  }
});



  

// GET: Listar todos os participantes
router.get('/listar', (req, res) => {
  res.json(participants);
});

module.exports = router;

// No seu app.js (servidor):
// const participantsRouter = require('./routes/participants');
// app.use('/api/participants', participantsRouter);




module.exports = router;

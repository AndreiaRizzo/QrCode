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
const QRCodeImage = require('qrcode-image');

// Gerar QR Code como imagem PNG para download
router.get('/:id/qrcode', async (req, res) => {
  try {
    const { id } = req.params;
    const participant = await Participant.findById(id);

    if (!participant) return res.status(404).json({ error: 'Participante não encontrado' });

    const qr = QRCodeImage(id, { type: 'png' });
    res.setHeader('Content-type', 'image/png');
    qr.pipe(res);

  } catch (err) {
    res.status(500).json({ error: 'Erro ao gerar QR Code' });
  }
});


module.exports = router;

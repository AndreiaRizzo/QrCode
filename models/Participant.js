const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  nome: String,
  email: String,
  cpf: String,
  qrCode: String,
  presenca: { type: Boolean, default: false },
  dataHoraPresenca: Date
});

module.exports = mongoose.model('Participant', participantSchema);

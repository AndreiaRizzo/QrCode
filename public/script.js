const apiBase = 'http://localhost:3000/api/participants';

function onScanSuccess(qrCodeMessage) {
  console.log("Código lido:", qrCodeMessage);
  const id = qrCodeMessage.trim();

  fetch(`${apiBase}/confirmar/${id}`, {
    method: 'POST'
  })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        document.getElementById('result').innerText = `✅ ${data.message} - ${data.participante.nome}`;
      } else if (data.error) {
        document.getElementById('result').innerText = `⚠️ ${data.error}`;
      }
    })
    .catch(error => {
      console.error('Erro ao confirmar presença:', error);
      document.getElementById('result').innerText = `❌ Erro ao enviar dados.`;
    });
}

const html5QrCode = new Html5Qrcode("reader");
html5QrCode.start(
  { facingMode: "environment" }, 
  {
    fps: 10,
    qrbox: 250
  },
  onScanSuccess
).catch(err => {
  console.error("Erro ao iniciar leitura:", err);
});

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
        document.getElementById('result').innerText = `${data.message} - ${data.participante.nome}`;
      } else if (data.error) {
        document.getElementById('result').innerText = `${data.error}`;
      }
    })
    .catch(error => {
      console.error('Erro ao confirmar presença:', error);
      document.getElementById('result').innerText = `Erro ao enviar dados.`;
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

// Função chamada no submit de busca
function buscarParticipantes() {
  const nome = document.getElementById('filtroNome').value;
  const cpf = document.getElementById('filtroCpf').value;
  const email = document.getElementById('filtroEmail').value;

  const params = new URLSearchParams();
  if (nome) params.append('nome', nome);
  if (cpf) params.append('cpf', cpf);
  if (email) params.append('email', email);

  fetch(`${apiBase}/buscar?` + params.toString())
    .then(res => res.json())
    .then(participantes => {
      const resultadoDiv = document.getElementById('resultadoBusca');
      resultadoDiv.innerHTML = '';
      if (participantes.length === 0) {
        resultadoDiv.innerText = 'Nenhum participante encontrado.';
      } else {
        const lista = document.createElement('ul');
        participantes.forEach(p => {
          const item = document.createElement('li');
          item.textContent = `${p.nome} - ${p.cpf} - ${p.email}`;
          lista.appendChild(item);
        });
        resultadoDiv.appendChild(lista);
      }
    })
    .catch(err => {
      console.error(err);
      alert('Erro ao buscar participantes.');
    });
}


const apiBase = 'http://localhost:3000/api/participants';

function carregarTodosParticipantes() {
  fetch(apiBase)
    .then(res => res.json())
    .then(participantes => {
      const tabela = document.getElementById('tabela-participantes');
      tabela.innerHTML = '';

      participantes.forEach(p => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
          <td>${p.nome}</td>
          <td>${p.email}</td>
          <td>${p.cpf}</td>
          <td>${p.presenca ? 'Presente' : 'Ausente'}</td>
          <td><img src="${p.qrCode}" alt="QR Code" style="width: 80px; height: 80px;" /></td>
        `;
        tabela.appendChild(linha);
      });
    })
    .catch(err => {
      console.error('Erro ao carregar participantes:', err);
    });
}

document.addEventListener('DOMContentLoaded', carregarTodosParticipantes);

const form = document.getElementById('buscarForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  const cpf = data.cpf;

  try {
    const res = await fetch(`http://localhost:3000/api/participants/buscar?cpf=${encodeURIComponent(cpf)}`);
    const participante = await res.json();
    console.log(participante);

    const lista = document.getElementById('resultados');
    lista.innerHTML = '';

    if (!res.ok || participante.error || !participante) {
      const item = document.createElement('li');
      item.classList.add('list-group-item');
      item.textContent = 'Nenhum participante encontrado.';
      lista.appendChild(item);
    } else {
      const item = document.createElement('li');
      item.classList.add('list-group-item');

      const statusHTML = participante.presenca
        ? '<span class="badge bg-success">Presença confirmada ✅</span>'
        : '<span class="badge bg-secondary">Presença pendente ⏳</span>';

      item.innerHTML = `${participante.nome} - ${participante.email} - CPF: ${participante.cpf} - ${statusHTML}`;
      lista.appendChild(item);
    }
  } catch (err) {
    console.error('Erro na busca:', err);
    const lista = document.getElementById('resultados');
    lista.innerHTML = `
      <li class="list-group-item text-danger">Erro na requisição. Verifique o console.</li>
    `;
  }
});

document.getElementById('buscarForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const cpf = document.getElementById('buscaCpf').value.trim();

  try {
    const res = await fetch(`http://localhost:3000/api/participants/buscar?cpf=${encodeURIComponent(cpf)}`);
    const participantes = await res.json();

    const lista = document.getElementById('resultados');
    lista.innerHTML = '';

    if (!participantes.length) {
      const item = document.createElement('li');
      item.classList.add('list-group-item');
      item.textContent = 'Nenhum participante encontrado.';
      lista.appendChild(item);
    } else {
      participantes.forEach(p => {
        const item = document.createElement('li');
        item.classList.add('list-group-item');
        item.textContent = `${p.nome} - ${p.email} - CPF: ${p.cpf}`;
        lista.appendChild(item);
      });
    }
  } catch (err) {
    console.error('Erro na busca:', err);
  }
});

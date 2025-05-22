document.getElementById('buscaForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const termo = document.getElementById('filtro').value;

  try {
    const res = await fetch(`http://localhost:3000/api/participants/buscar?termo=${encodeURIComponent(termo)}`);
    const participantes = await res.json();

    const lista = document.getElementById('resultados');
    lista.innerHTML = '';
    participantes.forEach(p => {
      const item = document.createElement('li');
      item.textContent = `${p.nome} - ${p.email} - ${p.cpf}`;
      lista.appendChild(item);
    });
  } catch (err) {
    console.error('Erro na busca:', err);
  }
});

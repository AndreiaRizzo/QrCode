// Aplica máscara no campo de CPF
const cpfInput = document.getElementById('buscaCpf');

cpfInput.addEventListener('input', () => {
  let value = cpfInput.value.replace(/\D/g, ''); // Remove tudo que não for número
  if (value.length > 11) value = value.slice(0, 11); // Limita a 11 dígitos

  // Aplica a máscara: 123.456.789-00
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

  cpfInput.value = value;
});

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
        ? '<span class="badge bg-success">Presença confirmada </span>'
        : '<span class="badge bg-secondary">Presença pendente </span>';

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

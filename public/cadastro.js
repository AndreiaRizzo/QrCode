const form = document.getElementById('cadastroForm');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const res = await fetch('http://localhost:3000/api/participants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();

    if (res.ok) {
      document.getElementById('mensagem').innerHTML =
        `Cadastrado com sucesso!<br><img src="${result.qrcode}" width="150"/>`;
    } else {
      document.getElementById('mensagem').textContent = result.error || 'Erro no cadastro.';
    }
  } catch (err) {
    document.getElementById('mensagem').textContent = 'Erro ao enviar dados.';
    console.error(err);
  }
});

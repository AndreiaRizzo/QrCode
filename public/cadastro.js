const form = document.getElementById('cadastroForm');

const cpfInput = document.getElementById('cpf');
const telInput = document.getElementById('telefone');
const emailInput = document.getElementById('email');

const cpfValido = document.getElementById('cpfValido');
const telValido = document.getElementById('telValido');
const emailValido = document.getElementById('emailValido');


// Máscaras
cpfInput.addEventListener('input', () => {
  let val = cpfInput.value.replace(/\D/g, '');
  if (val.length > 11) val = val.slice(0, 11);
  val = val.replace(/(\d{3})(\d)/, '$1.$2');
  val = val.replace(/(\d{3})(\d)/, '$1.$2');
  val = val.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  cpfInput.value = val;
  validarCampos();
});

telInput.addEventListener('input', () => {
  let val = telInput.value.replace(/\D/g, '');
  if (val.length > 11) val = val.slice(0, 11);
  val = val.replace(/^(\d{2})(\d)/g, '($1) $2');
  val = val.replace(/(\d{5})(\d)/, '$1-$2');
  telInput.value = val;
  validarCampos();
});

emailInput.addEventListener('input', validarCampos);

function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf[10]);
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarTelefone(telefone) {
  return /\(\d{2}\) \d{5}-\d{4}/.test(telefone);
}

function showValidation(label, isValid, msgOk, msgErro) {
  if (label && label.classList) {
    if (isValid) {
      label.textContent = msgOk;
      label.className = 'valid-label success d-block position-absolute top-50 end-0 translate-middle-y me-3';
    } else if (label.previousElementSibling.value.trim() !== '') {
      label.textContent = msgErro;
      label.className = 'valid-label error d-block position-absolute top-50 end-0 translate-middle-y me-3';
    } else {
      label.classList.add('d-none');
    }
  }
}

function validarCampos() {
  showValidation(cpfValido, validarCPF(cpfInput.value), 'cpf válido', 'cpf inválido');
  showValidation(telValido, validarTelefone(telInput.value), 'telefone válido', 'telefone inválido');
  showValidation(emailValido, validarEmail(emailInput.value), 'email válido', 'email inválido');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  validarCampos();

  if (!validarCPF(cpfInput.value) || !validarEmail(emailInput.value) || !validarTelefone(telInput.value)) {
    return;
  }

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
        `Cadastrado com sucesso!<br><img src="${result.qrCode}" width="150"/>`;
    } else {
      document.getElementById('mensagem').textContent = result.error || 'Erro no cadastro.';
    }
  } catch (err) {
    document.getElementById('mensagem').textContent = 'Erro ao enviar dados.';
    console.error(err);
  }
});

/*
  arquivo: js/script.js
  finalidade: validação do formulário de agendamento, prevenção de datas passadas, mensagem de confirmação
  autor: Jessica Loriato
  observações: cliente-side only; para persistência real, integrar com backend
*/

document.addEventListener('DOMContentLoaded', function () {

  // Previne seleção de datas passadas (define min = hoje)
  const dataInput = document.getElementById('dataAgendamento');
  if (dataInput) {
    const hoje = new Date();
    const minDate = hoje.toISOString().split('T')[0];
    dataInput.setAttribute('min', minDate);
  }

  // Validação do formulário (Bootstrap + HTML5)
  const form = document.getElementById('formAgendamento');
  const mensagemResultado = document.getElementById('mensagemResultado');
  const btnLimpar = document.getElementById('btnLimpar');

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      event.stopPropagation();

      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        mensagemResultado.innerHTML = '<div class="alert alert-danger">Por favor corrija os campos destacados.</div>';
        return;
      }

      // Captura de valores (simulação de envio)
      const clienteNome = document.getElementById('clienteNome').value;
      const petNome = document.getElementById('petNome').value;
      const servico = document.getElementById('servico').value;
      const metodo = document.querySelector('input[name="metodo"]:checked') ? document.querySelector('input[name="metodo"]:checked').value : '';
      const dataAg = document.getElementById('dataAgendamento').value;
      const horaAg = document.getElementById('horaAgendamento').value;

      // Mensagem de confirmação
      mensagemResultado.innerHTML = `
        <div class="alert alert-success">
          <strong>Agendamento realizado!</strong><br>
          Cliente: ${escapeHtml(clienteNome)}<br>
          Pet: ${escapeHtml(petNome)}<br>
          Serviço: ${escapeHtml(servico)}<br>
          Método: ${escapeHtml(metodo)}<br>
          Data: ${escapeHtml(dataAg)} às ${escapeHtml(horaAg)}.
        </div>
      `;

      // Opcional: salvar no localStorage para simular backend
      try {
        let agendamentos = JSON.parse(localStorage.getItem('petloris_agendamentos') || '[]');
        agendamentos.push({
          cliente: clienteNome,
          pet: petNome,
          servico: servico,
          metodo: metodo,
          data: dataAg,
          hora: horaAg,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('petloris_agendamentos', JSON.stringify(agendamentos));
      } catch (e) {
        // se localStorage falhar, ignorar silenciosamente (não crítico)
      }

      // Limpar formulário
      form.reset();
      form.classList.remove('was-validated');
    });
  }

  // Botão limpar
  if (btnLimpar) {
    btnLimpar.addEventListener('click', function () {
      if (form) {
        form.reset();
        form.classList.remove('was-validated');
        mensagemResultado.innerHTML = '';
      }
    });
  }

  // Mostra serviço selecionado (pequena interação)
  const servicoSelect = document.getElementById('servico');
  if (servicoSelect) {
    const infoServico = document.createElement('div');
    infoServico.className = 'mt-2';
    servicoSelect.parentNode.appendChild(infoServico);

    servicoSelect.addEventListener('change', function () {
      const val = servicoSelect.value;
      if (val) {
        infoServico.innerHTML = `<small>Serviço selecionado: <strong>${escapeHtml(val)}</strong></small>`;
      } else {
        infoServico.innerHTML = '';
      }
    });
  }

  // Função utilitária para evitar XSS em textos injetados
  function escapeHtml(text) {
    if (!text) return '';
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});

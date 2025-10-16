let expr = '';

const display = document.getElementById('display');
const scienceToggle = document.getElementById('science-toggle');
const sciencePanel = document.getElementById('science-panel');

function updateDisplay() {
  display.textContent = expr || '0';
}

function clearAll() {
  expr = '';
  updateDisplay();
}

function del() {
  expr = expr.slice(0, -1);
  updateDisplay();
}

function append(val) {
  expr += val;
  updateDisplay();
}

function roundResult(x) {
  if (!isFinite(x)) return NaN;
  return Math.round((x + Number.EPSILON) * 1e12) / 1e12;
}

function evaluateExpression() {
  if (expr.trim() === '') return;
  try {
    const safe = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/%/g, '/100');
    const val = Function('return (' + safe + ')')();
    expr = String(roundResult(Number(val)));
    updateDisplay();
  } catch (e) {
    expr = 'Error';
    updateDisplay();
    expr = '';
  }
}

function applyFunc(func) {
  const val = parseFloat(expr);
  if (isNaN(val)) return;
  let res;
  switch (func) {
    case 'sin': res = Math.sin((val * Math.PI) / 180); break;
    case 'cos': res = Math.cos((val * Math.PI) / 180); break;
    case 'tan': res = Math.tan((val * Math.PI) / 180); break;
    case 'log': res = Math.log10(val); break;
    case 'exp': res = Math.exp(val); break;
    case 'sqrt': res = Math.sqrt(val); break;
    default: res = val;
  }
  expr = String(roundResult(res));
  updateDisplay();
}

// Gestion des boutons
document.addEventListener('click', (ev) => {
  const target = ev.target;
  const action = target.getAttribute('data-action');
  const func = target.getAttribute('data-func');
  if (action) {
    if (action === 'del') del();
    else if (action === 'ac') clearAll();
    else if (action === '=') evaluateExpression();
    else append(action);
  } else if (func) {
    applyFunc(func);
  }
});

// ✅ Le panneau est invisible au chargement
sciencePanel.classList.add('hidden');

// ✅ Apparition / disparition quand on clique
scienceToggle.addEventListener('click', () => {
  if (sciencePanel.classList.contains('hidden')) {
    sciencePanel.classList.remove('hidden');
  } else {
    sciencePanel.classList.add('hidden');
  }
});

// Gestion clavier
window.addEventListener('keydown', (e) => {
  const k = e.key;
  if (/[0-9]/.test(k)) append(k);
  else if (k === 'Backspace') del();
  else if (k === 'Enter') evaluateExpression();
  else if (['+', '-', '*', '/', '%', '.'].includes(k)) append(k);
});

updateDisplay();

// ===== i18n =====
const I18N = {
  en: {
    title: 'Password Generator',
    subtitle: 'Enterprise Security Tool',
    passwordType: 'Password Type',
    typeRandom: 'Random',
    typeRandomDesc: 'High-entropy characters',
    typeMemorable: 'Passphrase',
    typeMemorableDesc: 'Word-based combination',
    typePin: 'PIN',
    typePinDesc: 'Numeric-only code',
    configuration: 'Configuration',
    passwordLength: 'Password Length',
    uppercase: 'Uppercase',
    lowercase: 'Lowercase',
    numbers: 'Numbers',
    symbols: 'Symbols',
    excludeAmbiguous: 'Exclude Ambiguous',
    wordCount: 'Word Count',
    separator: 'Separator',
    sepHyphen: 'Hyphen (-)',
    sepUnderscore: 'Underscore (_)',
    sepDot: 'Dot (.)',
    sepNone: 'None',
    capitalize: 'Capitalize',
    appendNumber: 'Append Number',
    pinLength: 'PIN Length',
    generatedPassword: 'Generated Password',
    clickToStart: 'Click "Generate" to start',
    generate: 'Generate',
    copyPassword: 'Copy Password',
    copyToClipboard: 'Copy to clipboard',
    recentHistory: 'Recent History',
    clearAll: 'Clear All',
    noHistory: 'No history yet',
    footerMain: 'All passwords are generated using cryptographically secure random number generators.',
    footerSub: 'Crypto API \u00b7 Zero Storage \u00b7 Client-side Safe',
    strengthWeak: 'Weak \u2013 increase length and complexity',
    strengthMedium: 'Medium \u2013 acceptable, but could be stronger',
    strengthStrong: 'Strong \u2013 very secure',
    strengthPrefix: 'Strength',
    generateFirst: 'Please generate a password first',
    copied: 'Password copied to clipboard',
    copyFailed: 'Copy failed, please copy manually',
    historyCopied: 'Copied',
    historyCopyFailed: 'Copy failed',
    deleted: 'Deleted',
    historyEmpty: 'History is already empty',
    confirmClear: 'Are you sure you want to clear all history?',
    historyCleared: 'History cleared',
    genFailed: 'Generation failed',
    typeRandomShort: 'Random',
    typeMemorableShort: 'Passphrase',
    typePinShort: 'PIN',
    historyCopy: 'Copy',
    historyDelete: 'Delete',
  },
  zh: {
    title: '密码生成器',
    subtitle: '企业安全工具',
    passwordType: '密码类型',
    typeRandom: '随机密码',
    typeRandomDesc: '高熵随机字符',
    typeMemorable: '助记词组',
    typeMemorableDesc: '基于单词的组合',
    typePin: 'PIN 码',
    typePinDesc: '纯数字编码',
    configuration: '参数配置',
    passwordLength: '密码长度',
    uppercase: '大写字母',
    lowercase: '小写字母',
    numbers: '数字',
    symbols: '符号',
    excludeAmbiguous: '排除易混淆字符',
    wordCount: '单词数量',
    separator: '分隔符',
    sepHyphen: '连字符 (-)',
    sepUnderscore: '下划线 (_)',
    sepDot: '点号 (.)',
    sepNone: '无',
    capitalize: '首字母大写',
    appendNumber: '附加数字',
    pinLength: 'PIN 长度',
    generatedPassword: '生成的密码',
    clickToStart: '点击 "生成" 开始',
    generate: '生成密码',
    copyPassword: '复制密码',
    copyToClipboard: '复制到剪贴板',
    recentHistory: '最近记录',
    clearAll: '清空',
    noHistory: '暂无历史记录',
    footerMain: '所有密码均使用密码学安全随机数生成器生成。',
    footerSub: '加密 API \u00b7 零存储 \u00b7 客户端安全',
    strengthWeak: '弱 \u2013 建议增加长度和复杂度',
    strengthMedium: '中等 \u2013 可以使用，建议更强',
    strengthStrong: '强 \u2013 非常安全',
    strengthPrefix: '密码强度',
    generateFirst: '请先生成密码',
    copied: '密码已复制到剪贴板',
    copyFailed: '复制失败，请手动复制',
    historyCopied: '已复制',
    historyCopyFailed: '复制失败',
    deleted: '已删除',
    historyEmpty: '历史记录已为空',
    confirmClear: '确定要清除所有历史记录吗？',
    historyCleared: '历史记录已清除',
    genFailed: '生成失败',
    typeRandomShort: '随机',
    typeMemorableShort: '易记',
    typePinShort: 'PIN',
    historyCopy: '复制',
    historyDelete: '删除',
  }
};

let currentLang = localStorage.getItem('lang') || 'zh';

function t(key) {
  return (I18N[currentLang] && I18N[currentLang][key]) || key;
}

function applyI18n() {
  document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';

  // data-i18n text
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });

  // data-i18n-title
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.dataset.i18nTitle);
  });

  // separator options
  const sep = document.getElementById('separator');
  if (sep) {
    const opts = sep.options;
    if (opts.length >= 4) {
      opts[0].textContent = t('sepHyphen');
      opts[1].textContent = t('sepUnderscore');
      opts[2].textContent = t('sepDot');
      opts[3].textContent = t('sepNone');
    }
  }

  // language label
  document.getElementById('langLabel').textContent = currentLang === 'zh' ? 'EN' : '中文';

  // update strength text if password already generated
  if (elements.generatedPassword.textContent !== t('clickToStart') &&
      elements.strengthText.textContent) {
    // re-render strength text is handled on next generate
  }

  // re-render history labels
  renderHistory();
}

function toggleLang() {
  currentLang = currentLang === 'zh' ? 'en' : 'zh';
  localStorage.setItem('lang', currentLang);
  applyI18n();
}

// ===== 配置 =====
const API_BASE_URL = window.location.origin;

// ===== 状态管理 =====
let currentType = 'random';
let passwordHistory = JSON.parse(localStorage.getItem('passwordHistory')) || [];

// ===== DOM 元素 =====
const elements = {
  typeBtns: document.querySelectorAll('.type-btn'),
  randomConfig: document.getElementById('random-config'),
  memorableConfig: document.getElementById('memorable-config'),
  pinConfig: document.getElementById('pin-config'),
  lengthSlider: document.getElementById('length'),
  lengthValue: document.getElementById('random-value'),
  uppercaseCheck: document.getElementById('uppercase'),
  lowercaseCheck: document.getElementById('lowercase'),
  numbersCheck: document.getElementById('numbers'),
  symbolsCheck: document.getElementById('symbols'),
  excludeAmbiguousCheck: document.getElementById('excludeAmbiguous'),
  wordCountSlider: document.getElementById('wordCount'),
  wordCountValue: document.getElementById('memorable-value'),
  capitalizeCheck: document.getElementById('capitalize'),
  includeNumberCheck: document.getElementById('includeNumber'),
  separatorSelect: document.getElementById('separator'),
  pinLengthSlider: document.getElementById('pinLength'),
  pinLengthValue: document.getElementById('pin-value'),
  generatedPassword: document.getElementById('generatedPassword'),
  strengthFill: document.getElementById('strengthFill'),
  strengthText: document.getElementById('strengthText'),
  generateBtn: document.getElementById('generateBtn'),
  copyBtn: document.getElementById('copyBtn'),
  copyBtnLarge: document.getElementById('copyBtnLarge'),
  clearHistoryBtn: document.getElementById('clearHistory'),
  historyList: document.getElementById('historyList'),
  langToggle: document.getElementById('langToggle')
};

// ===== 初始化 =====
function init() {
  setupEventListeners();
  applyI18n();
  renderHistory();
  generatePassword();
}

// ===== 设置事件监听器 =====
function setupEventListeners() {
  elements.typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentType = btn.dataset.type;
      updateActiveType(btn);
      showConfigSection(currentType);
      generatePassword();
    });
  });

  elements.lengthSlider.addEventListener('input', (e) => {
    elements.lengthValue.textContent = e.target.value;
  });
  elements.wordCountSlider.addEventListener('input', (e) => {
    elements.wordCountValue.textContent = e.target.value;
  });
  elements.pinLengthSlider.addEventListener('input', (e) => {
    elements.pinLengthValue.textContent = e.target.value;
  });

  [
    elements.lengthSlider, elements.uppercaseCheck, elements.lowercaseCheck,
    elements.numbersCheck, elements.symbolsCheck, elements.excludeAmbiguousCheck,
    elements.wordCountSlider, elements.capitalizeCheck, elements.includeNumberCheck,
    elements.separatorSelect, elements.pinLengthSlider
  ].forEach(el => {
    if (el) el.addEventListener('change', () => generatePassword());
  });

  elements.generateBtn.addEventListener('click', () => generatePassword());
  elements.copyBtn.addEventListener('click', () => copyPassword());
  elements.copyBtnLarge.addEventListener('click', () => copyPassword());
  elements.clearHistoryBtn.addEventListener('click', () => clearHistory());
  elements.langToggle.addEventListener('click', () => toggleLang());

  elements.historyList.addEventListener('click', (e) => {
    const btn = e.target.closest('.history-btn');
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === 'copy') copyHistoryPassword(btn.dataset.password);
    else if (action === 'delete') deleteHistoryItem(Number(btn.dataset.id));
  });
}

function updateActiveType(activeBtn) {
  elements.typeBtns.forEach(btn => btn.classList.remove('active'));
  activeBtn.classList.add('active');
}

function showConfigSection(type) {
  ['random', 'memorable', 'pin'].forEach(t => {
    elements[t + 'Config'].classList.toggle('hidden', t !== type);
  });
}

// ===== API 请求封装 =====
async function apiPost(endpoint, body) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    throw new Error(`${t('genFailed')} (${response.status})`);
  }
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || t('genFailed'));
  }
  return data;
}

// ===== 生成密码 =====
async function generatePassword() {
  try {
    let data;
    switch (currentType) {
      case 'random':
        data = await apiPost('/api/generate', {
          length: parseInt(elements.lengthSlider.value),
          includeUppercase: elements.uppercaseCheck.checked,
          includeLowercase: elements.lowercaseCheck.checked,
          includeNumbers: elements.numbersCheck.checked,
          includeSymbols: elements.symbolsCheck.checked,
          excludeAmbiguous: elements.excludeAmbiguousCheck.checked
        });
        break;
      case 'memorable':
        data = await apiPost('/api/generate-memorable', {
          wordCount: parseInt(elements.wordCountSlider.value),
          separator: elements.separatorSelect.value,
          capitalize: elements.capitalizeCheck.checked,
          includeNumber: elements.includeNumberCheck.checked
        });
        break;
      case 'pin':
        data = await apiPost('/api/generate-pin', {
          length: parseInt(elements.pinLengthSlider.value)
        });
        break;
    }
    displayPassword(data.password, data.strength);
    addToHistory(data.password, currentType);
  } catch (error) {
    console.error('Generate failed:', error);
    showToast(t('genFailed') + ': ' + error.message, 'error');
  }
}

function displayPassword(password, strength) {
  elements.generatedPassword.textContent = password;

  if (strength) {
    elements.strengthFill.className = 'strength-fill ' + strength.level;
    elements.strengthFill.style.width = strength.score + '%';

    const levelKey = { weak: 'strengthWeak', medium: 'strengthMedium', strong: 'strengthStrong' };
    elements.strengthText.textContent = `${t('strengthPrefix')}: ${t(levelKey[strength.level])} (${strength.score}/100)`;
    elements.strengthText.style.color =
      strength.level === 'strong' ? '#059669' :
      strength.level === 'medium' ? '#d97706' :
      '#dc2626';
  } else {
    elements.strengthFill.className = 'strength-fill';
    elements.strengthFill.style.width = '0%';
    elements.strengthText.textContent = '';
  }
}

function copyPassword() {
  const password = elements.generatedPassword.textContent;
  if (password === t('clickToStart')) {
    showToast(t('generateFirst'), 'error');
    return;
  }
  navigator.clipboard.writeText(password).then(() => {
    showToast(t('copied'), 'success');
  }).catch(() => {
    showToast(t('copyFailed'), 'error');
  });
}

function addToHistory(password, type) {
  const timestamp = new Date().toLocaleString(currentLang === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });
  passwordHistory.unshift({ password, type, timestamp, id: Date.now() });
  if (passwordHistory.length > 20) {
    passwordHistory = passwordHistory.slice(0, 20);
  }
  localStorage.setItem('passwordHistory', JSON.stringify(passwordHistory));
  renderHistory();
}

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
}

function renderHistory() {
  if (passwordHistory.length === 0) {
    elements.historyList.innerHTML = `
            <div class="empty">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="empty-icon">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                <p>${t('noHistory')}</p>
            </div>`;
    return;
  }

  const typeKeyMap = {
    random: 'typeRandomShort',
    memorable: 'typeMemorableShort',
    pin: 'typePinShort'
  };

  elements.historyList.innerHTML = passwordHistory.map(item => {
    const escaped = escapeHtml(item.password);
    return `
            <div class="history-item">
                <div class="history-header">
                    <span class="history-type ${item.type}">${t(typeKeyMap[item.type])}</span>
                </div>
                <div class="history-password">${escaped}</div>
                <div class="history-footer">
                    <span class="history-time">${item.timestamp}</span>
                    <div class="history-actions">
                        <button class="history-btn" data-action="copy" data-password="${escaped}">${t('historyCopy')}</button>
                        <button class="history-btn" data-action="delete" data-id="${item.id}">${t('historyDelete')}</button>
                    </div>
                </div>
            </div>`;
  }).join('');
}

function copyHistoryPassword(password) {
  navigator.clipboard.writeText(password).then(() => {
    showToast(t('historyCopied'), 'success');
  }).catch(() => {
    showToast(t('historyCopyFailed'), 'error');
  });
}

function deleteHistoryItem(id) {
  passwordHistory = passwordHistory.filter(item => item.id !== id);
  localStorage.setItem('passwordHistory', JSON.stringify(passwordHistory));
  renderHistory();
  showToast(t('deleted'), 'success');
}

function clearHistory() {
  if (passwordHistory.length === 0) {
    showToast(t('historyEmpty'), 'error');
    return;
  }
  if (confirm(t('confirmClear'))) {
    passwordHistory = [];
    localStorage.removeItem('passwordHistory');
    renderHistory();
    showToast(t('historyCleared'), 'success');
  }
}

function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

document.addEventListener('DOMContentLoaded', init);

// 配置
const API_BASE_URL = window.location.origin;

// 状态管理
let currentType = 'random';
let passwordHistory = JSON.parse(localStorage.getItem('passwordHistory')) || [];

// DOM元素
const elements = {
    typeBtns: document.querySelectorAll('.type-btn'),
    randomConfig: document.getElementById('random-config'),
    memorableConfig: document.getElementById('memorable-config'),
    pinConfig: document.getElementById('pin-config'),

    lengthSlider: document.getElementById('length'),
    lengthValue: document.querySelector('#random-config .slider-value'),
    uppercaseCheck: document.getElementById('uppercase'),
    lowercaseCheck: document.getElementById('lowercase'),
    numbersCheck: document.getElementById('numbers'),
    symbolsCheck: document.getElementById('symbols'),
    excludeAmbiguousCheck: document.getElementById('excludeAmbiguous'),

    wordCountSlider: document.getElementById('wordCount'),
    wordCountValue: document.querySelector('#memorable-config .slider-value'),
    capitalizeCheck: document.getElementById('capitalize'),
    includeNumberCheck: document.getElementById('includeNumber'),
    separatorSelect: document.getElementById('separator'),

    pinLengthSlider: document.getElementById('pinLength'),
    pinLengthValue: document.querySelector('#pin-config .slider-value'),

    generatedPassword: document.getElementById('generatedPassword'),
    strengthFill: document.getElementById('strengthFill'),
    strengthText: document.getElementById('strengthText'),

    generateBtn: document.getElementById('generateBtn'),
    copyBtn: document.getElementById('copyBtn'),
    copyBtnLarge: document.getElementById('copyBtnLarge'),
    clearHistoryBtn: document.getElementById('clearHistory'),

    historyList: document.getElementById('historyList')
};

// 初始化
function init() {
    setupEventListeners();
    renderHistory();
    generatePassword();
}

// 设置事件监听器
function setupEventListeners() {
    // 类型切换
    elements.typeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentType = btn.dataset.type;
            updateActiveType(btn);
            showConfigSection(currentType);
            generatePassword();
        });
    });

    // 滑块值更新
    elements.lengthSlider.addEventListener('input', (e) => {
        elements.lengthValue.textContent = e.target.value;
    });

    elements.wordCountSlider.addEventListener('input', (e) => {
        elements.wordCountValue.textContent = e.target.value;
    });

    elements.pinLengthSlider.addEventListener('input', (e) => {
        elements.pinLengthValue.textContent = e.target.value;
    });

    // 配置变化时自动生成
    const autoGenerateElements = [
        elements.lengthSlider,
        elements.uppercaseCheck,
        elements.lowercaseCheck,
        elements.numbersCheck,
        elements.symbolsCheck,
        elements.excludeAmbiguousCheck,
        elements.wordCountSlider,
        elements.capitalizeCheck,
        elements.includeNumberCheck,
        elements.separatorSelect,
        elements.pinLengthSlider
    ];

    autoGenerateElements.forEach(el => {
        if (el) {
            el.addEventListener('change', () => generatePassword());
        }
    });

    // 按钮事件
    elements.generateBtn.addEventListener('click', () => generatePassword());
    elements.copyBtn.addEventListener('click', () => copyPassword());
    elements.copyBtnLarge.addEventListener('click', () => copyPassword());
    elements.clearHistoryBtn.addEventListener('click', () => clearHistory());
}

// 更新激活的类型按钮
function updateActiveType(activeBtn) {
    elements.typeBtns.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

// 显示对应的配置区域
function showConfigSection(type) {
    elements.randomConfig.classList.add('hidden');
    elements.memorableConfig.classList.add('hidden');
    elements.pinConfig.classList.add('hidden');

    switch (type) {
        case 'random':
            elements.randomConfig.classList.remove('hidden');
            break;
        case 'memorable':
            elements.memorableConfig.classList.remove('hidden');
            break;
        case 'pin':
            elements.pinConfig.classList.remove('hidden');
            break;

    }
}

// 生成密码
async function generatePassword() {
    try {
        let password, strength;

        switch (currentType) {
            case 'random':
                ({ password, strength } = await generateRandomPassword());
                break;
            case 'memorable':
                ({ password, strength } = await generateMemorablePassword());
                break;
            case 'pin':
                ({ password } = await generatePINPassword());
                strength = null;
                break;
        }

        displayPassword(password, strength);
        addToHistory(password, currentType);

    } catch (error) {
        console.error('生成密码失败:', error);
        showToast('生成密码失败，请重试', 'error');
    }
}

// 生成随机密码
async function generateRandomPassword() {
    const options = {
        length: parseInt(elements.lengthSlider.value),
        includeUppercase: elements.uppercaseCheck.checked,
        includeLowercase: elements.lowercaseCheck.checked,
        includeNumbers: elements.numbersCheck.checked,
        includeSymbols: elements.symbolsCheck.checked,
        excludeAmbiguous: elements.excludeAmbiguousCheck.checked
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(options)
        });

        const data = await response.json();

        if (data.success) {
            return {
                password: data.password,
                strength: data.strength
            };
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        return generateRandomPasswordLocal(options);
    }
}

// 本地生成随机密码
function generateRandomPasswordLocal(options) {
    const {
        length,
        includeUppercase,
        includeLowercase,
        includeNumbers,
        includeSymbols,
        excludeAmbiguous
    } = options;

    let charset = '';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const ambiguous = 'il1Lo0O';

    let requiredChars = [];

    if (includeLowercase) {
        let chars = lowercase;
        if (excludeAmbiguous) {
            chars = chars.split('').filter(c => !ambiguous.includes(c)).join('');
        }
        charset += chars;
        requiredChars.push(chars[getRandomInt(chars.length)]);
    }

    if (includeUppercase) {
        let chars = uppercase;
        if (excludeAmbiguous) {
            chars = chars.split('').filter(c => !ambiguous.includes(c)).join('');
        }
        charset += chars;
        requiredChars.push(chars[getRandomInt(chars.length)]);
    }

    if (includeNumbers) {
        let chars = numbers;
        if (excludeAmbiguous) {
            chars = chars.split('').filter(c => !ambiguous.includes(c)).join('');
        }
        charset += chars;
        requiredChars.push(chars[getRandomInt(chars.length)]);
    }

    if (includeSymbols) {
        charset += symbols;
        requiredChars.push(symbols[getRandomInt(symbols.length)]);
    }

    if (charset.length === 0) {
        throw new Error('至少需要选择一种字符类型');
    }

    let password = requiredChars.join('');

    for (let i = password.length; i < length; i++) {
        password += charset[getRandomInt(charset.length)];
    }

    password = shuffleString(password);
    const strength = calculateStrength(password);

    return { password, strength };
}

// 生成易记密码
async function generateMemorablePassword() {
    const options = {
        wordCount: parseInt(elements.wordCountSlider.value),
        separator: elements.separatorSelect.value,
        capitalize: elements.capitalizeCheck.checked,
        includeNumber: elements.includeNumberCheck.checked
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/generate-memorable`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(options)
        });

        const data = await response.json();

        if (data.success) {
            return {
                password: data.password,
                strength: data.strength
            };
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        return generateMemorablePasswordLocal(options);
    }
}

// 本地生成易记密码
function generateMemorablePasswordLocal(options) {
    const { wordCount, separator, capitalize, includeNumber } = options;

    const words = [
        'apple', 'banana', 'cherry', 'dragon', 'eagle', 'forest', 'garden', 'happy',
        'island', 'jungle', 'kitten', 'lemon', 'mountain', 'nature', 'ocean', 'planet',
        'queen', 'river', 'sunset', 'tiger', 'umbrella', 'valley', 'winter', 'yellow',
        'zebra', 'anchor', 'bridge', 'castle', 'diamond', 'energy', 'falcon', 'galaxy',
        'harbor', 'iceberg', 'jasmine', 'kingdom', 'lantern', 'meadow', 'nebula', 'orchid'
    ];

    let password = [];

    for (let i = 0; i < wordCount; i++) {
        let word = words[getRandomInt(words.length)];
        if (capitalize) {
            word = word.charAt(0).toUpperCase() + word.slice(1);
        }
        password.push(word);
    }

    if (includeNumber) {
        password.push((getRandomInt(900) + 100).toString());
    }

    const finalPassword = password.join(separator);
    const strength = calculateStrength(finalPassword);

    return { password: finalPassword, strength };
}

// 生成PIN码
async function generatePINPassword() {
    const length = parseInt(elements.pinLengthSlider.value);

    try {
        const response = await fetch(`${API_BASE_URL}/api/generate-pin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ length })
        });

        const data = await response.json();

        if (data.success) {
            return { password: data.password };
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        return generatePINPasswordLocal(length);
    }
}

// 本地生成PIN码
function generatePINPasswordLocal(length) {
    let pin = '';
    for (let i = 0; i < length; i++) {
        pin += getRandomInt(10).toString();
    }
    return { password: pin };
}

// 计算密码强度
function calculateStrength(password) {
    let strength = 0;
    const checks = {
        length: password.length >= 12,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        numbers: /[0-9]/.test(password),
        symbols: /[^a-zA-Z0-9]/.test(password),
        longLength: password.length >= 16
    };

    strength += checks.length ? 20 : 0;
    strength += checks.lowercase ? 15 : 0;
    strength += checks.uppercase ? 15 : 0;
    strength += checks.numbers ? 15 : 0;
    strength += checks.symbols ? 20 : 0;
    strength += checks.longLength ? 15 : 0;

    let level = 'weak';
    if (strength >= 80) level = 'strong';
    else if (strength >= 60) level = 'medium';

    return { score: strength, level, checks };
}

// 显示密码
function displayPassword(password, strength) {
    elements.generatedPassword.textContent = password;

    if (strength) {
        elements.strengthFill.className = 'strength-fill ' + strength.level;

        const levelText = {
            weak: '弱 - 建议增加长度和复杂度',
            medium: '中等 - 可以使用，建议更强',
            strong: '强 - 非常安全'
        };

        elements.strengthText.textContent = `密码强度: ${levelText[strength.level]} (${strength.score}/100)`;
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

// 复制密码
function copyPassword() {
    const password = elements.generatedPassword.textContent;

    if (password === '点击"生成密码"开始') {
        showToast('请先生成密码', 'error');
        return;
    }

    navigator.clipboard.writeText(password).then(() => {
        showToast('✓ 密码已复制到剪贴板', 'success');
    }).catch(err => {
        console.error('复制失败:', err);
        showToast('复制失败，请手动复制', 'error');
    });
}

// 添加到历史记录
function addToHistory(password, type) {
    const timestamp = new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });

    const historyItem = {
        password,
        type,
        timestamp,
        id: Date.now()
    };

    passwordHistory.unshift(historyItem);

    if (passwordHistory.length > 20) {
        passwordHistory = passwordHistory.slice(0, 20);
    }

    localStorage.setItem('passwordHistory', JSON.stringify(passwordHistory));
    renderHistory();
}

// 渲染历史记录
// 渲染历史记录
function renderHistory() {
  if (passwordHistory.length === 0) {
    elements.historyList.innerHTML = `
      <div class="empty">
        <div class="empty-icon">📋</div>
        <p>暂无历史记录</p>
      </div>
    `;
    return;
  }
  
  const typeLabels = {
    random: '随机',
    memorable: '易记',
    pin: 'PIN'
  };
  
  elements.historyList.innerHTML = passwordHistory.map(item => {
    // 转义 HTML 特殊字符，防止 XSS 和显示问题
    const escapedPassword = escapeHtml(item.password);
    // 用于 onclick 的密码需要转义单引号
    const escapedForJs = item.password.replace(/'/g, "\\'");
    
    return `
      <div class="history-item">
        <div class="history-header">
          <span class="history-type ${item.type}">${typeLabels[item.type]}</span>
        </div>
        <div class="history-password">${escapedPassword}</div>
        <div class="history-footer">
          <span class="history-time">${item.timestamp}</span>
          <div class="history-actions">
            <button class="history-btn" onclick="copyHistoryPassword('${escapedForJs}')">
              复制
            </button>
            <button class="history-btn" onclick="deleteHistoryItem(${item.id})">
              删除
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// HTML 转义函数
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// 复制历史密码
function copyHistoryPassword(password) {
    navigator.clipboard.writeText(password).then(() => {
        showToast('✓ 密码已复制', 'success');
    }).catch(err => {
        console.error('复制失败:', err);
        showToast('复制失败', 'error');
    });
}

// 删除历史记录项
function deleteHistoryItem(id) {
    passwordHistory = passwordHistory.filter(item => item.id !== id);
    localStorage.setItem('passwordHistory', JSON.stringify(passwordHistory));
    renderHistory();
    showToast('✓ 已删除', 'success');
}

// 清除所有历史
function clearHistory() {
    if (passwordHistory.length === 0) {
        showToast('历史记录已为空', 'error');
        return;
    }

    if (confirm('确定要清除所有历史记录吗？')) {
        passwordHistory = [];
        localStorage.removeItem('passwordHistory');
        renderHistory();
        showToast('✓ 历史记录已清除', 'success');
    }
}

// 显示提示消息
function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// 工具函数：生成随机整数
function getRandomInt(max, min = 0) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return min + (array[0] % (max - min));
}

// 工具函数：打乱字符串
function shuffleString(str) {
    const arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = getRandomInt(i + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3001;

// 安全中间件
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// 密码生成器类
class PasswordGenerator {
  constructor() {
    this.lowercase = 'abcdefghijklmnopqrstuvwxyz';
    this.uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.numbers = '0123456789';
    this.symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    this.ambiguous = 'il1Lo0O';
  }

  generate(options) {
    const {
      length = 16,
      includeUppercase = true,
      includeLowercase = true,
      includeNumbers = true,
      includeSymbols = true,
      excludeAmbiguous = false
    } = options;

    let charset = '';
    let password = '';
    let requiredChars = [];

    if (includeLowercase) {
      let chars = this.lowercase;
      if (excludeAmbiguous) {
        chars = chars.split('').filter(c => !this.ambiguous.includes(c)).join('');
      }
      charset += chars;
      requiredChars.push(chars[this.getRandomInt(chars.length)]);
    }

    if (includeUppercase) {
      let chars = this.uppercase;
      if (excludeAmbiguous) {
        chars = chars.split('').filter(c => !this.ambiguous.includes(c)).join('');
      }
      charset += chars;
      requiredChars.push(chars[this.getRandomInt(chars.length)]);
    }

    if (includeNumbers) {
      let chars = this.numbers;
      if (excludeAmbiguous) {
        chars = chars.split('').filter(c => !this.ambiguous.includes(c)).join('');
      }
      charset += chars;
      requiredChars.push(chars[this.getRandomInt(chars.length)]);
    }

    if (includeSymbols) {
      charset += this.symbols;
      requiredChars.push(this.symbols[this.getRandomInt(this.symbols.length)]);
    }

    if (charset.length === 0) {
      throw new Error('至少需要选择一种字符类型');
    }

    password = requiredChars.join('');

    for (let i = password.length; i < length; i++) {
      password += charset[this.getRandomInt(charset.length)];
    }

    password = this.shuffleString(password);
    return password;
  }

  generateMemorable(options) {
    const { wordCount = 4, separator = '-', capitalize = true, includeNumber = true } = options;
    
    const words = [
      'apple', 'banana', 'cherry', 'dragon', 'eagle', 'forest', 'garden', 'happy',
      'island', 'jungle', 'kitten', 'lemon', 'mountain', 'nature', 'ocean', 'planet',
      'queen', 'river', 'sunset', 'tiger', 'umbrella', 'valley', 'winter', 'yellow',
      'zebra', 'anchor', 'bridge', 'castle', 'diamond', 'energy', 'falcon', 'galaxy'
    ];

    let password = [];
    for (let i = 0; i < wordCount; i++) {
      let word = words[this.getRandomInt(words.length)];
      if (capitalize) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
      password.push(word);
    }

    if (includeNumber) {
      password.push(this.getRandomInt(100, 999).toString());
    }

    return password.join(separator);
  }

  generatePIN(length = 6) {
    let pin = '';
    for (let i = 0; i < length; i++) {
      pin += this.getRandomInt(10).toString();
    }
    return pin;
  }

  calculateStrength(password) {
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

  getRandomInt(max, min = 0) {
    const range = max - min;
    const bytesNeeded = Math.ceil(Math.log2(range) / 8);
    const maxValue = Math.pow(256, bytesNeeded);
    const randomBytes = crypto.randomBytes(bytesNeeded);
    let randomValue = 0;
    
    for (let i = 0; i < bytesNeeded; i++) {
      randomValue = randomValue * 256 + randomBytes[i];
    }
    
    randomValue = randomValue % range;
    return min + randomValue;
  }

  shuffleString(str) {
    const arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = this.getRandomInt(i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
  }
}

const generator = new PasswordGenerator();

// API 路由
app.post('/api/generate', (req, res) => {
  try {
    const password = generator.generate(req.body);
    const strength = generator.calculateStrength(password);
    
    res.json({
      success: true,
      password,
      strength
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/generate-memorable', (req, res) => {
  try {
    const password = generator.generateMemorable(req.body);
    const strength = generator.calculateStrength(password);
    
    res.json({
      success: true,
      password,
      strength
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/generate-pin', (req, res) => {
  try {
    const { length = 6 } = req.body;
    const pin = generator.generatePIN(length);
    
    res.json({
      success: true,
      password: pin
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/check-strength', (req, res) => {
  try {
    const { password } = req.body;
    const strength = generator.calculateStrength(password);
    
    res.json({
      success: true,
      strength
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// 主页路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🔐 企业级密码生成器运行在: http://localhost:${PORT}`);
});
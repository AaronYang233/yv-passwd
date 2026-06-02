const crypto = require('crypto');
const config = require('./config');

class PasswordGenerator {
  /**
   * 无偏随机整数 [min, max)，使用拒绝采样消除模偏差
   */
  getRandomInt(max, min = 0) {
    const range = max - min;
    const limit = Math.floor(0x100000000 / range) * range;
    let value;
    do {
      value = crypto.randomBytes(4).readUInt32BE(0);
    } while (value >= limit);
    return min + (value % range);
  }

  /**
   * Fisher-Yates 洗牌
   */
  shuffleString(str) {
    const arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = this.getRandomInt(i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
  }

  filterAmbiguous(chars) {
    return chars.split('').filter(c => !config.charsets.ambiguous.includes(c)).join('');
  }

  /**
   * 生成随机密码
   */
  generate(options) {
    const {
      length = config.defaults.randomLength,
      includeUppercase = true,
      includeLowercase = true,
      includeNumbers = true,
      includeSymbols = true,
      excludeAmbiguous = false
    } = options;

    let charset = '';
    const requiredChars = [];

    if (includeLowercase) {
      let chars = config.charsets.lowercase;
      if (excludeAmbiguous) chars = this.filterAmbiguous(chars);
      charset += chars;
      requiredChars.push(chars[this.getRandomInt(chars.length)]);
    }

    if (includeUppercase) {
      let chars = config.charsets.uppercase;
      if (excludeAmbiguous) chars = this.filterAmbiguous(chars);
      charset += chars;
      requiredChars.push(chars[this.getRandomInt(chars.length)]);
    }

    if (includeNumbers) {
      let chars = config.charsets.numbers;
      if (excludeAmbiguous) chars = this.filterAmbiguous(chars);
      charset += chars;
      requiredChars.push(chars[this.getRandomInt(chars.length)]);
    }

    if (includeSymbols) {
      charset += config.charsets.symbols;
      requiredChars.push(config.charsets.symbols[this.getRandomInt(config.charsets.symbols.length)]);
    }

    if (charset.length === 0) {
      throw new Error('至少需要选择一种字符类型');
    }

    let password = requiredChars.join('');
    for (let i = password.length; i < length; i++) {
      password += charset[this.getRandomInt(charset.length)];
    }

    return this.shuffleString(password);
  }

  /**
   * 生成易记密码
   */
  generateMemorable(options) {
    const {
      wordCount = config.defaults.memorableWordCount,
      separator = config.defaults.separator,
      capitalize = true,
      includeNumber = true
    } = options;

    const password = [];
    for (let i = 0; i < wordCount; i++) {
      let word = config.words[this.getRandomInt(config.words.length)];
      if (capitalize) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
      password.push(word);
    }

    if (includeNumber) {
      password.push(this.getRandomInt(900, 100).toString());
    }

    return password.join(separator);
  }

  /**
   * 生成 PIN 码
   */
  generatePIN(length = config.defaults.pinLength) {
    let pin = '';
    for (let i = 0; i < length; i++) {
      pin += this.getRandomInt(10).toString();
    }
    return pin;
  }
}

module.exports = PasswordGenerator;

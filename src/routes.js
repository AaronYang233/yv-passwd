const express = require('express');
const router = express.Router();
const PasswordGenerator = require('./generator');
const calculateStrength = require('./strength');
const config = require('./config');

const generator = new PasswordGenerator();

// 通用参数校验
function validateNumber(value, min, max, fallback) {
  const n = parseInt(value, 10);
  if (isNaN(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

function validateBoolean(value, fallback) {
  return typeof value === 'boolean' ? value : fallback;
}

function validateString(value, allowed, fallback) {
  if (typeof value !== 'string' || !allowed.includes(value)) return fallback;
  return value;
}

// POST /api/generate
router.post('/generate', (req, res, next) => {
  try {
    const { defaults } = config;
    const password = generator.generate({
      length: validateNumber(req.body?.length, defaults.minRandomLength, defaults.maxRandomLength, defaults.randomLength),
      includeUppercase: validateBoolean(req.body?.includeUppercase, true),
      includeLowercase: validateBoolean(req.body?.includeLowercase, true),
      includeNumbers: validateBoolean(req.body?.includeNumbers, true),
      includeSymbols: validateBoolean(req.body?.includeSymbols, true),
      excludeAmbiguous: validateBoolean(req.body?.excludeAmbiguous, false)
    });
    res.json({ success: true, password, strength: calculateStrength(password) });
  } catch (err) {
    next(err);
  }
});

// POST /api/generate-memorable
router.post('/generate-memorable', (req, res, next) => {
  try {
    const { defaults } = config;
    const password = generator.generateMemorable({
      wordCount: validateNumber(req.body?.wordCount, defaults.minWordCount, defaults.maxWordCount, defaults.memorableWordCount),
      separator: validateString(req.body?.separator, ['-', '_', '.', ''], defaults.separator),
      capitalize: validateBoolean(req.body?.capitalize, true),
      includeNumber: validateBoolean(req.body?.includeNumber, true)
    });
    res.json({ success: true, password, strength: calculateStrength(password) });
  } catch (err) {
    next(err);
  }
});

// POST /api/generate-pin
router.post('/generate-pin', (req, res, next) => {
  try {
    const { defaults } = config;
    const length = validateNumber(req.body?.length, defaults.minPinLength, defaults.maxPinLength, defaults.pinLength);
    const pin = generator.generatePIN(length);
    res.json({ success: true, password: pin, strength: calculateStrength(pin) });
  } catch (err) {
    next(err);
  }
});

// POST /api/check-strength
router.post('/check-strength', (req, res) => {
  const password = req.body?.password;
  if (typeof password !== 'string' || password.length === 0) {
    return res.status(400).json({ success: false, error: '密码不能为空' });
  }
  res.json({ success: true, strength: calculateStrength(password) });
});

module.exports = router;

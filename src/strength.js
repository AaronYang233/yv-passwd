const config = require('./config');

/**
 * 基于信息熵的密码强度评估
 * entropy = length * log2(poolSize)
 * 加入模式惩罚（连续字符、重复字符）
 */
function calculateStrength(password) {
  if (!password || typeof password !== 'string') {
    return { score: 0, level: 'weak', checks: {}, entropy: 0 };
  }

  let poolSize = 0;
  const checks = {
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /[0-9]/.test(password),
    symbols: /[^a-zA-Z0-9]/.test(password)
  };

  if (checks.lowercase) poolSize += config.charsets.lowercase.length;
  if (checks.uppercase) poolSize += config.charsets.uppercase.length;
  if (checks.numbers) poolSize += config.charsets.numbers.length;
  if (checks.symbols) poolSize += config.charsets.symbols.length;

  // 信息熵计算
  const entropy = poolSize > 0 ? password.length * Math.log2(poolSize) : 0;
  let score = Math.min(100, Math.round(entropy));

  // 模式惩罚
  if (/(.)\1{2,}/.test(password)) score -= 15;
  if (/^(?:012|123|234|345|456|567|678|789)+/.test(password)) score -= 15;
  if (/^(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)+/i.test(password)) score -= 15;

  score = Math.max(0, score);

  let level = 'weak';
  if (score >= 70) level = 'strong';
  else if (score >= 40) level = 'medium';

  return { score, level, checks, entropy: Math.round(entropy * 10) / 10 };
}

module.exports = calculateStrength;

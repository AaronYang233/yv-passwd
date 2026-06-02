const config = {
  charsets: {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    ambiguous: 'il1Lo0O'
  },

  words: [
    'apple', 'banana', 'cherry', 'dragon', 'eagle', 'forest', 'garden', 'happy',
    'island', 'jungle', 'kitten', 'lemon', 'mountain', 'nature', 'ocean', 'planet',
    'queen', 'river', 'sunset', 'tiger', 'umbrella', 'valley', 'winter', 'yellow',
    'zebra', 'anchor', 'bridge', 'castle', 'diamond', 'energy', 'falcon', 'galaxy',
    'harbor', 'iceberg', 'jasmine', 'kingdom', 'lantern', 'meadow', 'nebula', 'orchid'
  ],

  defaults: {
    randomLength: 16,
    minRandomLength: 4,
    maxRandomLength: 128,
    memorableWordCount: 4,
    minWordCount: 2,
    maxWordCount: 8,
    pinLength: 6,
    minPinLength: 4,
    maxPinLength: 16,
    separator: '-'
  }
};

module.exports = config;

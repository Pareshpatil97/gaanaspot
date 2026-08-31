const { normalizeAnswer, levenshtein, matchAnswer } = require('../utils/answerMatcher');

describe('Answer Matcher Utils', () => {
  describe('normalizeAnswer', () => {
    it('should lowercase and trim', () => {
      expect(normalizeAnswer('  Hello World  ')).toBe('hello world');
    });

    it('should remove punctuation except hyphens', () => {
      expect(normalizeAnswer('Hello, World!')).toBe('hello world');
      expect(normalizeAnswer('Spider-Man 2')).toBe('spider-man 2');
    });

    it('should collapse multiple spaces', () => {
      expect(normalizeAnswer('A    B   C')).toBe('a b c');
    });

    it('should handle empty/undefined', () => {
      expect(normalizeAnswer('')).toBe('');
      expect(normalizeAnswer(undefined)).toBe('');
    });
  });

  describe('levenshtein', () => {
    it('should calculate correct distance', () => {
      expect(levenshtein('kitten', 'sitting')).toBe(3);
      expect(levenshtein('flaw', 'lawn')).toBe(2);
      expect(levenshtein('', 'abc')).toBe(3);
    });
  });

  describe('matchAnswer', () => {
    const title = 'Tum Hi Ho';
    const aliases = ['Tum Hi Ho Aashiqui 2', 'Meri Aashiqui'];

    it('should match exact string', () => {
      expect(matchAnswer('Tum Hi Ho', title, aliases)).toBe(true);
    });

    it('should match case insensitive', () => {
      expect(matchAnswer('tum hi ho', title, aliases)).toBe(true);
    });

    it('should match with extra spaces and punctuation', () => {
      expect(matchAnswer('  Tum   hi, ho! ', title, aliases)).toBe(true);
    });

    it('should match aliases', () => {
      expect(matchAnswer('Tum Hi Ho Aashiqui 2', title, aliases)).toBe(true);
      expect(matchAnswer('meri aashiqui', title, aliases)).toBe(true);
    });

    it('should match close misspelling (distance <= 2)', () => {
      expect(matchAnswer('Tum Hii Ho', title, aliases)).toBe(true); // distance 1
      expect(matchAnswer('Tmm Hi Ho', title, aliases)).toBe(true); // distance 1
    });

    it('should match close misspelling of alias', () => {
      expect(matchAnswer('meri ashiqui', title, aliases)).toBe(true);
    });

    it('should reject completely different song', () => {
      expect(matchAnswer('Chaiyya Chaiyya', title, aliases)).toBe(false);
      expect(matchAnswer('Tum', title, aliases)).toBe(false); // distance > 2
    });

    it('should handle edge cases', () => {
      expect(matchAnswer('', title, aliases)).toBe(false);
      expect(matchAnswer(undefined, title, aliases)).toBe(false);
    });
  });
});

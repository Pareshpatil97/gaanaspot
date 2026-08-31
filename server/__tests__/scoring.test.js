const gameService = require('../services/gameService');

// Mock Game Model with chainable .populate()
jest.mock('../models/Game', () => {
  const mockFindById = jest.fn();
  return {
    findById: mockFindById
  };
});
jest.mock('../utils/answerMatcher', () => ({
  matchAnswer: jest.fn()
}));
jest.mock('../services/audioProvider', () => ({
  getAudioUrl: jest.fn(),
  getArtworkUrl: jest.fn()
}));

const Game = require('../models/Game');
const { matchAnswer } = require('../utils/answerMatcher');

function mockFindByIdChain(resolvedValue) {
  Game.findById.mockReturnValue({
    populate: jest.fn().mockResolvedValue(resolvedValue)
  });
}

describe('Scoring Logic in GameService (4 Chances: 0.5s, 2s, 8s, 15s)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calculates score correctly for attempt 1 (1200 pts at 0.5s)', async () => {
    const mockGame = {
      _id: 'game123',
      completed: false,
      rounds: [
        { songId: { title: 'Kesariya', aliases: [] }, attempts: 0, guesses: [], correct: false, score: 0 }
      ],
      markModified: jest.fn(),
      save: jest.fn()
    };
    mockFindByIdChain(mockGame);
    matchAnswer.mockReturnValue(true);

    const result = await gameService.submitGuess('game123', 0, 'Kesariya');

    expect(result.correct).toBe(true);
    expect(result.score).toBe(1200);
    expect(result.attempts).toBe(1);
    expect(result.guessedAtDuration).toBe(0.5);
  });

  it('calculates score correctly for attempt 2 (800 pts at 2.0s)', async () => {
    const mockGame = {
      _id: 'game123',
      completed: false,
      rounds: [
        { songId: { title: 'Tum Hi Ho', aliases: [] }, attempts: 1, guesses: ['g1'], correct: false, score: 0 }
      ],
      markModified: jest.fn(),
      save: jest.fn()
    };
    mockFindByIdChain(mockGame);
    matchAnswer.mockReturnValue(true);

    const result = await gameService.submitGuess('game123', 0, 'Tum Hi Ho');

    expect(result.correct).toBe(true);
    expect(result.score).toBe(800);
    expect(result.attempts).toBe(2);
    expect(result.guessedAtDuration).toBe(2.0);
  });

  it('calculates score correctly for attempt 3 (500 pts at 8.0s)', async () => {
    const mockGame = {
      _id: 'game123',
      completed: false,
      rounds: [
        { songId: { title: 'Channa Mereya', aliases: [] }, attempts: 2, guesses: ['g1', 'g2'], correct: false, score: 0 }
      ],
      markModified: jest.fn(),
      save: jest.fn()
    };
    mockFindByIdChain(mockGame);
    matchAnswer.mockReturnValue(true);

    const result = await gameService.submitGuess('game123', 0, 'Channa Mereya');

    expect(result.correct).toBe(true);
    expect(result.score).toBe(500);
    expect(result.attempts).toBe(3);
    expect(result.guessedAtDuration).toBe(8.0);
  });

  it('calculates score correctly for attempt 4 (200 pts at 15.0s)', async () => {
    const mockGame = {
      _id: 'game123',
      completed: false,
      rounds: [
        { songId: { title: 'Kal Ho Naa Ho', aliases: [] }, attempts: 3, guesses: ['g1', 'g2', 'g3'], correct: false, score: 0 }
      ],
      markModified: jest.fn(),
      save: jest.fn()
    };
    mockFindByIdChain(mockGame);
    matchAnswer.mockReturnValue(true);

    const result = await gameService.submitGuess('game123', 0, 'Kal Ho Naa Ho');

    expect(result.correct).toBe(true);
    expect(result.score).toBe(200);
    expect(result.attempts).toBe(4);
    expect(result.guessedAtDuration).toBe(15.0);
  });

  it('assigns 0 points for a miss after 4 wrong attempts', async () => {
    const mockGame = {
      _id: 'game123',
      completed: false,
      rounds: [
        { songId: { title: 'Channa Mereya', aliases: [] }, attempts: 3, guesses: ['g1', 'g2', 'g3'], correct: false, score: 0 }
      ],
      markModified: jest.fn(),
      save: jest.fn()
    };
    mockFindByIdChain(mockGame);
    matchAnswer.mockReturnValue(false);

    const result = await gameService.submitGuess('game123', 0, 'Wrong Guess');

    expect(result.correct).toBe(false);
    expect(result.score).toBe(0);
    expect(result.attempts).toBe(4);
  });

  it('computes totalScore properly on completeGame', async () => {
    const mockGame = {
      _id: 'game123',
      completed: false,
      rounds: [
        { score: 1200 },
        { score: 800 },
        { score: 500 },
        { score: 200 },
        { score: 0 },
      ],
      save: jest.fn()
    };
    Game.findById.mockResolvedValue(mockGame);

    const result = await gameService.completeGame('game123');
    expect(result.completed).toBe(true);
    expect(result.totalScore).toBe(2700);
  });

  it('perfect game totals 6000', async () => {
    const mockGame = {
      _id: 'game123',
      completed: false,
      rounds: [
        { score: 1200 },
        { score: 1200 },
        { score: 1200 },
        { score: 1200 },
        { score: 1200 },
      ],
      save: jest.fn()
    };
    Game.findById.mockResolvedValue(mockGame);

    const result = await gameService.completeGame('game123');
    expect(result.totalScore).toBe(6000);
  });
});

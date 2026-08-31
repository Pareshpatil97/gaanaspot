const dailyService = require('../services/dailyService');
const Song = require('../models/Song');

// Mock Song model
jest.mock('../models/Song', () => ({
  find: jest.fn(),
  aggregate: jest.fn()
}));

describe('Daily Service (Progressive Difficulty Shuffle)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 5 progressive difficulty songs for a session', async () => {
    Song.aggregate.mockImplementation((pipeline) => {
      const match = pipeline[0]?.$match || {};
      const diff = match.difficulty || 1;
      return Promise.resolve([
        { _id: `id_${diff}`, title: `Song Level ${diff}`, difficulty: diff, isActive: true }
      ]);
    });

    const songs = await dailyService.getDailySongs();

    expect(songs).toHaveLength(5);
    expect(songs[0].difficulty).toBe(1);
    expect(songs[1].difficulty).toBe(2);
    expect(songs[2].difficulty).toBe(3);
    expect(songs[3].difficulty).toBe(4);
    expect(songs[4].difficulty).toBe(5);
  });
});

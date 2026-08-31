const dailyService = require('../services/dailyService');
const Song = require('../models/Song');

// Mock Song model
jest.mock('../models/Song', () => ({
  find: jest.fn()
}));

describe('Daily Service (Fresh Session Shuffle)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 5 random songs for a session', async () => {
    const mockSongs = Array.from({ length: 50 }, (_, i) => ({
      _id: `id${i}`,
      title: `Song ${i}`,
      isActive: true
    }));

    Song.find.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockSongs)
    });

    const songs1 = await dailyService.getDailySongs();
    const songs2 = await dailyService.getDailySongs();

    expect(songs1).toHaveLength(5);
    expect(songs2).toHaveLength(5);
  });

  it('should return all available songs if pool is less than 5', async () => {
    const mockSongs = [
      { _id: 'id1', title: 'Song 1', isActive: true },
      { _id: 'id2', title: 'Song 2', isActive: true }
    ];

    Song.find.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockSongs)
    });

    const songs = await dailyService.getDailySongs();

    expect(songs).toHaveLength(2);
  });
});

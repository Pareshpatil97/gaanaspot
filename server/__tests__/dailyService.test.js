const dailyService = require('../services/dailyService');
const Song = require('../models/Song');

jest.mock('../models/Song', () => ({
  find: jest.fn()
}));

describe('Daily Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return same 5 songs for the same date', async () => {
    const mockSongs = Array.from({ length: 50 }).map((_, i) => ({ _id: `id${i}`, title: `Song ${i}` }));
    Song.find.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockSongs)
    });

    const songsDay1Run1 = await dailyService.getDailySongs('2023-10-01');
    const songsDay1Run2 = await dailyService.getDailySongs('2023-10-01');

    expect(songsDay1Run1).toHaveLength(5);
    expect(songsDay1Run2).toHaveLength(5);
    expect(songsDay1Run1.map(s => s._id)).toEqual(songsDay1Run2.map(s => s._id));
  });

  it('should return different songs for different dates', async () => {
    const mockSongs = Array.from({ length: 50 }).map((_, i) => ({ _id: `id${i}`, title: `Song ${i}` }));
    Song.find.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockSongs)
    });

    const songsDay1 = await dailyService.getDailySongs('2023-01-15');
    const songsDay2 = await dailyService.getDailySongs('2023-07-20');

    // With 50 songs and different dates far apart, selections should differ
    expect(songsDay1.map(s => s._id)).not.toEqual(songsDay2.map(s => s._id));
  });

  it('should return exactly 5 songs', async () => {
    const mockSongs = Array.from({ length: 50 }).map((_, i) => ({ _id: `id${i}`, title: `Song ${i}` }));
    Song.find.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockSongs)
    });

    const songs = await dailyService.getDailySongs('2024-06-15');
    expect(songs).toHaveLength(5);
  });

  it('should return all songs if fewer than 5 available', async () => {
    const mockSongs = [{ _id: 'id1', title: 'Song 1' }, { _id: 'id2', title: 'Song 2' }];
    Song.find.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockSongs)
    });

    const songs = await dailyService.getDailySongs('2024-06-15');
    expect(songs).toHaveLength(2);
  });

  it('hashCode should produce consistent results', () => {
    const hash1 = dailyService._hashCode('2023-10-01');
    const hash2 = dailyService._hashCode('2023-10-01');
    const hash3 = dailyService._hashCode('2023-10-02');
    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(hash3);
  });
});

import { describe, expect } from '@jest/globals';
import LolApi from '../LolApi';

describe('LeagueOfLegendsApi Lib Tests', () => {
  it('should be return an array of champion names with the first index is "aatrox"', async () => {
    const lolApi = new LolApi();
    const championList = await lolApi.getChampionsList();

    expect(championList[0]).toBe('Aatrox');
  });
});

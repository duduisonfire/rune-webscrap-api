import RuneResponse from '../controllers/classes/RuneResponse';
import LolApi from '../domain/LolApi';
import RunePage from '../domain/RunePage';
import { UggDB } from '../models/UggModel';
import RuneWebScrap from './RuneWebScrap';

export default class RuneCacheSync {
  private async createChampionCache(champion: string, lane: string) {
    const uggCacheDb = new UggDB(champion, lane);
    const webScrap = new RuneWebScrap(champion, lane);
    await webScrap.selectRunesFromPage();
    const runesId = new RunePage(webScrap.runeList);
    const runeResponse = new RuneResponse(webScrap, runesId);
    await uggCacheDb.createChampionCache(runeResponse);
  }

  private async updateChampionCache(champion: string, lane: string) {
    const uggCacheDb = new UggDB(champion, lane);
    const webScrap = new RuneWebScrap(champion, lane);
    await webScrap.selectRunesFromPage();
    const runesId = new RunePage(webScrap.runeList);
    const runeResponse = new RuneResponse(webScrap, runesId);
    await uggCacheDb.updateChampionCache(runeResponse);
  }

  async createAllRunesCache() {
    const lolApi = new LolApi();
    const championList = await lolApi.getChampionsList();

    for (let index = 0; index < championList.length; index++) {
      await this.createChampionCache(championList[index], 'mid');
      await this.createChampionCache(championList[index], 'top');
      await this.createChampionCache(championList[index], 'jungle');
      await this.createChampionCache(championList[index], 'adc');
      await this.createChampionCache(championList[index], 'support');

      console.log(`Synced ${championList[index]} runes cache.`);
    }
  }

  async updateAllRunesCache() {
    const lolApi = new LolApi();
    const championList = await lolApi.getChampionsList();

    for (let index = 0; index < championList.length; index++) {
      await this.updateChampionCache(championList[index], 'mid');
      await this.updateChampionCache(championList[index], 'top');
      await this.updateChampionCache(championList[index], 'jungle');
      await this.updateChampionCache(championList[index], 'adc');
      await this.updateChampionCache(championList[index], 'support');

      console.log(`Synced ${championList[index]} runes cache.`);
    }
  }
}

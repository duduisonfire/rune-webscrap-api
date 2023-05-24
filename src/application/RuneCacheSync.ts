import RuneResponse from '../controllers/classes/RuneResponse';
import LolApi from '../domain/LolApi';
import RunePage from '../domain/RunePage';
import { UggDB } from '../models/UggModel';
import RuneWebScrap from './RuneWebScrap';

export default class RuneCacheSync {
  private async updateChampionCache(champion: string, lane: string) {
    try {
      const uggCacheDb = new UggDB(champion, lane);
      const webScrap = new RuneWebScrap(champion, lane);
      await webScrap.selectRunesFromPage();
      const runesId = new RunePage(webScrap.runeList);
      const runeResponse = new RuneResponse(webScrap, runesId);

      const championCacheExists = await uggCacheDb.championCacheExists();

      if (championCacheExists) {
        await uggCacheDb.updateChampionCache(runeResponse);
        console.log(`The runes of ${champion} in ${lane} are updated.`);
        return;
      }

      await uggCacheDb.createChampionCache(runeResponse);
      console.log(`The runes of ${champion} in ${lane} are created.`);
    } catch (e) {
      console.log("The u.gg website is experiencing problems and we can't get runes data.");
      return e;
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

      console.log(`Updated ${championList[index]} runes cache.`);
    }
  }
}

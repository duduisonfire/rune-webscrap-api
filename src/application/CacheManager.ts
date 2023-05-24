import RuneCacheSync from './RuneCacheSync';
import LolApi from '../domain/LolApi';
import { UggDB } from '../models/UggModel';

export default class CacheManager {
  hasCache = false;

  async initialSyncCache() {
    const runeCacheSync = new RuneCacheSync();

    runeCacheSync.updateAllRunesCache();
  }

  async syncCache() {
    const runeCacheSync = new RuneCacheSync();

    runeCacheSync.updateAllRunesCache();
  }

  async verifyCache(): Promise<boolean | unknown> {
    try {
      const lolApi = new LolApi();
      const championListLength = (await lolApi.getChampionsList()).length;
      const db = new UggDB('ahri', 'mid');

      const haveCache =
        ((await db.championRunesCacheLength()) as number) / 5 === championListLength;

      return haveCache;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}

import LolApi from '../domain/LolApi';
import { UggDB } from '../models/UggModel';
import RuneCacheSync from './RuneCacheSync';

export default class CacheManager {
  hasCache = false;

  async verifyCache() {
    const lolApi = new LolApi();
    const ugg = new UggDB('any', 'any');
    const championList = await lolApi.getChampionsList();
    const runesCacheLength = await ugg.championRunesCacheLength();
    this.hasCache = championList.length * 5 === runesCacheLength;

    return this.hasCache;
  }

  async initialSyncCache() {
    const runeCacheSync = new RuneCacheSync();
    const hasCache = await this.verifyCache();

    if (!hasCache) {
      runeCacheSync.createAllRunesCache();
    }
  }

  async syncCache() {
    const runeCacheSync = new RuneCacheSync();
    const hasCache = await this.verifyCache();

    if (hasCache) {
      runeCacheSync.updateAllRunesCache();
      return;
    }

    runeCacheSync.createAllRunesCache();
  }
}

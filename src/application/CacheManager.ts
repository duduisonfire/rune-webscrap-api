import RuneCacheSync from './RuneCacheSync';

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
}

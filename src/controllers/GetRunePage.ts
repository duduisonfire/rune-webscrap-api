import express from 'express';
import RuneWebScrap from '../application/RuneWebScrap';
import RunePage from '../domain/RunePage';
import RuneResponse from './classes/RuneResponse';
import { UggDB } from '../models/UggModel';

class GetRunePages {
  async getUggRunes(
    req: express.Request,
    res: express.Response,
  ): Promise<express.Response<unknown, Record<string, unknown>> | undefined> {
    const uggCacheDb = new UggDB(req.params.champion, req.params.lane);

    try {
      let championCache = await uggCacheDb.championCacheExists();

      if (!championCache) {
        const webScrap = new RuneWebScrap(req.params.champion, req.params.lane);
        await webScrap.selectRunesFromPage();
        const runesId = new RunePage(webScrap.runeList);
        const runeResponse = new RuneResponse(webScrap, runesId);
        championCache = await uggCacheDb.createChampionCache(runeResponse);
      }

      return res.status(200).json(championCache);
    } catch (e) {
      return res.status(400).json(`${e}`);
    }
  }
}

export default new GetRunePages();

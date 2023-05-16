import express from 'express';
import RuneWebScrap from '../application/RuneWebScrap';
import RunePage from '../domain/RunePage';

class GetRunePages {
  async getUggRunes(
    req: express.Request,
    res: express.Response,
  ): Promise<express.Response<unknown, Record<string, unknown>> | undefined> {
    try {
      const webScrap = new RuneWebScrap(req.params.champion, req.params.lane);
      await webScrap.selectRunesFromPage();
      const runesId = new RunePage(webScrap.runeList, req.params.champion, req.params.lane);

      return res.status(200).json({
        champion: webScrap.champion,
        lane: webScrap.lane,
        runes: webScrap.runeList,
        runesId,
      });
    } catch (e) {
      return res.status(400).json({
        error: `You have not entered the correct parameters in your request, please choose a valid champion and lane. ${e}`,
      });
    }
  }
}

export default new GetRunePages();

import RuneWebScrap from '../../application/RuneWebScrap';
import RunePage from '../../domain/RunePage';
import IRunesResponse from '../interfaces/IRunesResponse';

export default class RuneResponse implements IRunesResponse {
  champion: string;
  lane: string;
  runes: string[];
  runesId: RunePage;

  constructor(webScrap: RuneWebScrap, runePage: RunePage) {
    this.champion = webScrap.champion;
    this.lane = webScrap.lane;
    this.runes = webScrap.runeList;
    this.runesId = runePage;
  }
}

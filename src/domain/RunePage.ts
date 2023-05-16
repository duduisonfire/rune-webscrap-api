import runesParseTable from './RunesParseTable';
import IRunePage from './interfaces/IRunePage';

export default class RunePage implements IRunePage {
  public primaryStyleId: number;
  public subStyleId: number;
  public selectedPerkIds: number[] = [];

  constructor(runes: string[], public championName: string, public role: string) {
    this.primaryStyleId = runesParseTable[runes[0]];
    this.subStyleId = runesParseTable[runes[1]];

    for (let index = 2; index < 11; index++) {
      this.selectedPerkIds.push(runesParseTable[runes[index]]);
    }
  }
}

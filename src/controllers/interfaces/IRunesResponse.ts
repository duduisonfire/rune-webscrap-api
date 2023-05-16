import RunePage from '../../domain/RunePage';

export default interface IRunesResponse {
  champion: string;
  lane: string;
  runes: string[];
  runesId: RunePage;
}

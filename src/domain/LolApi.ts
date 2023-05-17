import axios from 'axios';
import IChampionsObject from '../domain/interfaces/IChampionsObject';

export default class LolApi {
  private async getLolVersion() {
    const response = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json');
    const responseData = response.data as Array<string>;
    const version = responseData[0];
    return version;
  }

  async getChampionsList() {
    const response = await axios.get(
      `https://ddragon.leagueoflegends.com/cdn/${await this.getLolVersion()}/data/en_US/champion.json`,
    );
    const championsObject = response.data.data as IChampionsObject;
    const championList = Object.keys(championsObject);

    return championList;
  }
}

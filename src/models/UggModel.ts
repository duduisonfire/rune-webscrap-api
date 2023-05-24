import mongoose from 'mongoose';
import RuneResponse from '../controllers/classes/RuneResponse';

const uggSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 30 },
  champion: { type: String, required: true },
  lane: { type: String, required: true },
  runes: { type: Array, required: true },
  runesId: { type: Object, required: true },
});

const uggModel = mongoose.model('UggRunesCache', uggSchema);

export class UggDB {
  constructor(private champion: string, private lane: string) {}

  async createChampionCache(response: RuneResponse): Promise<mongoose.DocumentSetOptions | Error> {
    try {
      const championCache = await uggModel.findOne({
        champion: this.champion.replace(
          response.champion.charAt(0),
          response.champion.charAt(0).toUpperCase(),
        ),
        lane: this.lane,
      });

      if (championCache) return championCache;

      const cacheExists = await uggModel.create(response);
      return cacheExists;
    } catch (e) {
      const error = new Error('Our database is currently experiencing instabilities.');

      console.log(e);

      return error;
    }
  }

  async updateChampionCache(response: RuneResponse) {
    try {
      const championCache = await uggModel.findOneAndUpdate(
        { champion: this.champion, lane: this.lane },
        { ...response, createdAt: Date.now() },
      );

      return championCache;
    } catch (e) {
      const error = new Error('Our database is currently experiencing instabilities.');

      console.log(e);

      return error;
    }
  }

  async championCacheExists(): Promise<false | mongoose.DocumentSetOptions | Error> {
    try {
      const championCache = await uggModel.findOne({
        champion: this.champion.replace(
          this.champion.charAt(0),
          this.champion.charAt(0).toUpperCase(),
        ),
        lane: this.lane,
      });

      if (championCache) return championCache;

      return false;
    } catch (e) {
      const error = new Error('Our database is currently experiencing instabilities.');

      console.log(e);

      return error;
    }
  }

  async championRunesCacheLength(): Promise<number | Error> {
    try {
      const length = await uggModel.countDocuments();

      return length;
    } catch (e) {
      const error = new Error('Our database is currently experiencing instabilities.');

      console.log(e);

      return error;
    }
  }
}

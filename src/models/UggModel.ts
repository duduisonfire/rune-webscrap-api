import mongoose from 'mongoose';
import RuneResponse from '../controllers/classes/RuneResponse';

const uggSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 },
  champion: { type: String, required: true },
  lane: { type: String, required: true, unique: true },
  runes: { type: Array, required: true },
  runesId: { type: Object, required: true },
});

const uggModel = mongoose.model('UggRunesCache', uggSchema);

export class UggDB {
  constructor(private champion: string, private lane: string) {}

  async createChampionCache(response: RuneResponse): Promise<mongoose.DocumentSetOptions> {
    const championCache = await uggModel.findOne({
      champion: this.champion.replace(
        response.champion.charAt(0),
        response.champion.charAt(0).toUpperCase(),
      ),
      lane: this.lane,
    });

    if (championCache) {
      return championCache;
    }

    const cacheExists = await uggModel.create(response);
    return cacheExists;
  }

  async updateChampionCache(response: RuneResponse) {
    const championCache = await uggModel.findOneAndUpdate(
      { champion: this.champion, lane: this.lane },
      response,
    );

    return championCache;
  }

  async championCacheExists(): Promise<false | mongoose.DocumentSetOptions> {
    const championCache = await uggModel.findOne({
      champion: this.champion.replace(
        this.champion.charAt(0),
        this.champion.charAt(0).toUpperCase(),
      ),
      lane: this.lane,
    });

    if (championCache) return championCache;

    return false;
  }

  async championRunesCacheLength() {
    const length = await uggModel.countDocuments();

    return length;
  }
}

import mongoose from 'mongoose';
import RuneResponse from '../controllers/classes/RuneResponse';

const uggSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now, expires: '1m' },
  champion: { type: String, required: true },
  lane: { type: String, required: true },
  runes: { type: Array, required: true },
  runesId: { type: Object, required: true },
});

const uggModel = mongoose.model('UggRunesCache', uggSchema);

export class UggDB {
  constructor(private champion: string, private lane: string) {}

  async createChampionCache(response: RuneResponse): Promise<mongoose.DocumentSetOptions> {
    const cacheExists = await uggModel.create(response);
    return cacheExists;
  }

  async championCacheExists(): Promise<false | mongoose.DocumentSetOptions> {
    const championCache = await uggModel.findOne({ champion: this.champion, lane: this.lane });

    if (championCache) return championCache;

    return false;
  }
}

import dotenv from 'dotenv';
import express from 'express';
import Mongoose from 'mongoose';
import routes from './routes';
import cron from 'node-cron';
import CacheManager from './application/CacheManager';

dotenv.config();
const app = express();

Mongoose.connect(process.env.CONNECTIONSTRING as string, {
  dbName: 'web-api',
})
  .then(() => {
    app.emit('ready');
  })
  .catch((e) => console.log(e));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

app.on('ready', () => {
  const cacheManager = new CacheManager();
  cacheManager.initialSyncCache();
  cron.schedule('0 0 * * *', () => {
    console.log('Doing daily sync of runes cache.');
    cacheManager.syncCache();
  });
  app.listen(process.env.PORT, () => {
    console.log(`Acessar http://localhost:${process.env.PORT}`);
    console.log(`Servidor executando na porta ${process.env.PORT}`);
  });
});

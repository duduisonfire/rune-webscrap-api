import dotenv from 'dotenv';
import express from 'express';
import Mongoose from 'mongoose';
import routes from './routes';

dotenv.config();
const app = express();

Mongoose.connect(process.env.CONNECTIONSTRING as string)
  .then(() => {
    app.emit('ready');
  })
  .catch((e) => console.log(e));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

app.on('ready', () => {
  app.listen(process.env.PORT, () => {
    console.log(`Acessar http://localhost:${process.env.PORT}`);
    console.log(`Servidor executando na porta ${process.env.PORT}`);
  });
});

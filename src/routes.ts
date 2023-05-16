import express from 'express';
import GetRunePages from './controllers/GetRunePage';

const routes = express.Router();

routes.get('/v1/api/ugg/:champion/:lane', GetRunePages.getUggRunes);

export default routes;

import express from 'express';
import {verifyToken} from "../controllers/middlewareController.js"
import {NovelController} from '../controllers/NovelController.js';

const router = express.Router();

router.get('/', NovelController.GetNovels);

router.get('/search', NovelController.SearchNovelByName);

router.get('/created', NovelController.GetNovelsByUserId);

router.get('/novel/:url', NovelController.GetNovelsByUrl);

router.get('/novel/:url/mucluc', NovelController.GetChapterByUrl);

router.get('/novel/:url/chuong/:chapNumber',NovelController.GetChapterByNumber)

router.post('/novel/reading/',NovelController.SetReading)

router.get('/readings',NovelController.GetReadings)

router.post('/novel/create',verifyToken,NovelController.CreateNovel)

router.post('/novel/chuong/create',verifyToken,NovelController.CreateChapter)

router.put('/novel/chuong/edit',verifyToken,NovelController.UpdateChapter)

router.delete('/novel/chuong',verifyToken,NovelController.DeleteChapter)

router.put('/novel/edit',verifyToken,NovelController.EditNovel)

router.delete('/novel',verifyToken,NovelController.DeleteNovelByUrl)

export default router;
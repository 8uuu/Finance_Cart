import {Router} from 'express';
import { createHonorary, getHonorariesByUserId } from '../controllers/honorary.controller';
const router = Router();

router.post('/', createHonorary);
router.post('/honorariesByAccountId', getHonorariesByUserId);

export default router;
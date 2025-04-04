import { Router } from 'express';
import authController from '../controllers/authController';

const router = Router();

router.post('/login', authController.login);
router.post('/register', authController.register);

router.get('/health', (req, res) => {
    res.status(200).json({status : 'ok'});
});

export default router;
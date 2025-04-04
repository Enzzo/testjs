import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = 'key';

const authController = {
    register: async (req: Request, res: Response, next: NextFunction) => {
        try{
            const userRepository = getRepository(User);
            const { email, password } = req.body;

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = userRepository.create({email, password: hashedPassword });
            await userRepository.save(user);
            res.status(201).json({message: 'Пользователь создан' })
        } catch(error){
            res.status(500).json({ error: 'Ошибка регистрации'});
        }
    },

    login: async (req: Request, res: Response) => {
        try{
            const userRepository = getRepository(User);
            const { email, password } = req.body;
            const user = await userRepository.findOne({where: {email}});
            if(!user){
                res.status(401).json({ error: 'Неверные данные' });
                return;
            }
            const isValid = await bcrypt.compare(password, user.password);
            if(!isValid){
                res.status(401).json({ error: 'Неверные данные' });
                return;
            }
            const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {expiresIn: '1h' });
            res.json({ token });
        } catch(error){
            res.status(500).json({ error: 'Ошибка авторизации' });
        }
    }
};

export default authController;
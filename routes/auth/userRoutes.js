import express from 'express';

const router = express.Router();

router.route('/')
    .get((req, res) => {
        res.send('Hello World!');
    })
    .post((req, res) => {
        res.json({ res: 'respuesta de tipo post' })
    })

export default router;
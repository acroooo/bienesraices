import express from 'express';

const router = express.Router();

router.route('/login')
    .get((req, res) => {
        res.render('./auth/login', {
            state: true,
        });
    })
    .post((req, res) => {
        res.json({ res: 'respuesta de tipo post' })
    })

export default router;
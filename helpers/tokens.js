import jwt from 'jsonwebtoken'
// sin instalación de dependencias

const generateJWT = data => {
    return jwt.sign({ id: data.id, name: data.name }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

const generateId = () => Math.random().toString(32).substring(2) + Date.now().toString(32);

export {
    generateJWT,
    generateId,
}
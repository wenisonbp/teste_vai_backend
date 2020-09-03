
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

module.exports = (req, res, next) => {

    const authHeader = req.header('Authorization');

    if (!authHeader) {

        return res.status(401).json({ error: "Token não existe" });

    }

    const parts = authHeader.split(' ');

    if (!parts.length === 2) {

        return res.status(401).json({ error: "Token incompleto" });

    }

    const [ scheme, token ] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        
        return res.status(401).json({ error: "Token com formato errado" });
        
    }

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) {
        
            
            return res.status(401).json({ error: "Token inválido" });
            
        }

        req.userId = decoded.id;

        return next()

    })

}
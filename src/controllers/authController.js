const User = require('../database/models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth');

module.exports = {

    async storeUser(req, res) {

        const { name, email, password, passwordConfirm } = req.body;

        if (password !== passwordConfirm) {

            return res.status(500).json({ error: "Senha não são iguais" });

            
        }

        const searchUser = await User.findOne({ where: { email } });

        if (searchUser) {
            return res.status(500).json({ error: "Usuario já cadastrado" });
        }

        const resultCreated = await User.create({
            name, email, password
        });

        console.log(resultCreated)


        const token = jwt.sign({
            id: resultCreated.id,
            name: resultCreated.name,
            email: resultCreated.email,
        }, authConfig.secret, {
            expiresIn: 86400
        })

        return res.json({
            token
        });

    },

    async loginUser(req, res) {

        const { email, password } = req.body;

        const searchUser = await User.findOne({ where: { email } });

        if (!searchUser) {
            return res.status(500).json({ error: "Dados incorretos" });
        }

        const checkPassword = await bcrypt.compare(password, searchUser.password)

        if (!checkPassword) {
            return res.status(500).json({ error: "Dados incorretos" });
        }

        const token = jwt.sign({
            id: searchUser.id,
            name: searchUser.name,
            email: searchUser.email,
        }, authConfig.secret, {
            expiresIn: 86400
        })

        return res.json({
            token
        });

    }

};
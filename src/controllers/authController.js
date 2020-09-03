const User = require('../database/models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth');

module.exports = {

    async storeUser(req, res) {

        const { name, email, company_name, telephone, password } = req.body;

        const searchUser = await User.findOne({ where: { email } });

        if (searchUser) {
            return res.json({ error: "Usuario já cadastrado" });
        }

        const searchCompany = await User.findOne({ where: { company_name } });

        if (searchCompany) {
            return res.json({ error: "Empresa já cadastrada" });
        }

        const resultCreated = await User.create({
            name, email, company_name, telephone, password
        });

        return res.json({
            id: resultCreated.id,
            name: resultCreated.name,
            email: resultCreated.email,
            company_name: resultCreated.company_name
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
            company_name: searchUser.company_name
        }, authConfig.secret, {
            expiresIn: 86400
        })

        return res.json({
            token
        });

    }

};
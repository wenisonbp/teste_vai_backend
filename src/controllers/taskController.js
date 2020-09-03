const Tasks = require('../database/models/Tasks');
const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");


module.exports = {

    async storeTask(req, res) {

        const stage = 'triagem';
        let index = 0;

        let user_id = req.userId;

        const {
            title,
            requester_name,
            requester_email,
            description,
            comment,
            due_date
        } = req.body.fieldsTasks;


        const searchMaxTask = await Tasks.max('index', { where: { user_id } });

        if (Number.isInteger(searchMaxTask)) {
            index = searchMaxTask + 1;
        }

        const resultCreated = await Tasks.create({
            user_id,
            title,
            requester_name,
            requester_email,
            description,
            category: 'start',
            comment,
            due_date,
            stage,
            index: index
        });

        return res.json(resultCreated);
    },
    async showTask(req, res) {

        const { id } = req.params;

        const searchTask = await Tasks.findOne({ where: { id } });

        return res.json(searchTask);

    },
    async updateTask(req, res) {

        const {
            alter_id,
            alter_title,
            alter_requester_name,
            alter_requester_email,
            alter_description,
            alter_due_date,
            alter_comment
        } = req.body.fieldsTasksAlter;

        const updateTask = await Tasks.update({
            title: alter_title,
            requester_name: alter_requester_name,
            requester_email: alter_requester_email,
            description: alter_description,
            due_date: alter_due_date,
            comment: alter_comment
        }, {
            where: {
                id: alter_id
            }
        });

        if (updateTask > 0) {

            return res.json({ message: 'Sucesso' });

        } else {

            return res.status(500).json({ error: "Erro na exclusão" });

        }

    },
    async indexTask(req, res) {

        let user_id = req.userId;

        const searchTask = await Tasks.findAll({ where: { user_id }, order: [['index', 'ASC']] });

        return res.json(searchTask);
    },

    async destroyTask(req, res) {


        const idTask = req.body.idTask;

        const deleteTask = await Tasks.destroy({
            where: {
                id: idTask
            }
        });

        if (deleteTask === 1) {

            return res.json({ message: 'Sucesso' });

        } else {

            return res.status(500).json({ error: "Erro na exclusão" });

        }

    },

    async reorderTaskStage(req, res) {

        const { stage, index, id } = req.body;

        const reorderTaskAll = await Tasks.increment({ index: +1 }, {
            where: {
                stage,
                index: {
                    [Op.gte]: index
                }
            }
        });

        const reorderTask = await Tasks.update({ index }, {
            where: {
                id
            }
        });

        if (reorderTask > 0) {

            return res.json({ message: 'Sucesso' });

        } else {

            return res.status(500).json({ error: "Erro na exclusão" });

        }

    },

    async moveTaskStage(req, res) {


        const { stage, index, id } = req.body;

        const reorderTaskAll = await Tasks.increment({ index: +1 }, {
            where: {
                stage,
                index: {
                    [Op.gte]: index
                }
            }
        });

        const reorderTask = await Tasks.update({ index, stage }, {
            where: {
                id
            }
        });

        if (reorderTask > 0) {

            return res.json({ message: 'Sucesso' });

        } else {

            return res.status(500).json({ error: "Erro na exclusão" });

        }

    }

};
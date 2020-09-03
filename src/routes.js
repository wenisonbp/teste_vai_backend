const express = require('express');

const authController = require('./controllers/authController');
const taskController = require('./controllers/taskController');
const authMiddleware = require('./middlewares/auth');
// const ReportController = require('./controllers/ReportController');

const routes = express.Router();

routes.post('/register', authController.storeUser);
routes.post('/authenticate', authController.loginUser);
routes.get('/task', authMiddleware, taskController.indexTask);
routes.get('/task_show/:id', authMiddleware, taskController.showTask);
routes.post('/task_update', authMiddleware, taskController.updateTask);
routes.post('/task_store', authMiddleware, taskController.storeTask);
routes.post('/task_delete', authMiddleware, taskController.destroyTask);
routes.post('/task_reorder_stage', authMiddleware, taskController.reorderTaskStage);
routes.post('/task_move_stage', authMiddleware, taskController.moveTaskStage);


module.exports = routes;
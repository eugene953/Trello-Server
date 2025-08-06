"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = require("../models");
const asynHandler_1 = require("../utils/asynHandler");
const auth_1 = __importDefault(require("../auth"));
const router = (0, express_1.Router)();
router.post('/createTask', auth_1.default, (0, asynHandler_1.asyncHandler)(async (req, res) => {
    const { title, description, dueDate } = req.body;
    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }
    const userId = parseInt(req.user.id, 10);
    const dueDateObj = dueDate ? new Date(dueDate) : undefined;
    const task = await (0, models_1.createTask)(userId, title, description, dueDateObj);
    res.status(201).json({ message: 'Task created', task });
}));
router.get('/getAllTask', auth_1.default, (0, asynHandler_1.asyncHandler)(async (req, res) => {
    const userId = parseInt(req.user.id, 10);
    const task = await (0, models_1.getAllTasks)(userId);
    res.status(201).json({ message: 'Gotten all tasks successfully', task });
}));
router.get('/getTaskById/:id', auth_1.default, (0, asynHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user)
        return res.status(401).json({ message: "Unauthorized" });
    console.log("User ID:", req.user.id);
    console.log("Task ID param:", req.params.id);
    const userId = parseInt(req.user.id, 10);
    const taskId = parseInt(req.params.id, 10);
    if (isNaN(taskId)) {
        return res.status(400).json({ message: "Invalid task ID" });
    }
    const task = await (0, models_1.getTaskById)(Number(req.params.id), userId);
    task ? res.json(task) : res.status(404).json({ message: 'Task not found' });
}));
router.put('/updateTask/:id', auth_1.default, (0, asynHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user)
        return res.status(401).json({ message: "Unauthorized" });
    const userId = parseInt(req.user.id, 10);
    const task = await (0, models_1.updateTask)(Number(req.params.id), userId, req.body);
    if (task.count > 0) {
        res.json({ message: "Task updated successfully" });
    }
    else {
        res.status(404).json({ message: "Task not found or not updated" });
    }
}));
router.delete('/deleteTask/:id', auth_1.default, (0, asynHandler_1.asyncHandler)(async (req, res) => {
    const userId = parseInt(req.user.id, 10);
    const result = await (0, models_1.deleteTask)(Number(req.params.id), userId);
    result.count > 0
        ? res.json({ message: 'Task deleted successfully' })
        : res.status(404).json({ message: 'Task not found or not authorized' });
}));
exports.default = router;

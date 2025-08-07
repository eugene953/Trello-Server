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
/**
 * @swagger
 * /createProject:
 *   post:
 *     summary: Create a new project
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Project created
 *       400:
 *         description: Title is required
 */
router.post('/createProject', auth_1.default, (0, asynHandler_1.asyncHandler)(async (req, res) => {
    const { title, description, dueDate } = req.body;
    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }
    const userId = parseInt(req.user.id, 10);
    const dueDateObj = dueDate ? new Date(dueDate) : undefined;
    const project = await (0, models_1.createProject)(userId, title, description, dueDateObj);
    res.status(201).json({ message: 'Project created', project });
}));
/**
 * @swagger
 * /getAllProject:
 *   get:
 *     summary: Get all projects for the logged-in user
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all projects
 */
router.get('/getAllProject', auth_1.default, (0, asynHandler_1.asyncHandler)(async (req, res) => {
    const userId = parseInt(req.user.id, 10);
    const projects = await (0, models_1.getAllProjects)(userId);
    res.status(200).json({ message: 'Fetched all projects successfully', projects });
}));
/**
 * @swagger
 * /getProjectById/{id}:
 *   get:
 *     summary: Get a project by ID
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Project found
 *       400:
 *         description: Invalid project ID
 *       404:
 *         description: Project not found
 */
router.get('/getProjectById/:id', auth_1.default, (0, asynHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user)
        return res.status(401).json({ message: 'Unauthorized' });
    const userId = parseInt(req.user.id, 10);
    const projectId = parseInt(req.params.id, 10);
    if (isNaN(projectId)) {
        return res.status(400).json({ message: 'Invalid project ID' });
    }
    const project = await (0, models_1.getProjectById)(projectId, userId);
    project
        ? res.json(project)
        : res.status(404).json({ message: 'Project not found' });
}));
/**
 * @swagger
 * /updateProject/{id}:
 *   put:
 *     summary: Update a project by ID
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Project updated
 *       404:
 *         description: Project not found
 */
router.put('/updateProject/:id', auth_1.default, (0, asynHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user)
        return res.status(401).json({ message: 'Unauthorized' });
    const userId = parseInt(req.user.id, 10);
    const result = await (0, models_1.updateProject)(Number(req.params.id), userId, req.body);
    if (result.count > 0) {
        res.json({ message: 'Project updated successfully' });
    }
    else {
        res.status(404).json({ message: 'Project not found or not updated' });
    }
}));
/**
 * @swagger
 * /deleteProject/{id}:
 *   delete:
 *     summary: Delete a project by ID
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       404:
 *         description: Project not found or not authorized
 */
router.delete('/deleteProject/:id', auth_1.default, (0, asynHandler_1.asyncHandler)(async (req, res) => {
    const userId = parseInt(req.user.id, 10);
    const result = await (0, models_1.deleteProject)(Number(req.params.id), userId);
    result.count > 0
        ? res.json({ message: 'Project deleted successfully' })
        : res.status(404).json({ message: 'Project not found or not authorized' });
}));
exports.default = router;

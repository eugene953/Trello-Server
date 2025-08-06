"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const models_1 = require("../models");
const router = express_1.default.Router();
router.post('/createColumn', async (req, res) => {
    try {
        const column = await (0, models_1.createColumn)(req.body.title);
        res.status(201).json(column);
    }
    catch {
        res.status(500).json({ error: 'Failed to create column' });
    }
});
router.get('/getAllColumn', async (req, res) => {
    try {
        const columns = await (0, models_1.getAllColumns)();
        res.json(columns);
    }
    catch {
        res.status(500).json({ error: 'Failed to get columns' });
    }
});
router.get('/getColumnById/:id', async (req, res) => {
    try {
        const column = await (0, models_1.getColumnById)(+req.params.id);
        if (!column)
            return res.status(404).json({ error: 'Not found' });
        res.json(column);
    }
    catch {
        res.status(500).json({ error: 'Failed to get column' });
    }
});
router.delete('/deleteColumn/:id', async (req, res) => {
    try {
        await (0, models_1.deleteColumn)(+req.params.id);
        res.json({ message: 'Column deleted' });
    }
    catch {
        res.status(500).json({ error: 'Failed to delete column' });
    }
});
exports.default = router;

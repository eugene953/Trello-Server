"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const models_1 = require("../models");
const auth_1 = __importDefault(require("../auth"));
const asynHandler_1 = require("../utils/asynHandler");
const router = express_1.default.Router();
router.post('/createCard', auth_1.default, (0, asynHandler_1.asyncHandler)(async (req, res) => {
    const { title, columnId } = req.body;
    try {
        const card = await (0, models_1.createCard)(title, columnId);
        res.status(201).json(card);
    }
    catch {
        res.status(500).json({ error: 'Failed to create card' });
    }
}));
router.put('/updatecard/:id', auth_1.default, (0, asynHandler_1.asyncHandler)(async (req, res) => {
    const { title } = req.body;
    try {
        const card = await (0, models_1.updateCard)(+req.params.id, title);
        res.json(card);
    }
    catch {
        res.status(500).json({ error: 'Failed to update card' });
    }
}));
router.delete('/deleteCard/:id', auth_1.default, (0, asynHandler_1.asyncHandler)(async (req, res) => {
    try {
        await (0, models_1.deleteCard)(+req.params.id);
        res.json({ message: 'Card deleted' });
    }
    catch {
        res.status(500).json({ error: 'Failed to delete card' });
    }
}));
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCard = exports.deleteCard = exports.createCard = exports.deleteColumn = exports.getColumnById = exports.getAllColumns = exports.createColumn = exports.deleteTask = exports.updateTask = exports.getTaskById = exports.getAllTasks = exports.createTask = exports.loginUser = exports.createUser = void 0;
const prismaClient_1 = __importDefault(require("./prismaClient"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateToken_1 = require("./utils/generateToken");
// User Registration
const createUser = async (fullName, email, password) => {
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    console.log("Original:", password);
    console.log("Hashed:", hashedPassword);
    const user = await prismaClient_1.default.user.create({
        data: {
            fullName,
            email,
            password: hashedPassword,
        },
    });
    const token = (0, generateToken_1.generateToken)({ id: user.id, role: 'user' });
    console.log('Generated JWT:', token);
    return { user, token };
};
exports.createUser = createUser;
// login User
const loginUser = async (email, password) => {
    const user = await prismaClient_1.default.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('User not found');
    }
    const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }
    const token = (0, generateToken_1.generateToken)({ id: user.id, role: 'user' });
    return { user, token };
};
exports.loginUser = loginUser;
// createTask
const createTask = (userId, title, description, dueDate) => {
    return prismaClient_1.default.task.create({
        data: {
            title,
            description,
            dueDate,
            ownerId: userId,
        },
    });
};
exports.createTask = createTask;
//get all task
const getAllTasks = (userId) => {
    return prismaClient_1.default.task.findMany({ where: { ownerId: userId } });
};
exports.getAllTasks = getAllTasks;
//get task by id
const getTaskById = (id, userId) => {
    return prismaClient_1.default.task.findFirst({
        where: {
            id,
            ownerId: userId,
        },
    });
};
exports.getTaskById = getTaskById;
//updating a task
const updateTask = (id, userId, data) => {
    const { dueDate, ...rest } = data;
    return prismaClient_1.default.task.updateMany({
        where: { id, ownerId: userId },
        data: {
            ...rest,
            dueDate: dueDate ? new Date(dueDate) : null,
        },
    });
};
exports.updateTask = updateTask;
//deleting a task
const deleteTask = (id, userId) => {
    return prismaClient_1.default.task.deleteMany({
        where: { id, ownerId: userId },
    });
};
exports.deleteTask = deleteTask;
//Columns
//create column
const createColumn = async (title) => {
    return prismaClient_1.default.column.create({ data: { title } });
};
exports.createColumn = createColumn;
//get all column
const getAllColumns = async () => {
    return prismaClient_1.default.column.findMany({ include: { cards: true } });
};
exports.getAllColumns = getAllColumns;
//get column by id
const getColumnById = async (id) => {
    return prismaClient_1.default.column.findUnique({ where: { id }, include: { cards: true } });
};
exports.getColumnById = getColumnById;
//delete column
const deleteColumn = async (id) => {
    return prismaClient_1.default.column.delete({ where: { id } });
};
exports.deleteColumn = deleteColumn;
//card
//createCard
const createCard = async (title, columnId) => {
    return prismaClient_1.default.card.create({ data: { title, columnId } });
};
exports.createCard = createCard;
//deleteCard
const deleteCard = async (id) => {
    return prismaClient_1.default.card.delete({ where: { id } });
};
exports.deleteCard = deleteCard;
//updateCard
const updateCard = async (id, title) => {
    return prismaClient_1.default.card.update({ where: { id }, data: { title } });
};
exports.updateCard = updateCard;

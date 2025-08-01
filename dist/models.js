"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTaskById = exports.getAllTasks = exports.createTask = exports.loginUser = exports.createUser = void 0;
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
    return prismaClient_1.default.task.findFirst({ where: { id, ownerId: userId } });
};
exports.getTaskById = getTaskById;
//updating a task
const updateTask = (id, userId, data) => {
    return prismaClient_1.default.task.updateMany({
        where: { id, ownerId: userId },
        data,
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

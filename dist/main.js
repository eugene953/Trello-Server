"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const users_1 = __importDefault(require("./routes/users"));
const project_1 = __importDefault(require("./routes/project"));
const list_1 = __importDefault(require("./routes/list"));
const card_1 = __importDefault(require("./routes/card"));
const swagger_1 = require("./swagger");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Register routes
app.use('/api', users_1.default);
app.use('/api', project_1.default);
app.use('/api', list_1.default);
app.use('/api', card_1.default);
app.use('/api-docs', swagger_1.swaggerUiHandler, swagger_1.swaggerDocHandler);
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});

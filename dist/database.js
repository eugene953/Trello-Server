"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Failed to connect to Supabase PostgreSQL:', err);
    }
    else {
        console.log('✅ Connected to Supabase PostgreSQL successfully!');
        release();
    }
});
exports.default = pool;

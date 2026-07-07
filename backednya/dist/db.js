"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '.env') });
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
const pool = promise_1.default.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
const query = async (text, params) => {
    // Convert PostgreSQL parameter syntax ($1, $2) to MySQL (?)
    let mysqlSql = text.replace(/\$\d+/g, '?');
    // Replace PostgreSQL type casts
    mysqlSql = mysqlSql.replace(/::text/g, '');
    mysqlSql = mysqlSql.replace(/::jsonb/g, '');
    const [rows] = await pool.execute(mysqlSql, params);
    // Return format as { rows: [...] } to maintain compatibility with postgres controllers
    return { rows: rows };
};
exports.query = query;
exports.default = pool;

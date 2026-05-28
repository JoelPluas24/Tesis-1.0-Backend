"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
var promise_1 = require("mysql2/promise");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
exports.pool = promise_1.default.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});

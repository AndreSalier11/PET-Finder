"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../.env") });
const getConfig = () => {
    return {
        HOST: process.env.HOST,
        PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
        SECRETKEY: process.env.SECRETKEY,
        DB_HOST: process.env.DB_HOST,
        DB_PORT: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
        DATABASE: process.env.DATABASE,
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DIR: process.env.DIR,
    };
};
const getSanitzedConfig = (config) => {
    for (const [key, value] of Object.entries(config)) {
        if (value === undefined) {
            throw new Error(`Missing key ${key} in .env`);
        }
    }
    return config;
};
const config = getConfig();
const sanitizedConfig = getSanitzedConfig(config);
exports.default = sanitizedConfig;

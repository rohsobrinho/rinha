"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TgUpdateSaldo_1 = __importDefault(require("./TgUpdateSaldo"));
exports.default = {
    execute: [
        ...TgUpdateSaldo_1.default.execute,
    ],
    executeOnError: [
        ...TgUpdateSaldo_1.default.executeOnError,
    ],
};

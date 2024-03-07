"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const triggers_1 = __importDefault(require("./triggers"));
exports.default = {
    execute: [...triggers_1.default.execute],
    executeOnError: [
        ...triggers_1.default.executeOnError,
    ],
};

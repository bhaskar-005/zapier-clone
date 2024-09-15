"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zapSchema = exports.signIn = exports.signUp = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signUp = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(8),
    name: zod_1.default.string()
});
exports.signIn = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string()
});
exports.zapSchema = zod_1.default.object({
    availableTriggerId: zod_1.default.string(),
    actions: zod_1.default.array(zod_1.default.object({
        availableActionId: zod_1.default.string(),
        metadata: zod_1.default.any().optional()
    }))
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_1 = require("./router/user");
const triggers_1 = require("./router/triggers");
const action_1 = require("./router/action");
const zap_1 = require("./router/zap");
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
express_1.default.json();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use('/api/user', user_1.userRouter);
app.use('/api/trigger', triggers_1.triggerRouter);
app.use('/api/action', action_1.actionRouter);
app.use('/api/zap', zap_1.zapRouter);
app.listen(5000, () => {
    console.log('listening on port 5000');
});

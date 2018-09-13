"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../loggers/logger");
const event_executor_1 = require("./event-executor");
class OnFinishEventExecutor extends event_executor_1.EventExecutor {
    constructor(name, finishable) {
        super('onFinish', finishable.onFinish);
        this.finishable = finishable;
        this.addArgument(name, this.finishable);
    }
    trigger() {
        if (!this.finishable.onFinish) {
            return [];
        }
        logger_1.Logger.trace(`Executing onFinish`);
        return this.execute();
    }
}
exports.OnFinishEventExecutor = OnFinishEventExecutor;
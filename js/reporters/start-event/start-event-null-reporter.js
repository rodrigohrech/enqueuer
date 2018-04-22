"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const start_event_reporter_1 = require("./start-event-reporter");
const conditional_injector_1 = require("conditional-injector");
let StartEventNullReporter = class StartEventNullReporter extends start_event_reporter_1.StartEventReporter {
    constructor(startEvent) {
        super();
        this.startEvent = startEvent;
    }
    start() {
        return Promise.reject(`No StartEvent type was found: ${JSON.stringify(this, null, 2)}`);
    }
    getReport() {
        return `No StartEvent type was found: ${JSON.stringify(this, null, 2)}`;
    }
};
StartEventNullReporter = __decorate([
    conditional_injector_1.Injectable(),
    __metadata("design:paramtypes", [Object])
], StartEventNullReporter);
exports.StartEventNullReporter = StartEventNullReporter;
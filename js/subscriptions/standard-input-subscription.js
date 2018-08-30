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
const subscription_1 = require("./subscription");
const conditional_injector_1 = require("conditional-injector");
let StandardInputSubscription = class StandardInputSubscription extends subscription_1.Subscription {
    constructor(subscriptionModel) {
        super(subscriptionModel);
        this.value = '';
    }
    receiveMessage() {
        return new Promise((resolve) => {
            process.stdin.on('end', () => resolve(this.value));
        });
    }
    subscribe() {
        process.stdin.setEncoding('utf8');
        process.stdin.resume();
        process.stdin.on('data', (chunk) => this.value += chunk);
        return Promise.resolve();
    }
    unsubscribe() {
        process.stdin.pause();
    }
};
StandardInputSubscription = __decorate([
    conditional_injector_1.Injectable({ predicate: (subscriptionAttributes) => subscriptionAttributes.type === 'standard-input' }),
    __metadata("design:paramtypes", [Object])
], StandardInputSubscription);
exports.StandardInputSubscription = StandardInputSubscription;

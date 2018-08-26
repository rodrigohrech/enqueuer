"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
const logger_1 = require("../loggers/logger");
class HttpServerPool {
    constructor() {
        this.boundPorts = {};
        this.initializeExpress();
    }
    static getInstance() {
        if (!HttpServerPool.instance) {
            HttpServerPool.instance = new HttpServerPool();
        }
        return HttpServerPool.instance;
    }
    getApp() {
        return this.app;
    }
    getHttpServer(port) {
        logger_1.Logger.debug(`Getting a Http server ${port}`);
        if (!this.http) {
            logger_1.Logger.debug(`Creating a new Http server ${port}`);
            const server = http_1.default.createServer(this.app);
            this.http = server;
        }
        return this.listenToPort(this.http, port);
    }
    getHttpsServer(credentials, port) {
        logger_1.Logger.debug(`Getting a Https server ${port}`);
        if (!this.https) {
            logger_1.Logger.debug(`Creating a new Https server ${port}`);
            const server = https_1.default.createServer(credentials, this.app);
            this.https = server;
        }
        return this.listenToPort(this.https, port);
    }
    listenToPort(server, port) {
        return new Promise((resolve, reject) => {
            server.on('error', (err) => {
                if (err) {
                    const message = `Error creating server ${err}`;
                    logger_1.Logger.error(message);
                    return reject(message);
                }
            });
            try {
                if (!this.boundPorts[port]) {
                    server.listen(port, (err) => {
                        if (err) {
                            const message = `Error listening to server ${err}`;
                            logger_1.Logger.error(message);
                            return reject(message);
                        }
                        this.boundPorts[port] = true;
                        return resolve();
                    });
                }
                else {
                    this.boundPorts[port] = true;
                    return resolve();
                }
            }
            catch (err) {
                const message = `Error in server ${err}`;
                logger_1.Logger.error(message);
                return reject(message);
            }
        });
    }
    initializeExpress() {
        if (!this.app) {
            this.app = express_1.default();
            this.app.use((req, res, next) => {
                req.setEncoding('utf8');
                req.rawBody = '';
                req.on('data', (chunk) => {
                    req.rawBody += chunk;
                });
                req.on('end', () => {
                    logger_1.Logger.trace(`Http(s) server got message: ${req.rawBody}`);
                    next();
                });
            });
        }
    }
}
exports.HttpServerPool = HttpServerPool;

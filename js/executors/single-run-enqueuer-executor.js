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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const enqueuer_executor_1 = require("./enqueuer-executor");
const multi_publisher_1 = require("../publishers/multi-publisher");
const single_run_input_1 = require("./single-run-input");
const configuration_1 = require("../configurations/configuration");
const requisition_starter_1 = require("../requisitions/requisition-starter");
const logger_1 = require("../loggers/logger");
const conditional_injector_1 = require("conditional-injector");
const fs = require("fs");
const prettyjson = require('prettyjson');
let SingleRunEnqueuerExecutor = class SingleRunEnqueuerExecutor extends enqueuer_executor_1.EnqueuerExecutor {
    constructor(enqueuerConfiguration) {
        super();
        const singleRunConfiguration = enqueuerConfiguration["single-run"];
        this.outputFilename = singleRunConfiguration["output-file"];
        this.multiPublisher = new multi_publisher_1.MultiPublisher(new configuration_1.Configuration().getOutputs());
        this.singleRunRequisitionInput =
            new single_run_input_1.SingleRunInput(singleRunConfiguration.fileNamePattern);
        this.reportMerge = {
            valid: true,
            errorsDescription: [],
            requisitions: {}
        };
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.singleRunRequisitionInput.syncDir();
        });
    }
    execute() {
        return new Promise((resolve) => {
            this.singleRunRequisitionInput.onNoMoreFilesToBeRead(() => {
                logger_1.Logger.info("There is no more requisition to be ran");
                this.persistSummary(this.reportMerge);
                return resolve(this.reportMerge);
            });
            this.singleRunRequisitionInput.receiveRequisition()
                .then(requisition => new requisition_starter_1.RequisitionStarter(requisition).start())
                .then(report => this.mergeNewReport(report))
                .then(report => this.multiPublisher.publish(JSON.stringify(report, null, 2)))
                .then(() => resolve(this.execute())) //Run the next one
                .catch((err) => {
                this.multiPublisher.publish(JSON.stringify(err, null, 2)).then().catch(console.log.bind(console));
                logger_1.Logger.error(err);
            });
        });
    }
    mergeNewReport(newReport) {
        const requisitionIdentifier = newReport.name || newReport.id;
        this.reportMerge.requisitions[requisitionIdentifier] = newReport.valid;
        this.reportMerge.valid = this.reportMerge.valid && newReport.valid;
        newReport.errorsDescription.forEach(newError => {
            this.reportMerge.errorsDescription.push(`[Requisition][${newReport.name || newReport.id}]${newError}`);
        });
        return newReport;
    }
    persistSummary(report) {
        const options = {
            defaultIndentation: 4,
            keysColor: "white",
            dashColor: "grey"
        };
        logger_1.Logger.info(`Reports summary:`);
        console.log(prettyjson.render(report, options));
        if (this.outputFilename)
            fs.writeFileSync(this.outputFilename, JSON.stringify(report, null, 3));
    }
    ;
};
SingleRunEnqueuerExecutor = __decorate([
    conditional_injector_1.Injectable({ predicate: enqueuerConfiguration => enqueuerConfiguration["single-run"] }),
    __metadata("design:paramtypes", [Object])
], SingleRunEnqueuerExecutor);
exports.SingleRunEnqueuerExecutor = SingleRunEnqueuerExecutor;
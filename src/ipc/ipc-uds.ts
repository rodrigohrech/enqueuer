import { IpcCommunicator, IpcCommunicatorCallback } from "./ipc-communicator";
import { MessengerService } from "../service/messenger-service";
import { RequisitionParserFactory } from "../service/requisition/requisition-parser-factory";
import { RequisitionParser } from "../service/requisition/requisition-parser";
import { Report } from "../report/report";
const ipc = require('node-ipc');

ipc.config.id = 'enqueuer';
ipc.config.retry = 1500;
ipc.config.silent = true;
export class IpcUds implements IpcCommunicator {
 
    private ipcCommunicatorCallback: IpcCommunicatorCallback = () => {};
    private messengerService: MessengerService | null = null;
    
    start(ipcCommunicatorCallback: IpcCommunicatorCallback): void {
        console.log("starting ipc-uds");

        ipc.serve(() => this.onConnect());
        ipc.server.start();
        this.ipcCommunicatorCallback = ipcCommunicatorCallback;
    }

    stop(): void {
        ipc.server.end();
        this.ipcCommunicatorCallback(0);
    }
    
    private onConnect(): void {
        ipc.server.on('enqueuer-client', (message: string, socket: any) => this.onMessageReceived(message, socket));
    }

    private onMessageReceived(message: string, socket: any): void {
        this.messengerService = new RequisitionParserFactory().createService(message);
        if (this.messengerService) {
            this.messengerService.start((report: Report) => this.onFinish(socket, report));
        }
    }

    private onFinish(socket: any, report: Report): void {
        ipc.server.emit(socket, 'message', report.toString());
    }

}
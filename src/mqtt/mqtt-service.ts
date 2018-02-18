import { PropertyFile } from "./property-file";
const Stream = require("ts-stream").Stream; // CommonJS style
const mqtt = require('mqtt')

export type MqttServiceCallback = () => void;

export class MqttService {
    private client: any;
    private propertyFile: PropertyFile;
    private subscribedTopics: string[] = [];
    private onFinish: MqttServiceCallback;


    constructor(propertyFile: PropertyFile, onFinish: MqttServiceCallback) {
        this.propertyFile = propertyFile;
        this.onFinish = onFinish;
        this.client = mqtt.connect("mqtt://localhost");
        this.client.on('message', 
                (topic: string, message: string) => this.onMessageReceived(topic, message));
        this.subscribeToTopics();
        console.log("Service built");
    }
    
    public start(): void {
        this.client.on('connect', () => this.onConnect());
    }
    
    private onConnect(): void {
        console.log("Publishing at: " + this.propertyFile.publish.topic);
        this.client.publish(this.propertyFile.publish.topic,
                            this.propertyFile.publish.payload);
        setTimeout(() => this.onTimeout(), 5000);
    }
    
    private onTimeout(): void {
        console.log("onTimeout");
        this.client.end();
        this.onFinish();
    }
    
    private onMessageReceived(topic: string, message: string): void {
        console.log("Received at to: " + topic);
        var index = this.subscribedTopics.indexOf(topic, 0);
        if (index > -1) {
            this.subscribedTopics.splice(index, 1);
        }
        if (this.subscribedTopics.length == 0) {
            this.onFinish();
        }
    }
    
    private subscribeToTopics(): void {
        Stream.from(this.propertyFile.subscribe)
                .forEach((topic: string) => {
                    console.log("Subscribing to: " + topic);
                    this.client.subscribe(topic)
                    this.subscribedTopics.push(topic);
                });
    }
}
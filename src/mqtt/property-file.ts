import {Type, plainToClass} from "class-transformer";
import "reflect-metadata";

export class PropertyFile {
    subscribe: string[] | null = [];

    @Type(() => Publish)
    publish: Publish = new Publish();
}

export class Publish {
    topic: string = "";
    payload: string = "";
}
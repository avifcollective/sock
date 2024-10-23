// https://stackoverflow.com/questions/12881212/does-typescript-support-events-on-classes/14657922#14657922

import { Message } from "../types/websocket";
import { LiteEvent } from "./HandleEvent";

export class HandleMessage {
    public readonly onMessage = new LiteEvent<Message>()
    public readonly onHistory = new LiteEvent<Message[]>()

    public get Messages() { return this.onMessage.expose() }
    public get History() { return this.onHistory.expose()}
}
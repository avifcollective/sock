import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { Message } from '../types/websocket';

export class HandleData {
    private dataDirectory: string
    private dataFilePath: string
    private logFilePath: string
    public messageHistory: Message[]

    constructor() {
        this.dataDirectory = path.join(os.homedir(), '.sockData');
        this.dataFilePath = path.join(this.dataDirectory, 'userData.json');
        this.logFilePath = path.join(this.dataDirectory, Date.now() + '_log.json');
        this.messageHistory = []

        if (!fs.existsSync(this.dataDirectory)) {
            fs.mkdirSync(this.dataDirectory);
          }
    }

    public writeUser(key: string, value: string | number | boolean) {
        if(!fs.existsSync(this.dataFilePath)) {
            fs.writeFileSync(this.dataFilePath, '{}')
        }

        const userData = JSON.parse(fs.readFileSync(this.dataFilePath, 'utf8'));

        userData[key] = value

        fs.writeFileSync(this.dataFilePath, JSON.stringify(userData, null, 2));
    }

    public getUser(key: string) {
        if(!fs.existsSync(this.dataFilePath)) {
            fs.writeFileSync(this.dataFilePath, '{}')
        }

        const userData = JSON.parse(fs.readFileSync(this.dataFilePath, 'utf8'));

        return userData[key]
    }

    public saveMessage(message: Message) {
        if(!fs.existsSync(this.logFilePath)) {
            fs.writeFileSync(this.logFilePath, '{"history": []}')
        }

        const logs = JSON.parse(fs.readFileSync(this.logFilePath, 'utf8'));

        logs["history"].push(message)

        fs.writeFileSync(this.logFilePath, JSON.stringify(logs, null, 2));
    }

    public getMessages() {
        if(!fs.existsSync(this.logFilePath)) {
            fs.writeFileSync(this.logFilePath, '{"history": []}')
        }

        const logs = JSON.parse(fs.readFileSync(this.logFilePath, 'utf8'));

        return logs as History
    }
}
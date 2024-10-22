import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export class HandleData {
    dataDirectory: string
    dataFilePath: string

    constructor() {
        this.dataDirectory = path.join(os.homedir(), '.sockData');
        this.dataFilePath = path.join(this.dataDirectory, 'userData.json');

        if (!fs.existsSync(this.dataDirectory)) {
            fs.mkdirSync(this.dataDirectory);
          }
    }

    public writeData(key: string, value: string | number | boolean) {
        if(!fs.existsSync(this.dataFilePath)) {
            fs.writeFileSync(this.dataFilePath, '{}')
        }

        const userData = JSON.parse(fs.readFileSync(this.dataFilePath, 'utf8'));

        userData[key] = value

        fs.writeFileSync(this.dataFilePath, JSON.stringify(userData, null, 2));
    }

    public getData(key: string) {
        if(!fs.existsSync(this.dataFilePath)) {
            fs.writeFileSync(this.dataFilePath, '{}')
        }

        const userData = JSON.parse(fs.readFileSync(this.dataFilePath, 'utf8'));

        return userData[key]
    }
}
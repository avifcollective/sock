import { WebSocket } from 'ws'
import { ReceiveError, ReceiveHeartbeat, ReceiveHistory, ReceiveMemberList, ReceiveMessage, SendLogin } from '../types/websocket';
import { LiteEvent } from './HandleEvent';
import { Login } from '../types/local';
import { data } from '..';

export class HandleConnection {
    private ws: WebSocket;
    public events: LiteEvent<any>;
    public memberList: {
        id: string
        username: string
    }[]

    constructor(websocket: string) {
        // Connect to ws
        this.ws = new WebSocket(websocket)

        this.receiveMessage()

        // Create member list
        this.memberList = []

        // Create event handler
        this.events = this.createEventHandler()

        // Gracefully close program in case of sudden websocket closure
        this.ws.on('close', () => {
            console.log('\n\nWebsocket connection closed unexpectedly. Exiting process gracefully')
            process.exit()
        })
    }

    public async getToken(email: string, password: string, api?: string): Promise<string> {
        const token = await fetch(api || 'https://chatapi.nin0.dev' + '/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                password: password
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })

        return JSON.parse(await token.text()).token
    }

    public async login(details: Login): Promise<boolean> {
        try {
            this.ws.send(JSON.stringify({
                op: 1,
                d: {
                    device: 'web',
                    token: details.token || undefined,
                    username: details.username || undefined,
                    anon: details.anon
                }
            } as SendLogin));
            return true
        } catch (error) {
            return false
        }
    }

    private receiveMessage() {
        // Send events to whatever
        this.ws.on('message', (m: ReceiveHeartbeat | ReceiveHistory | ReceiveMessage | ReceiveError | ReceiveMemberList) => {
            m = JSON.parse(m.toString())
            if (m.op === 2) {
                this.ws.send(JSON.stringify(m))
            } else if (m.op === 0) {
                this.events.trigger('message', m.d)
                data.saveMessage(m.d)
            } else if (m.op === 3) {
                this.events.trigger('history', m.d)
            } else if (m.op === 4) {
                this.memberList = m.d.users
            } else if (m.op === -1) {
                this.events.trigger('error', m.d.message)
            }
        })
    }

    private createEventHandler() {
        return new LiteEvent<any>();
    }

}
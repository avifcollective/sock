import { WebSocket } from 'ws'
import { Message, ReceiveHeartbeat, ReceiveHistory, ReceiveMessage, SendLogin } from '../types/websocket'
import { Details } from '../types/local'
import { HandleMessage } from './HandleMessage'
import { events } from '..'

export class HandleSocket {
    websocket: string
    ws: WebSocket
    events: HandleMessage

    constructor(details: Details) {
        this.websocket = 'wss://chatws.nin0.dev'
        this.ws = new WebSocket(this.websocket)
        this.events = events
        if (!details.token) this.manageStartAnon(details.username || 'Sock' + Math.floor(Math.random() * (10 - 1 + 1) + 1))
        else this.manageStart(details.token)
    }

    private manageStartAnon(username: string) {
        this.ws.on('open', () => {
            this.ws.send(JSON.stringify({
                op: 1,
                d: {
                    device: 'web',
                    username: username,
                    anon: true
                }
            } as SendLogin));
        })
    }

    private manageStart(token: string) {
        this.ws.on('open', () => {
            this.ws.send(JSON.stringify({
                op: 1,
                d: {
                    device: 'web',
                    token: token,
                    anon: false
                }
            } as SendLogin));
        })
    }

    public manageMessages() {   // Temporary 
        this.ws.on('message', (m: ReceiveHeartbeat | ReceiveHistory | ReceiveMessage) => {  // Temporary 
            m = JSON.parse(m.toString())    // Temporary 
            if (m.op === 2) {   // Temporary 
                this.ws.send(JSON.stringify(m)) // Temporary 
            } else if (m.op === 0) {    // Temporary 
                events.onMessage.trigger(m.d)
            } else if (m.op === 3) {    // Temporary 
                events.onHistory.trigger(m.d)
            }   // Temporary 
        })  // Temporary 
    }   // Temporary 
}
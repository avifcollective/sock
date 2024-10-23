import termkit from 'terminal-kit'
import { HandleData } from '../handler/HandleData';
import { Details } from '../types/local';
import { HandleSocket } from '../handler/HandleSocket';
import { HandleMessage } from '../handler/HandleMessage';
import { events } from '..';
import { Message, Role } from '../types/websocket';

// const term = termkit.terminal()

export class ChatScreen {
    term: termkit.Terminal
    dataHandler: HandleData
    events: HandleMessage

    constructor(term: termkit.Terminal) {
        this.term = term;
        this.dataHandler = new HandleData()
        this.events = events
    }

    public printHistory(d: Message[]) {
        if(!d) return
            const array: Message[] = d
            array.forEach(() => { return console.log('1')})
            // d.forEach((d) => {
            //     switch(d.userInfo.roles) {
            //         case Role.Guest:
            //             return this.term(`<^#^KGuest^:> ${d.userInfo.username}: ${d.content}\n`)
            //         case Role.User:
            //             return this.term(`<^#^wUser^:> ${d.userInfo.username}: ${d.content}\n`)
            //         case Role.Bot:
            //             return this.term(`<^#^bBot^:> ${d.userInfo.username}: ${d.content}\n`)
            //         case Role.System:
            //             return this.term(`^/^K${d.content}\n`)
            //         case Role.User + Role.Mod:
            //             return this.term(`<^#^gMod^:> ${d.userInfo.username}: ${d.content}\n`)
            //         case Role.User + Role.Admin:
            //             return this.term(`<^#^rAdmin^:> ${d.userInfo.username}: ${d.content}\n`)
            //         default: 
            //             return this.term('Failed to detect user type')
            //     }
            // })
            console.log('received history')
    }

    public startChat(): void {
        const Role = {
            Guest: 1 << 0,
            User: 1 << 1,
            Bot: 1 << 2,
            System: 1 << 3,
            Mod: 1 << 4,
            Admin: 1 << 5
        };

        this.term.clear()

        this.events.History.on((d?: Message[]) => {
            // this.printHistory(d as Message[])
        })

        this.events.Messages.on((d?: Message) => {
            if(!d) return
            // console.log(d?.userInfo.roles)
            // console.log(Role.Mod)
            // console.log(Role.User)
            switch(d.userInfo.roles) {
                case Role.Guest:
                    return this.term(`<^#^KGuest^:> ${d.userInfo.username}: ${d.content}\n`)
                case Role.User:
                    return this.term(`<^#^wUser^:> ${d.userInfo.username}: ${d.content}\n`)
                case Role.Bot:
                    return this.term(`<^#^bBot^:> ${d.userInfo.username}: ${d.content}\n`)
                case Role.System:
                    return this.term(`^/^K${d.content}\n`)
                case Role.User + Role.Mod:
                    return this.term(`<^#^gMod^:> ${d.userInfo.username}: ${d.content}\n`)
                case Role.User + Role.Admin:
                    return this.term(`<^#^rAdmin^:> ${d.userInfo.username}: ${d.content}\n`)
                default: 
                    return this.term('Failed to detect user type')
            }
                

            // if(d?.userInfo.roles as Role > Role.Mod) {
            //     this.term(`<^#^gMod^:>`)
            //     this.term(' ' + d.userInfo.username + ': ' + d.content)
            // }
        })
    }
}
import termkit from 'terminal-kit'
import { HandleData } from '../handler/HandleData';
import { Details } from '../types/local';

// const term = termkit.terminal()

export class LoginScreen {
    term: termkit.Terminal
    dataHandler: HandleData
    websocket: string;
    api: string;

    constructor(term: termkit.Terminal, websocket: string, api: string) {
        this.term = term;
        this.websocket = websocket
        this.api = api
        this.dataHandler = new HandleData()
    }

    public async startLogin(): Promise<Details> {
        const details: Details = {}

        this.term.clear()

        this.term('Log in as guest? (y/N)')
        const guest = await this.term.yesOrNo({ yes: ['y'], no: ['n', 'ENTER'] }).promise

        if (guest) {
            // GUEST
            this.term('\nEnter your username: ')
            const username = await this.term.inputField().promise
            this.term('\nLogging in... ')
            details.username = username
        } else {
            // AUTHENTICATING
            if (this.dataHandler.getData('lastLogin')) {
                const email = this.dataHandler.getData('email')
                const password = this.dataHandler.getData('password')
                this.term('\nLogging in... ')
                const token = await fetch(this.api + '/api/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({
                        email: email,
                        password: password
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                details.token = JSON.parse(await token.text()).token
                this.dataHandler.writeData('lastToken', details.token as string)
            } else {
                this.term('\nEnter your email: ')
                const email = await this.term.inputField().promise
                this.term('\nEnter your password: ')
                const password = await this.term.inputField({ echoChar: '*' }).promise
                this.term('\nLogging in... ')
                const token = await fetch(this.api + '/api/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({
                        email: email,
                        password: password
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                this.dataHandler.writeData('email', email || 'Empty')
                this.dataHandler.writeData('password', password || 'Empty')
                this.dataHandler.writeData('lastLogin', true)
                this.dataHandler.writeData('lastToken', JSON.parse(await token.text()).token)
                details.token = JSON.parse(await token.text()).token
            }
        }

        return details
    }
}
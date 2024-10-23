import termkit from 'terminal-kit'
import { Login } from '../types/local' ;
import { client, data } from '..';
import { HandleData } from '../handler/HandleData';

// const term = termkit.terminal()

export class LoginScreen {
    term: termkit.Terminal
    dataHandler: HandleData

    constructor(term: termkit.Terminal) {
        this.term = term;
        this.dataHandler = data
    }

    public async startLogin(): Promise<Login> {
        const details: Login = {}

        this.term.clear()

        this.term('Log in as guest? (y/N)')
        const guest = await this.term.yesOrNo({ yes: ['y'], no: ['n', 'ENTER'] }).promise

        if (guest) {
            // GUEST
            this.term('\nEnter your username: ')
            const username = await this.term.inputField().promise
            this.term('\nLogging in... ')
            details.anon = true
            details.username = username
        } else {
            // AUTHENTICATING
            if (this.dataHandler.getUser('lastLogin')) {
                const email = this.dataHandler.getUser('email')
                const password = this.dataHandler.getUser('password')
                this.term('\nLogging in... ')
                const token = await client.getToken(email, password)
                details.token = token
                details.anon = false
                this.dataHandler.writeUser('lastToken', details.token as string)
            } else {
                this.term('\nEnter your email: ')
                const email = await this.term.inputField().promise
                this.term('\nEnter your password: ')
                const password = await this.term.inputField({ echoChar: '*' }).promise
                this.term('\nLogging in... ')
                const token = await client.getToken(email as string, password as string)
                details.token = token
                this.dataHandler.writeUser('email', email || 'Empty')
                this.dataHandler.writeUser('password', password || 'Empty')
                this.dataHandler.writeUser('lastLogin', true)
                this.dataHandler.writeUser('lastToken', token)
                details.anon = false
                details.token = token
            }
        }

        return details
    }
}
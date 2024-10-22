import termkit from 'terminal-kit'

import { LoginScreen } from "./screens/LoginScreen";
import { HandleSocket } from './handler/HandleSocket';

const term = termkit.terminal()

const loginScreen = new LoginScreen(term, 'wss://chatws.nin0.dev', 'https://chatapi.nin0.dev')

loginScreen.startLogin().then((e) => {
    const ws = new HandleSocket(e)
    ws.manageMessages()
})
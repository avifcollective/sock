import termkit from 'terminal-kit'

import { LoginScreen } from "./screens/LoginScreen";
import { HandleSocket } from './handler/HandleSocket';
import { HandleMessage } from './handler/HandleMessage';
import { ChatScreen } from './screens/ChatScreen';

const term = termkit.terminal()

export const events = new HandleMessage()

const loginScreen = new LoginScreen(term, 'wss://chatws.nin0.dev', 'https://chatapi.nin0.dev')

loginScreen.startLogin().then((e) => {
    const ws = new HandleSocket(e)
    ws.manageMessages()
}).finally(() => {
    new ChatScreen(term).startChat()
})
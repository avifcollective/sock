import termkit from 'terminal-kit'

import { HandleData } from './handler/HandleData';
import { LoginScreen } from "./screens/LoginScreen";
import { ChatScreen } from './screens/ChatScreen';
import { HandleConnection } from './handler/HandleConnection';

const term = termkit.terminal()

export const client = new HandleConnection('wss://chatws.nin0.dev')
export const data = new HandleData()

const loginScreen = new LoginScreen(term)

loginScreen.startLogin().then((e) => {
    client.login(e)
}).finally(() => {
    new ChatScreen(term).startChat()
})
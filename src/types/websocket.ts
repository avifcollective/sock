export interface Message {
    userInfo: UserInfo,
    content: string,
    timestamp: bigint,
    id: string,
    device: Device,
}

interface UserInfo {
    username: string,
    roles: number,
    id: string,
}

enum Device {
    WEB = "web",
    MOBILE = "mobile",
    BOT = "bot",
}

export interface ReceiveMessage {
    op: 0
    d: Message
}

export interface ReceiveHistory {
    op: 3
    d: Message[]
}

export interface ReceiveHeartbeat {
    op: 2
    d: {}
}

export interface ReceiveMemberList {
    op: 4
    d: {
        users: {
            id: string
            username: string
        }[]
    }
}

export interface ReceiveError {
    op: -1
    d: {
        message: string
    }
}

export interface SendLogin {
    op: 1
    d: {
        anon: boolean
        username?: string
        device: Device
        token?: string
    }
}

export interface SendMessage {
    op: 0
    d: {
        content: string
    }
}
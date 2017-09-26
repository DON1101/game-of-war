export enum MessageType {
    START = 0,
    STOP = 1,
    RESET = 2,
    RUNNING = 3,
    YOU_WIN = 4,
    YOU_LOSE = 5
}

export class Message {
    constructor(private type: MessageType, private param: Map<String, any>) {}
}
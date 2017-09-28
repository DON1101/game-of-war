export enum MessageType {
    ASK_START = 0,
    ASK_STOP = 1,
    ASK_RESET = 2,
    ASK_TERMINATE = 3,
    ANSWER_RUNNING = 100,
    ANSWER_GAME_OVER = 101,
}

export class Message {
    constructor(private type: MessageType, private param: Map<String, any>) {}
}
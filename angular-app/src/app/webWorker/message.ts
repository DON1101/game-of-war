export enum MessageType {
    START = 0,
    STOP = 1,
    RESET = 2
}

export class Message {
    constructor(private type: MessageType, private param: Map<String, any>) {}
}
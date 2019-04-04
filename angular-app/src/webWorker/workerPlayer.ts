import { Message, MessageType } from '../base/message';
import { Context } from './context';
import { Player } from './player';

let judgePort;
let targetColor = "red";

onmessage = function(event) {
	let message = event.data;
	switch (parseInt(message.type)) {
		case MessageType.REPORT_CONNECT:
			judgePort = event.ports[0];
			judgePort.onmessage = messageFromJudge;
			break;
		default:
			break;
	}
};

let messageFromJudge = function(event) {
	let message = event.data;
	let context = null;
	switch (parseInt(message.type)) {
		// case MessageType.REPORT_WAR_FIELD_CONTEXT:
		// 	context = message.param.get("context");
		// 	Context.syncContext(context);
		// 	break;
		case MessageType.ASK_RUN:
			context = message.param.get("context");
			Context.syncContext(context);
			run();
			break;
        case MessageType.ASK_RESET:
            let playerCode = message.value;
            Player.resetPlayer(playerCode);
            break;
		default:
			break;
	}
}

let run = function() {
    if (Context.getContext().gameRunning) {
        for (let i in Context.getContext().soldierList) {
        	let soldier = Context.getContext().soldierList[i];
            if (soldier.color != targetColor) {
            	continue;
            }
            soldier = Player.copy(soldier);
            if (soldier.getAlive()) {
                try {
                    soldier.nextAction();
                } catch(e) {
                    console.log("Error: " + e);
                    Context.getContext().gameRunning = false;
                    return;
                }
            }
            let param = new Map<String, any>();
            param.set("id", soldier.getId());
            param.set("action", soldier.getLastAction());
            if (soldier.getLastAction() == "shoot") {
            	param.set("x", soldier.getLastActionParam()[0]);
            	param.set("y", soldier.getLastActionParam()[1]);
            }
            let retMsg = new Message(MessageType.REPORT_SOLDIER_ACTION, param);
            judgePort.postMessage(retMsg);
        }
    }
}

let logging = function(value: any) {
    let message = new Message(MessageType.LOGGING, null, value);
    judgePort.postMessage(message);
}

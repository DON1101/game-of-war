import { Message, MessageType } from '../base/message';

var judgePort;

onmessage = function(event) {
	let message = event.data;
	switch (parseInt(message.type)) {
		case MessageType.REPORT_CONNECT:
			judgePort = event.ports[0];
			break;
		default:
			break;
	}
};
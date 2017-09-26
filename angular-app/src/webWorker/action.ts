import { Context } from './context';
import { Position, Soldier } from './soldier';
import { Player } from './player';
import { Robot } from './robot';
import { Constant } from '../app/constant';
import { Message, MessageType } from '../base/message';

onmessage = (e: MessageEvent) => {
    let message = e.data;
    switch (parseInt(message.type)) {
        case MessageType.START:
            start();
            break;
        case MessageType.STOP:
            Context.getContext().gameRunning = false;
            break;
        case MessageType.RESET:
            Context.newContext();
            initMap();
            initSoldierRand();
            initSoldierNumDict();
            initDistMatrix();
            Context.getContext().gameRunning = true;
            postMessageType(MessageType.RUNNING);
            break;
        default:
            break;
    }    
};

let initMap = function() {
    Context.getContext().map = new Array(Constant.MAP_WIDTH_UNIT);
    for (let i = 0; i < Constant.MAP_WIDTH_UNIT; i++) {
        Context.getContext().map[i] = new Array(Constant.MAP_HEIGHT_UNIT);
    }
    resetMap();
    Context.getContext().youWin = null;
    return Context.getContext().map;
}

let resetMap = function() {
    for (let i = 0; i < Constant.MAP_WIDTH_UNIT; i++) {
        for (let j = 0; j < Constant.MAP_HEIGHT_UNIT; j++) {
            Context.getContext().map[i][j] = null;
        }
    }
}

let initSoldierRand = function() {
    Context.getContext().soldierList = new Array();
    for (let i = 0; i < Constant.COLOR_NUM; i++) {
        let color = Constant.COLOR_LIST[i];
        for (let j = 0; j < Constant.SOLDIER_NUM_EACH; j++) {
            let x = Math.floor(Math.random() * Constant.MAP_WIDTH_UNIT);
            let y = Math.floor(Math.random() * Constant.MAP_HEIGHT_UNIT);
            let position = new Position(x, y);
            let soldier = null;
            if (i == 0) {
                // init players
                soldier = new Player(position, color);
            } else {
                // init robots
                soldier = new Robot(position, color);
            }
            Context.getContext().soldierList.push(soldier);
        }
    }
    return Context.getContext().soldierList;
}

let initSoldierNumDict = function() {
    for (let i = 0; i < Constant.COLOR_NUM; i++) {
        let color = Constant.COLOR_LIST[i];
        Context.getContext().dictSoldierNum[color] = Constant.SOLDIER_NUM_EACH;
    }
}

let initDistMatrix = function() {
    Context.getContext().distMatrix = new Array(Context.getContext().soldierList.length);
    for (let i = 0; i < Context.getContext().soldierList.length; i++) {
        Context.getContext().distMatrix[i] = new Array(Context.getContext().soldierList.length);
    }
    return Context.getContext().distMatrix;
}

let updateDistMatrix = function() {
    for (let i = 0; i < Context.getContext().soldierList.length; i++) {
        let soldier1 = Context.getContext().soldierList[i];
        if (!soldier1.alive) {
            continue;
        }
        Context.getContext().map[soldier1.pos.x][soldier1.pos.y] = soldier1;
        for (let j = i+1; j < Context.getContext().soldierList.length; j++) {
            let soldier2 = Context.getContext().soldierList[j];
            if (!soldier2.alive) {
                continue;
            }
            let dist = soldier1.distWithSoldier(soldier2);
            Context.getContext().distMatrix[soldier1.id][soldier2.id] = dist;
            Context.getContext().distMatrix[soldier2.id][soldier1.id] = dist;
        }
    }
}

let updateHealth = function() {
    let deadSet = new Set(); // Everybody only dies once
    for (let i = 0; i < Context.getContext().soldierList.length; i++) {
        let soldier1 = Context.getContext().soldierList[i];
        if (!soldier1.alive || soldier1.bullet == null) {
            continue;
        }
        let minDistFromVictimCandi = Number.MAX_SAFE_INTEGER;
        let victimFinal = null;
        for (let j = 0; j < Context.getContext().soldierList.length; j++) {
            if (j == i) {
                continue; // skip self
            }
            let soldier2 = Context.getContext().soldierList[j];
            if (!soldier2.alive) {
                continue;
            }
            let dist = Context.getContext().distMatrix[soldier1.id][soldier2.id];
            if (dist < minDistFromVictimCandi &&
                dist <= Constant.SHOOT_RANGE_UNIT &&
                soldier2.shootableBy(soldier1)) {
                minDistFromVictimCandi = dist;
                victimFinal = soldier2;
            }
        }
        if (victimFinal != null) {
            victimFinal.shotBy(soldier1, minDistFromVictimCandi);
            if (!deadSet.has(victimFinal.id) && victimFinal.hp <= 0) {
                deadSet.add(victimFinal.id);
                Context.getContext().dictSoldierNum[victimFinal.color]--;
            }
        }
    }
}

let checkWinner = function() {
    let end = false;
    for (let color in Context.getContext().dictSoldierNum) {
        if (Context.getContext().dictSoldierNum[color] <= 0) {
            end = true;
        }
    }
    if (end) {
        Context.getContext().youWin = Context.getContext().dictSoldierNum[Constant.COLOR_LIST[0]]>Context.getContext().dictSoldierNum[Constant.COLOR_LIST[1]];
        if (Context.getContext().youWin) {
            postMessageType(MessageType.YOU_WIN);
        } else {
            postMessageType(MessageType.YOU_LOSE);
        }
        Context.getContext().gameRunning = false;
    }
}

let run = function() {
    if (Context.getContext().gameRunning) {
        checkWinner();
        resetMap();
        updateDistMatrix();
        updateHealth();

        for (let i in Context.getContext().soldierList) {
            let soldier = Context.getContext().soldierList[i];
            soldier.refresh();
            if (soldier.alive) {
                try {
                    soldier.nextAction();
                } catch(e) {
                    console.log("Error: " + e);
                    Context.getContext().gameRunning = false;
                    return;
                }
            }
        }
        postMessageType(MessageType.RUNNING);
        setTimeout(run, 10);
    }
}

let postMessageType = function(messageType: MessageType) {
    let param = new Map<String, any>();
    param.set("soldierList", Context.getContext().soldierList);
    param.set("dictSoldierNum", Context.getContext().dictSoldierNum);
    param.set("youWin", Context.getContext().youWin);
    let message = new Message(messageType, param);
    postMessage.apply(null, [message]);
}

let start = function() {
    run();
}
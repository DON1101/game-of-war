/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var context_1 = __webpack_require__(2);
var constant_1 = __webpack_require__(1);
var Position = (function () {
    function Position(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    return Position;
}());
exports.Position = Position;
;
var Soldier = (function () {
    function Soldier(position, color) {
        this.color = "#000000";
        this.hp = 100;
        this.alive = true;
        this.bullet = null;
        this.actionQuota = 1;
        this.shooter = null;
        this.id = context_1.Context.getContext().nextSoldierId++;
        this.pos = position;
        this.color = color;
    }
    Soldier.prototype.refresh = function () {
        this.bullet = null;
        this.shooter = null;
        this.actionQuota = 1;
        this.alive = (this.hp > 0);
    };
    Soldier.prototype.getHp = function () {
        return this.hp;
    };
    // Probe a position relative to self, e.g (1, 1), (-1, -1)
    // Return the soldier in the probed position if any
    Soldier.prototype.probePosition = function (relativeX, relativeY) {
        if (Math.abs(relativeX) > constant_1.Constant.SIGHT_RANGE_UNIT ||
            Math.abs(relativeY) > constant_1.Constant.SIGHT_RANGE_UNIT) {
            return null;
        }
        var x = this.pos.x + relativeX;
        var y = this.pos.y + relativeY;
        x = Math.max(x, 0);
        x = Math.min(x, constant_1.Constant.MAP_WIDTH_UNIT - 1);
        y = Math.max(y, 0);
        y = Math.min(y, constant_1.Constant.MAP_HEIGHT_UNIT - 1);
        var soldier = context_1.Context.getContext().map[x][y];
        if (soldier != null && soldier.alive) {
            return soldier;
        }
        else {
            return null;
        }
    };
    Soldier.prototype.distWithSoldier = function (soldier) {
        return Math.sqrt(Math.pow(this.pos.x - soldier.pos.x, 2) +
            Math.pow(this.pos.y - soldier.pos.y, 2));
    };
    Soldier.prototype.shootableBy = function (shooter) {
        if (!shooter.alive || shooter.bullet == null) {
            return false;
        }
        var x = this.pos.x;
        var y = this.pos.y;
        var xShooter = shooter.pos.x;
        var yShooter = shooter.pos.y;
        var xBullet = shooter.bullet.x;
        var yBullet = shooter.bullet.y;
        if (xBullet == 0) {
            return x == xShooter;
        }
        var kBullut = yBullet / (xBullet + 0.0);
        var dist = Math.abs(kBullut * x - y + yShooter - kBullut * xShooter) / Math.sqrt(Math.pow(kBullut, 2) + 1);
        return dist <= constant_1.Constant.UNIT_SIZE / 2.0;
    };
    Soldier.prototype.shotBy = function (shooter, distance) {
        var harm = Math.max(1 - distance / constant_1.Constant.SHOOT_RANGE_UNIT, 0);
        this.hp -= harm;
        this.shooter = shooter;
    };
    Soldier.prototype.moveUp = function () {
        if (this.actionQuota < 1) {
            return;
        }
        var y = Math.max(this.pos.y - 1, 0);
        if (context_1.Context.getContext().map[this.pos.x][y] == null) {
            this.pos.y = y;
        }
        this.actionQuota--;
    };
    ;
    Soldier.prototype.moveDown = function () {
        if (this.actionQuota < 1) {
            return;
        }
        var y = Math.min(this.pos.y + 1, constant_1.Constant.MAP_HEIGHT_UNIT - 1);
        if (context_1.Context.getContext().map[this.pos.x][y] == null) {
            this.pos.y = y;
        }
        this.actionQuota--;
    };
    ;
    Soldier.prototype.moveLeft = function () {
        if (this.actionQuota < 1) {
            return;
        }
        var x = Math.max(this.pos.x - 1, 0);
        if (context_1.Context.getContext().map[x][this.pos.y] == null) {
            this.pos.x = x;
        }
        this.actionQuota--;
    };
    ;
    Soldier.prototype.moveRight = function () {
        if (this.actionQuota < 1) {
            return;
        }
        var x = Math.min(this.pos.x + 1, constant_1.Constant.MAP_WIDTH_UNIT - 1);
        if (context_1.Context.getContext().map[x][this.pos.y] == null) {
            this.pos.x = x;
        }
        this.actionQuota--;
    };
    ;
    Soldier.prototype.shoot = function (x, y) {
        if (this.actionQuota < 1) {
            return;
        }
        this.bullet = new Position(x, y);
        this.actionQuota--;
    };
    ;
    Soldier.prototype.nextAction = function () {
        // to be implemented
    };
    ;
    return Soldier;
}());
exports.Soldier = Soldier;
;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Constant = (function () {
    function Constant() {
    }
    return Constant;
}());
Constant.UNIT_SIZE = 3; // px
Constant.MAP_WIDTH_UNIT = 200;
Constant.MAP_HEIGHT_UNIT = 200;
Constant.SOLDIER_NUM_EACH = 500;
Constant.COLOR_NUM = 2;
Constant.COLOR_LIST = ["red", "blue", "green", "black", "purple"];
Constant.SIGHT_RANGE_UNIT = 50; // how far can a soldier can see in sight
Constant.SHOOT_RANGE_UNIT = 50; // how far can a bullet can shoot
Constant.GAME_TOTAL_TIME = -1; // in seconds
Constant.PLAYER_CODE_DEFAULT = "\nPlayer.prototype.playerFunc = function(self) {\n/* \u6BCF\u4E00\u8F6E\u884C\u52A8\u4E2D\uFF0C\u58EB\u5175\u6700\u591A\u53EF\u4EE5\u6D88\u80171\u4E2A\u884C\u52A8\u6570\uFF0C\u58EB\u5175\u53EF\u4EE5\u6709\u5982\u4E0B\u884C\u52A8\u6307\u4EE4\uFF1A\nself.moveUp()\n    \u5411\u4E0A\u79FB\u52A8\u4E00\u4E2A\u5355\u4F4D\uFF0C\u8BE5\u6307\u4EE4\u6D88\u80171\u4E2A\u884C\u52A8\u6570\u3002\nself.moveDown()\n    \u5411\u4E0B\u79FB\u52A8\u4E00\u4E2A\u5355\u4F4D\uFF0C\u8BE5\u6307\u4EE4\u6D88\u80171\u4E2A\u884C\u52A8\u6570\u3002\nself.moveLeft()\n    \u5411\u5DE6\u79FB\u52A8\u4E00\u4E2A\u5355\u4F4D\uFF0C\u8BE5\u6307\u4EE4\u6D88\u80171\u4E2A\u884C\u52A8\u6570\u3002\nself.moveRight()\n    \u5411\u53F3\u79FB\u52A8\u4E00\u4E2A\u5355\u4F4D\uFF0C\u8BE5\u6307\u4EE4\u6D88\u80171\u4E2A\u884C\u52A8\u6570\u3002\nself.shoot(relativeX, relativeY)\n    \u5411\u67D0\u4E2A\u76F8\u5BF9\u65B9\u5411\u5F00\u67AA\u5C04\u51FB\uFF0C\u8BE5\u6307\u4EE4\u6D88\u80171\u4E2A\u884C\u52A8\u6570\u3002\nself.probePosition(relativeX, relativeY)\n    \u4FA6\u67E5\u67D0\u4E2A\u76F8\u5BF9\u4F4D\u7F6E\uFF0C\u5982\u679C\u8BE5\u4F4D\u7F6E\u6709\u58EB\u5175\uFF0C\u5219\u8FD4\u56DE\u8BE5\u58EB\u5175\u5BF9\u8C61\uFF0C\u5426\u5219\u8FD4\u56DEnull\u3002\u8BE5\u6307\u4EE4\u6D88\u80170\u4E2A\u884C\u52A8\u6570\u3002\n*/\nlet i = Math.floor(Math.random() * 5);\nswitch(i) {\n    case 0:\n        self.moveUp();\n        break;\n    case 1:\n        self.moveDown();\n        break;\n    case 2:\n        self.moveLeft();\n        break;\n    case 3:\n        self.moveRight();\n        break;\n    case 4:\n        let x = Math.floor(Math.random() * Constant.SIGHT_RANGE_UNIT) - Math.floor(Constant.SIGHT_RANGE_UNIT/2);\n        let y = Math.floor(Math.random() * Constant.SIGHT_RANGE_UNIT) - Math.floor(Constant.SIGHT_RANGE_UNIT/2);\n        self.shoot(x, y);\n        break;\n}\n}\n    ";
exports.Constant = Constant;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Context = (function () {
    function Context(gameRunning, gameTerminated, distMatrix, map, dictSoldierNum, youWin, soldierList, nextSoldierId) {
        if (gameRunning === void 0) { gameRunning = false; }
        if (gameTerminated === void 0) { gameTerminated = false; }
        if (distMatrix === void 0) { distMatrix = null; }
        if (map === void 0) { map = null; }
        if (dictSoldierNum === void 0) { dictSoldierNum = {}; }
        if (youWin === void 0) { youWin = null; }
        if (soldierList === void 0) { soldierList = null; }
        if (nextSoldierId === void 0) { nextSoldierId = 0; }
        this.gameRunning = gameRunning;
        this.gameTerminated = gameTerminated;
        this.distMatrix = distMatrix;
        this.map = map;
        this.dictSoldierNum = dictSoldierNum;
        this.youWin = youWin;
        this.soldierList = soldierList;
        this.nextSoldierId = nextSoldierId;
    }
    Context.newContext = function () {
        Context.singleton = new Context();
        return Context.singleton;
    };
    Context.getContext = function () {
        return Context.singleton;
    };
    return Context;
}());
Context.singleton = null;
exports.Context = Context;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var constant_1 = __webpack_require__(1);
var soldier_1 = __webpack_require__(0);
var Robot = (function (_super) {
    __extends(Robot, _super);
    function Robot(position, color) {
        return _super.call(this, position, color) || this;
    }
    Robot.prototype.randomAction = function () {
        var i = Math.floor(Math.random() * 4);
        switch (i) {
            case 0:
                this.moveUp();
                break;
            case 1:
                this.moveDown();
                break;
            case 2:
                this.moveLeft();
                break;
            case 3:
                this.moveRight();
                break;
        }
    };
    Robot.prototype.moveToward = function (soldier) {
        var xDelta = soldier.pos.x - this.pos.x;
        var yDelta = soldier.pos.y - this.pos.y;
        if (Math.abs(xDelta) > Math.abs(yDelta)) {
            xDelta > 0 ? this.moveRight() : this.moveLeft();
        }
        else {
            yDelta > 0 ? this.moveDown() : this.moveUp();
        }
    };
    Robot.prototype.shootToward = function (soldier) {
        if (soldier.color == this.color) {
            console.log(this);
        }
        var xDelta = soldier.pos.x - this.pos.x;
        var yDelta = soldier.pos.y - this.pos.y;
        this.shoot(xDelta, yDelta);
    };
    Robot.prototype.hasFriendNearby = function (xRelative, yRelative) {
        var soldier = null;
        soldier = this.probePosition(xRelative, yRelative - 1);
        if (soldier != null && soldier.color == this.color) {
            return true;
        }
        soldier = this.probePosition(xRelative, yRelative + 1);
        if (soldier != null && soldier.color == this.color) {
            return true;
        }
        soldier = this.probePosition(xRelative + 1, yRelative);
        if (soldier != null && soldier.color == this.color) {
            return true;
        }
        soldier = this.probePosition(xRelative + 1, yRelative + 1);
        if (soldier != null && soldier.color == this.color) {
            return true;
        }
        soldier = this.probePosition(xRelative + 1, yRelative - 1);
        if (soldier != null && soldier.color == this.color) {
            return true;
        }
        soldier = this.probePosition(xRelative - 1, yRelative + 1);
        if (soldier != null && soldier.color == this.color) {
            return true;
        }
        soldier = this.probePosition(xRelative - 1, yRelative + 1);
        if (soldier != null && soldier.color == this.color) {
            return true;
        }
        soldier = this.probePosition(xRelative - 1, yRelative);
        if (soldier != null && soldier.color == this.color) {
            return true;
        }
        return false;
    };
    Robot.prototype.shootNearestEnemy = function () {
        var nearestFriend = null;
        var nearestEnemy = null;
        for (var dist = 1; dist < constant_1.Constant.SIGHT_RANGE_UNIT; dist++) {
            for (var i = -dist; i <= dist; i++) {
                var soldier = null;
                soldier = this.probePosition(dist, i);
                if (soldier != null) {
                    if (soldier.color == this.color) {
                        if (nearestFriend == null) {
                            nearestFriend = soldier;
                        }
                    }
                    else {
                        if (nearestEnemy == null && !this.hasFriendNearby(dist, i)) {
                            nearestEnemy = soldier;
                            break;
                        }
                    }
                }
                soldier = this.probePosition(-dist, i);
                if (soldier != null) {
                    if (soldier.color == this.color) {
                        if (nearestFriend == null) {
                            nearestFriend = soldier;
                        }
                    }
                    else {
                        if (nearestEnemy == null && !this.hasFriendNearby(-dist, i)) {
                            nearestEnemy = soldier;
                            break;
                        }
                    }
                }
                soldier = this.probePosition(i, dist);
                if (soldier != null) {
                    if (soldier.color == this.color) {
                        if (nearestFriend == null) {
                            nearestFriend = soldier;
                        }
                    }
                    else {
                        if (nearestEnemy == null && !this.hasFriendNearby(i, dist)) {
                            nearestEnemy = soldier;
                            break;
                        }
                    }
                }
                soldier = this.probePosition(i, -dist);
                if (soldier != null) {
                    if (soldier.color == this.color) {
                        if (nearestFriend == null) {
                            nearestFriend = soldier;
                        }
                    }
                    else {
                        if (nearestEnemy == null && !this.hasFriendNearby(i, -dist)) {
                            nearestEnemy = soldier;
                            break;
                        }
                    }
                }
            }
            if (nearestEnemy != null) {
                break;
            }
        }
        if (nearestEnemy != null) {
            if (Math.random() < 0.5) {
                this.moveToward(nearestEnemy);
            }
            else {
                this.shootToward(nearestEnemy);
            }
            return;
        }
        if (nearestFriend != null) {
            this.moveToward(nearestFriend);
            return;
        }
        this.randomAction();
    };
    Robot.prototype.nextAction = function () {
        this.shootNearestEnemy();
    };
    ;
    return Robot;
}(soldier_1.Soldier));
exports.Robot = Robot;
;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var constant_1 = __webpack_require__(1);
var soldier_1 = __webpack_require__(0);
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(position, color) {
        return _super.call(this, position, color) || this;
    }
    Player.resetPlayer = function (playerCode) {
        constant_1.Constant.PLAYER_CODE_DEFAULT; // We should keep this here, otherwise "constant_1" cannot be found
        var finalCode = playerCode.replace(new RegExp("Constant\.", 'g'), "constant_1.Constant.");
        eval(finalCode);
    };
    Player.prototype.nextAction = function () {
        Player.prototype["playerFunc"](this);
    };
    return Player;
}(soldier_1.Soldier));
exports.Player = Player;
;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(2);
__webpack_require__(0);
__webpack_require__(3);
__webpack_require__(4);
module.exports = __webpack_require__(6);


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var context_1 = __webpack_require__(2);
var soldier_1 = __webpack_require__(0);
var player_1 = __webpack_require__(4);
var robot_1 = __webpack_require__(3);
var constant_1 = __webpack_require__(1);
var message_1 = __webpack_require__(7);
onmessage = function (e) {
    var message = e.data;
    switch (parseInt(message.type)) {
        case message_1.MessageType.ASK_START:
            context_1.Context.getContext().gameRunning = true;
            start();
            break;
        case message_1.MessageType.ASK_STOP:
            context_1.Context.getContext().gameRunning = false;
            break;
        case message_1.MessageType.ASK_RESET:
            player_1.Player.resetPlayer(message.param.get("playerCode"));
            context_1.Context.newContext();
            initMap();
            initSoldierRand();
            initSoldierNumDict();
            initDistMatrix();
            postMessageType(message_1.MessageType.ANSWER_RUNNING);
            break;
        case message_1.MessageType.ASK_TERMINATE:
            context_1.Context.getContext().gameTerminated = true;
            break;
        default:
            break;
    }
};
var initMap = function () {
    context_1.Context.getContext().map = new Array(constant_1.Constant.MAP_WIDTH_UNIT);
    for (var i = 0; i < constant_1.Constant.MAP_WIDTH_UNIT; i++) {
        context_1.Context.getContext().map[i] = new Array(constant_1.Constant.MAP_HEIGHT_UNIT);
    }
    resetMap();
    context_1.Context.getContext().youWin = null;
    return context_1.Context.getContext().map;
};
var resetMap = function () {
    for (var i = 0; i < constant_1.Constant.MAP_WIDTH_UNIT; i++) {
        for (var j = 0; j < constant_1.Constant.MAP_HEIGHT_UNIT; j++) {
            context_1.Context.getContext().map[i][j] = null;
        }
    }
};
var initSoldierRand = function () {
    context_1.Context.getContext().soldierList = new Array();
    for (var i = 0; i < constant_1.Constant.COLOR_NUM; i++) {
        var color = constant_1.Constant.COLOR_LIST[i];
        for (var j = 0; j < constant_1.Constant.SOLDIER_NUM_EACH; j++) {
            var x = Math.floor(Math.random() * constant_1.Constant.MAP_WIDTH_UNIT);
            var y = Math.floor(Math.random() * constant_1.Constant.MAP_HEIGHT_UNIT);
            var position = new soldier_1.Position(x, y);
            var soldier = null;
            if (i == 0) {
                // init players
                soldier = new player_1.Player(position, color);
            }
            else {
                // init robots
                soldier = new robot_1.Robot(position, color);
            }
            context_1.Context.getContext().soldierList.push(soldier);
        }
    }
    return context_1.Context.getContext().soldierList;
};
var initSoldierNumDict = function () {
    for (var i = 0; i < constant_1.Constant.COLOR_NUM; i++) {
        var color = constant_1.Constant.COLOR_LIST[i];
        context_1.Context.getContext().dictSoldierNum[color] = constant_1.Constant.SOLDIER_NUM_EACH;
    }
};
var initDistMatrix = function () {
    context_1.Context.getContext().distMatrix = new Array(context_1.Context.getContext().soldierList.length);
    for (var i = 0; i < context_1.Context.getContext().soldierList.length; i++) {
        context_1.Context.getContext().distMatrix[i] = new Array(context_1.Context.getContext().soldierList.length);
    }
    return context_1.Context.getContext().distMatrix;
};
var updateDistMatrix = function () {
    for (var i = 0; i < context_1.Context.getContext().soldierList.length; i++) {
        var soldier1 = context_1.Context.getContext().soldierList[i];
        if (!soldier1.alive) {
            continue;
        }
        context_1.Context.getContext().map[soldier1.pos.x][soldier1.pos.y] = soldier1;
        for (var j = i + 1; j < context_1.Context.getContext().soldierList.length; j++) {
            var soldier2 = context_1.Context.getContext().soldierList[j];
            if (!soldier2.alive) {
                continue;
            }
            var dist = soldier1.distWithSoldier(soldier2);
            context_1.Context.getContext().distMatrix[soldier1.id][soldier2.id] = dist;
            context_1.Context.getContext().distMatrix[soldier2.id][soldier1.id] = dist;
        }
    }
};
var updateHealth = function () {
    var deadSet = new Set(); // Everybody only dies once
    for (var i = 0; i < context_1.Context.getContext().soldierList.length; i++) {
        var soldier1 = context_1.Context.getContext().soldierList[i];
        if (!soldier1.alive || soldier1.bullet == null) {
            continue;
        }
        var minDistFromVictimCandi = Number.MAX_SAFE_INTEGER;
        var victimFinal = null;
        for (var j = 0; j < context_1.Context.getContext().soldierList.length; j++) {
            if (j == i) {
                continue; // skip self
            }
            var soldier2 = context_1.Context.getContext().soldierList[j];
            if (!soldier2.alive) {
                continue;
            }
            var dist = context_1.Context.getContext().distMatrix[soldier1.id][soldier2.id];
            if (dist < minDistFromVictimCandi &&
                dist <= constant_1.Constant.SHOOT_RANGE_UNIT &&
                soldier2.shootableBy(soldier1)) {
                minDistFromVictimCandi = dist;
                victimFinal = soldier2;
            }
        }
        if (victimFinal != null) {
            victimFinal.shotBy(soldier1, minDistFromVictimCandi);
            if (!deadSet.has(victimFinal.id) && victimFinal.hp <= 0) {
                deadSet.add(victimFinal.id);
                context_1.Context.getContext().dictSoldierNum[victimFinal.color]--;
            }
        }
    }
};
var checkWinner = function () {
    var end = false;
    for (var color in context_1.Context.getContext().dictSoldierNum) {
        if (context_1.Context.getContext().dictSoldierNum[color] <= 0) {
            end = true;
        }
    }
    if (context_1.Context.getContext().gameTerminated) {
        end = true;
    }
    if (end) {
        context_1.Context.getContext().youWin = context_1.Context.getContext().dictSoldierNum[constant_1.Constant.COLOR_LIST[0]] > context_1.Context.getContext().dictSoldierNum[constant_1.Constant.COLOR_LIST[1]];
        context_1.Context.getContext().gameRunning = false;
        postMessageType(message_1.MessageType.ANSWER_GAME_OVER);
    }
};
var run = function () {
    if (context_1.Context.getContext().gameRunning) {
        for (var i in context_1.Context.getContext().soldierList) {
            var soldier = context_1.Context.getContext().soldierList[i];
            soldier.refresh();
            if (soldier.alive) {
                try {
                    soldier.nextAction();
                }
                catch (e) {
                    console.log("Error: " + e);
                    context_1.Context.getContext().gameRunning = false;
                    return;
                }
            }
        }
        checkWinner();
        resetMap();
        updateDistMatrix();
        updateHealth();
        postMessageType(message_1.MessageType.ANSWER_RUNNING);
        setTimeout(run, 10);
    }
};
var postMessageType = function (messageType) {
    var param = new Map();
    param.set("soldierList", context_1.Context.getContext().soldierList);
    param.set("dictSoldierNum", context_1.Context.getContext().dictSoldierNum);
    param.set("youWin", context_1.Context.getContext().youWin);
    param.set("gameRunning", context_1.Context.getContext().gameRunning);
    var message = new message_1.Message(messageType, param);
    postMessage.apply(null, [message]);
};
var start = function () {
    run();
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var MessageType;
(function (MessageType) {
    MessageType[MessageType["ASK_START"] = 0] = "ASK_START";
    MessageType[MessageType["ASK_STOP"] = 1] = "ASK_STOP";
    MessageType[MessageType["ASK_RESET"] = 2] = "ASK_RESET";
    MessageType[MessageType["ASK_TERMINATE"] = 3] = "ASK_TERMINATE";
    MessageType[MessageType["ANSWER_RUNNING"] = 100] = "ANSWER_RUNNING";
    MessageType[MessageType["ANSWER_GAME_OVER"] = 101] = "ANSWER_GAME_OVER";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
var Message = (function () {
    function Message(type, param) {
        this.type = type;
        this.param = param;
    }
    return Message;
}());
exports.Message = Message;


/***/ })
/******/ ]);
//# sourceMappingURL=worker.map
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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports) {

onmessage = function (e) {
    console.log(e.data);
    initMap();
    soldierList = initSoldierRand();
    initSoldierNumDict();
    initDistMatrix(soldierList);
    gameRunning = true;
    start();
};
// var UNIT_SIZE = 3; // px
// var MAP_WIDTH_UNIT = 200;
// var MAP_HEIGHT_UNIT = 200;
// var SOLDIER_NUM_EACH = 1000;
// var COLOR_NUM = 2;
// var COLOR_LIST = ["red", "blue", "green", "black", "purple"];
// var SIGHT_RANGE_UNIT = 500; // how far can a soldier can see in sight
// var SHOOT_RANGE_UNIT = 50; // how far can a bullet can shoot
// var GAME_TOTAL_TIME = 60; // in seconds
var param = null;
var gameRunning = true;
var distMatrix = null;
var map = null;
var dictSoldierNum = {};
var youWin = null;
var soldierList = null;
var nextSoldierId = 0;
var initMap = function () {
    map = new Array(MAP_WIDTH_UNIT);
    for (var i = 0; i < MAP_WIDTH_UNIT; i++) {
        map[i] = new Array(MAP_HEIGHT_UNIT);
    }
    resetMap();
    youWin = null;
    return map;
};
var resetMap = function () {
    for (var i = 0; i < MAP_WIDTH_UNIT; i++) {
        for (var j = 0; j < MAP_HEIGHT_UNIT; j++) {
            map[i][j] = null;
        }
    }
};
var initSoldierRand = function () {
    var soldierList = new Array();
    for (var i = 0; i < COLOR_NUM; i++) {
        var color = COLOR_LIST[i];
        for (var j = 0; j < SOLDIER_NUM_EACH; j++) {
            var x = Math.floor(Math.random() * MAP_WIDTH_UNIT);
            var y = Math.floor(Math.random() * MAP_HEIGHT_UNIT);
            var position = new Position(x, y);
            if (i == 0) {
                // init players
                var soldier = new Player(position, color);
            }
            else {
                // init robots
                var soldier = new Robot(position, color);
            }
            soldierList.push(soldier);
        }
    }
    return soldierList;
};
var initSoldierNumDict = function () {
    for (var i = 0; i < COLOR_NUM; i++) {
        var color = COLOR_LIST[i];
        dictSoldierNum[color] = SOLDIER_NUM_EACH;
    }
};
var initDistMatrix = function (soldierList) {
    distMatrix = new Array(soldierList.length);
    for (var i = 0; i < soldierList.length; i++) {
        distMatrix[i] = new Array(soldierList.length);
    }
    return distMatrix;
};
var updateDistMatrix = function (soldierList) {
    for (var i = 0; i < soldierList.length; i++) {
        var soldier1 = soldierList[i];
        if (!soldier1.alive) {
            continue;
        }
        map[soldier1.pos.x][soldier1.pos.y] = soldier1;
        for (var j = i + 1; j < soldierList.length; j++) {
            var soldier2 = soldierList[j];
            if (!soldier2.alive) {
                continue;
            }
            var dist = soldier1.distWithSoldier(soldier2);
            distMatrix[soldier1.id][soldier2.id] = dist;
            distMatrix[soldier2.id][soldier1.id] = dist;
        }
    }
};
var updateHealth = function (soldierList) {
    var deadSet = new Set(); // Everybody only dies once
    for (var i = 0; i < soldierList.length; i++) {
        var soldier1 = soldierList[i];
        if (!soldier1.alive || soldier1.bullet == null) {
            continue;
        }
        var minDistFromVictimCandi = Number.MAX_SAFE_INTEGER;
        var victimFinal = null;
        for (var j = 0; j < soldierList.length; j++) {
            if (j == i) {
                continue; // skip self
            }
            var soldier2 = soldierList[j];
            if (!soldier2.alive) {
                continue;
            }
            var dist = distMatrix[soldier1.id][soldier2.id];
            if (dist < minDistFromVictimCandi &&
                dist <= SHOOT_RANGE_UNIT &&
                soldier2.shootableBy(soldier1)) {
                minDistFromVictimCandi = dist;
                victimFinal = soldier2;
            }
        }
        if (victimFinal != null) {
            victimFinal.shotBy(soldier1, minDistFromVictimCandi);
            if (!deadSet.has(victimFinal.id) && victimFinal.hp <= 0) {
                deadSet.add(victimFinal.id);
                dictSoldierNum[victimFinal.color]--;
            }
        }
    }
};
var checkWinner = function () {
    var end = false;
    for (var color in dictSoldierNum) {
        if (dictSoldierNum[color] <= 0) {
            end = true;
        }
    }
    if (end) {
        youWin = dictSoldierNum[COLOR_LIST[0]] > dictSoldierNum[COLOR_LIST[1]];
        postMessage(youWin ? "You win" : "You lose");
        gameRunning = false;
    }
};
var run = function () {
    if (gameRunning) {
        checkWinner();
        resetMap();
        updateDistMatrix(soldierList);
        updateHealth(soldierList);
        for (var i in soldierList) {
            soldier = soldierList[i];
            soldier.refresh();
            if (soldier.alive) {
                try {
                    soldier.nextAction();
                }
                catch (e) {
                    console.log("Error: " + e);
                    gameRunning = false;
                    return;
                }
            }
        }
        postMessage(soldierList);
        setTimeout(run, 10);
    }
};
var start = function () {
    run();
};


/***/ })
/******/ ]);
//# sourceMappingURL=worker.map
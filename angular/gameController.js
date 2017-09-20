gameApp
.controller("gameController", function($scope, $interval) {
    $scope.COLOR_NUM = COLOR_NUM;
    $scope.COLOR_LIST = COLOR_LIST;
    $scope.SOLDIER_NUM_EACH = SOLDIER_NUM_EACH;
    $scope.GAME_TOTAL_TIME = GAME_TOTAL_TIME;

    $scope.userCode = userCodeDefault;
    $scope.dictSoldierNum = {};
    $scope.youWin = null;
    $scope.timeElapsed = 0;

    var timerStop = null;

    var initMap = function() {
        map = new Array(MAP_WIDTH_UNIT);
        for (var i = 0; i < MAP_WIDTH_UNIT; i++) {
            map[i] = new Array(MAP_HEIGHT_UNIT);
        }
        resetMap();
        nextSoldierId = 0;
        $scope.youWin = null;
        $scope.timeElapsed = 0;
        return map;
    }

    var resetMap = function() {
        for (var i = 0; i < MAP_WIDTH_UNIT; i++) {
            for (var j = 0; j < MAP_HEIGHT_UNIT; j++) {
                map[i][j] = null;
            }
        }
    }

    var initSoldierRand = function() {
        var soldierList = new Array();
        for (var i = 0; i < COLOR_NUM; i++) {
            var color = COLOR_LIST[i];
            $scope.dictSoldierNum[color] = SOLDIER_NUM_EACH;
            for (var j = 0; j < SOLDIER_NUM_EACH; j++) {
                var x = Math.floor(Math.random() * MAP_WIDTH_UNIT);
                var y = Math.floor(Math.random() * MAP_HEIGHT_UNIT);
                var position = new Position(x, y);
                if (i == 0) {
                    // init players
                    var soldier = new Player(position, color);
                } else {
                    // init robots
                    var soldier = new Robot(position, color);
                }
                soldierList.push(soldier);
            }
        }
        return soldierList;
    }

    var initDistMatrix = function(soldierList) {
        distMatrix = new Array(soldierList.length);
        for (var i = 0; i < soldierList.length; i++) {
            distMatrix[i] = new Array(soldierList.length);
        }
        return distMatrix;
    }

    var drawMap = function(ctx, soldierList) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i in soldierList) {
            var soldier = soldierList[i];
            if (!soldier.alive) {
                continue;
            }
            ctx.fillStyle = soldier.color;
            ctx.fillRect(soldier.pos.x*UNIT_SIZE, soldier.pos.y*UNIT_SIZE, UNIT_SIZE, UNIT_SIZE);
        }
    }

    var updateDistMatrix = function(soldierList) {
        for (var i = 0; i < soldierList.length; i++) {
            var soldier1 = soldierList[i];
            if (!soldier1.alive) {
                continue;
            }
            map[soldier1.pos.x][soldier1.pos.y] = soldier1;
            for (var j = i+1; j < soldierList.length; j++) {
                var soldier2 = soldierList[j];
                if (!soldier2.alive) {
                    continue;
                }
                var dist = soldier1.distWithSoldier(soldier2);
                distMatrix[soldier1.id][soldier2.id] = dist;
                distMatrix[soldier2.id][soldier1.id] = dist;
            }
        }
    }

    var updateHealth = function(soldierList) {
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
                    $scope.dictSoldierNum[victimFinal.color]--;
                }
            }
        }
    }

    var checkWinner = function() {
        var end = false;
        for (var color in $scope.dictSoldierNum) {
            if ($scope.dictSoldierNum[color] <= 0) {
                end = true;
            }
        }
        if (GAME_TOTAL_TIME > 0 && $scope.timeElapsed >= GAME_TOTAL_TIME) {
            end = true;
        }
        if (end) {
            $scope.youWin = $scope.dictSoldierNum[COLOR_LIST[0]]>$scope.dictSoldierNum[COLOR_LIST[1]];
            $scope.stopGame();
        }
        if(!$scope.$$phase) {
            $scope.$apply();
        }
    }

    var run = function() {
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
                } catch(e) {
                    alert("Error: " + e);
                    $scope.stopGame();
                    return;
                }
            }
        }
        drawMap(context, soldierList);
    }

    var runGame = function() {
        if (gameRunning) {
            requestAnimFrame(runGame);
            run();
        }
    }

    $scope.resetGame = function() {
        $scope.stopGame();
        initMap();
        soldierList = initSoldierRand();
        initDistMatrix(soldierList);
        drawMap(context, soldierList);
    }

    $scope.startGame = function() {
        gameRunning = true;
        runGame();

        // Timer
        if (timerStop != null) {
            $interval.cancel(timerStop);
        }
        timerStop = $interval(function() {
            $scope.timeElapsed++;
        }, 1000);
    }

    $scope.stopGame = function() {
        gameRunning = false;
        $interval.cancel(timerStop);
    }

    $scope.applyCode = function() {
        try {
            Player.prototype.nextAction = new Function($scope.userCode);
        } catch(e) {
            alert("Error: " + e);
            return;
        }
        $scope.resetGame();
    }

    $scope.init = function() {
        canvas = document.getElementById('canvas');
        context = canvas.getContext('2d');
        canvas.height = UNIT_SIZE * MAP_HEIGHT_UNIT;
        canvas.width = UNIT_SIZE * MAP_WIDTH_UNIT;

        $scope.resetGame();
    };
});
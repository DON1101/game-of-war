angular.module("gameApp", [])
.controller("gameController", function($scope, $interval) {
    $scope.userCode = userCodeDefault;

    var initMap = function() {
        map = new Array(MAP_WIDTH_UNIT);
        for (var i = 0; i < MAP_WIDTH_UNIT; i++) {
            map[i] = new Array(MAP_HEIGHT_UNIT);
        }
        resetMap();
        nextSoldierId = 0;
        return map;
    }

    var resetMap = function() {
        for (var i = 0; i < MAP_WIDTH_UNIT; i++) {
            for (var j = 0; j < MAP_HEIGHT_UNIT; j++) {
                map[i][j] = null;
            }
        }
    }

    var initColor = function() {
        var colorList = ["red", "blue", "green", "black", "purple"];
        return colorList;
    }

    var initSoldierRand = function(colorList) {
        var soldierList = new Array();
        for (var i = 0; i < COLOR_NUM; i++) {
            var color = colorList[i];
            dictSoldierNum[color] = SOLDIER_NUM_EACH;
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
            if (!soldier.alive()) {
                continue;
            }
            ctx.fillStyle = soldier.color;
            ctx.fillRect(soldier.pos.x*UNIT_SIZE, soldier.pos.y*UNIT_SIZE, UNIT_SIZE, UNIT_SIZE);
        }
    }

    var updateDistMatrix = function(soldierList) {
        for (var i = 0; i < soldierList.length; i++) {
            var soldier1 = soldierList[i];
            if (!soldier1.alive()) {
                continue;
            }
            map[soldier1.pos.x][soldier1.pos.y] = soldier1;
            for (var j = i+1; j < soldierList.length; j++) {
                var soldier2 = soldierList[j];
                if (!soldier2.alive()) {
                    continue;
                }
                var dist = soldier1.distWithSoldier(soldier2);
                distMatrix[soldier1.id][soldier2.id] = dist;
                distMatrix[soldier2.id][soldier1.id] = dist;
            }
        }
    }

    var updateHealth = function(soldierList) {
        for (var i = 0; i < soldierList.length; i++) {
            var soldier1 = soldierList[i];
            if (!soldier1.alive() || soldier1.bullet == null) {
                continue;
            }
            var minDistFromVictimCandi = Number.MAX_SAFE_INTEGER;
            var victimFinal = null;
            for (var j = 0; j < soldierList.length; j++) {
                if (j == i) {
                    continue; // skip self
                }
                var soldier2 = soldierList[j];
                if (!soldier2.alive()) {
                    continue;
                }
                var dist = distMatrix[soldier1.id][soldier2.id];
                if (dist < minDistFromVictimCandi &&
                    soldier2.shootableBy(soldier1)) {
                    minDistFromVictimCandi = dist;
                    victimFinal = soldier2;
                }
            }
            if (victimFinal != null) {
                victimFinal.shotBy(soldier1);
                if (!victimFinal.alive()) {
                    dictSoldierNum[victimFinal.color]--;
                }
            }
        }
    }

    var checkWinner = function() {
        for (var color in dictSoldierNum) {
            if (dictSoldierNum[color] <= 0) {
                alert("Color " + color + " lose!");
                $scope.stopGame();
            }
        }
    }

    var run = function() {
        checkWinner();
        resetMap();
        updateDistMatrix(soldierList);
        updateHealth(soldierList);

        for (var i in soldierList) {
            soldier = soldierList[i];
            soldier.resetAction();
            if (soldier.alive()) {
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

    $scope.resetGame = function() {
        $scope.stopGame();
        initMap();
        var colorList = initColor();
        soldierList = initSoldierRand(colorList);
        initDistMatrix(soldierList);
        drawMap(context, soldierList);
    }

    $scope.startGame = function() {
        $scope.stopGame();
        gameStop = $interval(function() {
            run();       
        }, 0);
    }

    $scope.stopGame = function() {
        if (angular.isDefined(gameStop)) {
            $interval.cancel(gameStop);
            gameStop = undefined;
        }
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
import { Component, ViewChild, ElementRef, Inject, EventEmitter, Output, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Constant } from '../constant';
import { Message, MessageType } from '../../base/message';

@Component({
    selector: 'battle-field',
    templateUrl: './battle_field.component.html',
    providers: [
        { provide: Window, useValue: window }  
    ]
})
export class BattleFieldComponent {
    constructor(@Inject(Window) private _window: Window) {}
    @ViewChild("canvasGame") canvasRef: ElementRef;
    @Input() playerCode: string;
    @Output() onPrepare = new EventEmitter<string>();

    COLOR_NUM = Constant.COLOR_NUM;
    COLOR_LIST = Constant.COLOR_LIST;
    GAME_TOTAL_TIME = Constant.GAME_TOTAL_TIME;
    SOLDIER_NUM_EACH = Constant.SOLDIER_NUM_EACH;

    private worker: Worker;
    private requestAnimFrame;
    private canvas = null;
    private context = null;
    private timeElapsed = 0;
    private subscription = null;

    // Context fetched from web worker
    dictSoldierNum = {};
    youWin = null;
    gameRunning = false;
    soldierList = [];

    private drawMap = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (var i in this.soldierList) {
            var soldier = this.soldierList[i];
            if (!soldier.alive) {
                continue;
            }

            // Draw soldier
            this.context.fillStyle = soldier.color;
            this.context.fillRect(
                soldier.pos.x*Constant.UNIT_SIZE, 
                soldier.pos.y*Constant.UNIT_SIZE, 
                Constant.UNIT_SIZE, 
                Constant.UNIT_SIZE);

            // Draw health bar
            var cutOff = Math.floor(soldier.hp / 100.0 * Constant.HEALTH_BAR_LENGTH_UNIT);
            this.context.beginPath();
            this.context.strokeStyle='green';
            this.context.moveTo(
                (soldier.pos.x - Constant.HEALTH_BAR_LENGTH_UNIT/2)*Constant.UNIT_SIZE, 
                (soldier.pos.y - 1)*Constant.UNIT_SIZE);
            this.context.lineTo(
                (soldier.pos.x - Constant.HEALTH_BAR_LENGTH_UNIT/2 + cutOff)*Constant.UNIT_SIZE, 
                (soldier.pos.y - 1)*Constant.UNIT_SIZE);
            this.context.stroke();
            this.context.beginPath();
            this.context.strokeStyle='grey';
            this.context.moveTo(
                (soldier.pos.x - Constant.HEALTH_BAR_LENGTH_UNIT/2 + cutOff)*Constant.UNIT_SIZE, 
                (soldier.pos.y - 1)*Constant.UNIT_SIZE);
            this.context.lineTo(
                (soldier.pos.x + Constant.HEALTH_BAR_LENGTH_UNIT/2)*Constant.UNIT_SIZE, 
                (soldier.pos.y - 1)*Constant.UNIT_SIZE);
            this.context.stroke();

            // Draw shooting track
            if (soldier.shooter != null) {
                this.context.beginPath();
                this.context.strokeStyle = soldier.shooter.color;
                this.context.moveTo(
                    soldier.shooter.pos.x*Constant.UNIT_SIZE+Constant.UNIT_SIZE/2,
                    soldier.shooter.pos.y*Constant.UNIT_SIZE+Constant.UNIT_SIZE/2);
                this.context.lineTo(
                    soldier.pos.x*Constant.UNIT_SIZE+Constant.UNIT_SIZE/2,
                    soldier.pos.y*Constant.UNIT_SIZE+Constant.UNIT_SIZE/2);
                this.context.stroke();
            }
        }
    }

    private render = (e) => {
        let message = e.data;
        this.soldierList = message.param.get("soldierList");
        this.dictSoldierNum = message.param.get("dictSoldierNum");
        this.youWin = message.param.get("youWin");
        this.gameRunning = message.param.get("gameRunning");
        this.requestAnimFrame(this.drawMap);
        if (message.type == MessageType.ANSWER_GAME_OVER) {
            this.stopTimer();
        }
    }

    private initWebWorker = () => {
        this.worker = new Worker('worker.bundle.js');
        this.worker.addEventListener('message', this.render);
    }

    private initRender = () => {
        this.requestAnimFrame = 
            this._window.requestAnimationFrame       ||
            this._window.webkitRequestAnimationFrame ||
            function( callback ){
                this._window.setTimeout(callback, 1000 / 60);
            };
    }

    private startTimer = () => {
        this.stopTimer();
        this.subscription = Observable.interval(1000).subscribe(res => {
            this.timeElapsed++;
            if (Constant.GAME_TOTAL_TIME > 0 && this.timeElapsed >= Constant.GAME_TOTAL_TIME) {
                this.terminateGame();
            }
        });
    }

    private stopTimer = () => {
        if (this.subscription != null) {
            this.subscription.unsubscribe();
        }
    }

    private resetTimer = () => {
        this.stopTimer();
        this.timeElapsed = 0;
    }

    public startGame = () => {
        let message = new Message(MessageType.ASK_START, null);
        this.worker.postMessage(message);
        this.startTimer();
    }

    public stopGame = () => {
        let message = new Message(MessageType.ASK_STOP, null);
        this.worker.postMessage(message);
        this.stopTimer();
    }

    public terminateGame = () => {
        let message = new Message(MessageType.ASK_TERMINATE, null);
        this.worker.postMessage(message);
        this.stopTimer();
    }

    public resetGame = () => {
        let param = new Map<String, any>();
        param.set("playerCode", this.playerCode);
        let message = new Message(MessageType.ASK_RESET, param);
        this.worker.postMessage(message);
        this.resetTimer();
    }

    public prepare() {
        this.onPrepare.emit();
    }

    ngOnInit() {
        this.canvas = this.canvasRef.nativeElement;
        this.context = this.canvas.getContext('2d');
        this.canvas.height = Constant.UNIT_SIZE * Constant.MAP_HEIGHT_UNIT;
        this.canvas.width = Constant.UNIT_SIZE * Constant.MAP_WIDTH_UNIT;

        this.initRender();
        this.initWebWorker();
        this.resetGame();
    }
}
import { Component, ViewChild, ElementRef, Inject } from '@angular/core';
import { Constant } from '../constant';
import { Message, MessageType } from '../../base/message';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['../app.component.css'],
    providers: [
        { provide: Window, useValue: window }  
    ]
})
export class DashboardComponent {
    constructor(@Inject(Window) private _window: Window) {}

    COLOR_NUM = Constant.COLOR_NUM;
    COLOR_LIST = Constant.COLOR_LIST;
    GAME_TOTAL_TIME = Constant.GAME_TOTAL_TIME;
    SOLDIER_NUM_EACH = Constant.SOLDIER_NUM_EACH;

    private worker: Worker;
    private requestAnimFrame;

    dictSoldierNum = {};
    youWin = null;
    timeElapsed = 0;
    canvas = null;
    context = null;
    soldierList = [];

    @ViewChild("canvasGame") canvasRef: ElementRef;

    private drawMap = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (var i in this.soldierList) {
            var soldier = this.soldierList[i];
            if (!soldier.alive) {
                continue;
            }
            this.context.fillStyle = soldier.color;
            this.context.fillRect(soldier.pos.x*Constant.UNIT_SIZE, soldier.pos.y*Constant.UNIT_SIZE, Constant.UNIT_SIZE, Constant.UNIT_SIZE);
        }
    }

    private render = (e) => {
        let message = e.data;
        this.soldierList = message.param.get("soldierList");
        this.dictSoldierNum = message.param.get("dictSoldierNum");
        this.youWin = message.param.get("youWin");
        this.requestAnimFrame(this.drawMap);
    }

    private initWebWorker = () => {
        this.worker = new Worker('worker.js');
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

    public startGame = () => {
        let message = new Message(MessageType.START, null);
        this.worker.postMessage(message);
    }

    public stopGame = () => {
        let message = new Message(MessageType.STOP, null);
        this.worker.postMessage(message);
    }

    public resetGame = () => {
        let message = new Message(MessageType.RESET, null);
        this.worker.postMessage(message);
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
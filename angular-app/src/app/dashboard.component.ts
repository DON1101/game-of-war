import { Component, ViewChild, ElementRef, Inject } from '@angular/core';
import { Constant } from './constant';
import { WebWorkerSoldier } from './webWorker/soldier';
import { WebWorkerRobot } from './webWorker/robot';
import { WebWorkerPlayer } from './webWorker/player';
import { WebWorkerAction } from './webWorker/action';
import { Message } from './webWorker/message';
import { MessageType } from './webWorker/message';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./app.component.css'],
    providers: [
        { provide: Window, useValue: window }  
    ]
})
export class DashboardComponent {
    constructor(@Inject(Window) private _window: Window) {}

    COLOR_NUM = Constant.COLOR_NUM;
    COLOR_LIST = Constant.COLOR_LIST;
    GAME_TOTAL_TIME = Constant.GAME_TOTAL_TIME;

    private worker: Worker;

    dictSoldierNum = {};
    youWin = null;
    timeElapsed = 0;
    canvas = null;
    context = null;
    soldierList = [];

    @ViewChild("canvasGame") canvasRef: ElementRef;

    private drawMap() {
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

    private render(e) {
        this.soldierList = e.data;
        this.requestAnimFrame(this.drawMap);
    }

    private initWebWorker() {
        // this.worker = new Worker(URL.createObjectURL(new Blob(
        //     [WebWorkerSoldier.code + 
        //      WebWorkerRobot.code + 
        //      WebWorkerPlayer.code + 
        //      WebWorkerAction.code],
        //     {type: 'application/javascript'}
        // )));
        this.worker = new Worker('webWorker/action.ts');
        this.worker.addEventListener('message', this.render);
    }

    private requestAnimFrame = (() => {
        return  this._window.requestAnimationFrame ||
                this._window.webkitRequestAnimationFrame ||
                // this._window.mozRequestAnimationFrame ||
                function( callback ){
                    this._window.setTimeout(callback, 1000 / 60);
                };
    })();

    public startGame = () => {
        let param = Constant.getConstantMap();
        let message = new Message(MessageType.START, param);
        this.worker.postMessage(message);
    }

    public stopGame = () => {
        
    }

    public resetGame = () => {
        
    }

    ngOnInit() {
        this.canvas = this.canvasRef.nativeElement;
        this.context = this.canvas.getContext('2d');
        this.canvas.height = Constant.UNIT_SIZE * Constant.MAP_HEIGHT_UNIT;
        this.canvas.width = Constant.UNIT_SIZE * Constant.MAP_WIDTH_UNIT;

        this.initWebWorker();
        this.drawMap();
    }
}
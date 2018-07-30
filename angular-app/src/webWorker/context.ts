export class Context {
    private static singleton = null;

    constructor(
        public gameRunning = false,
        public gameTerminated = false,
        public distMatrix = null,
        public map = null,
        public dictSoldierNum = {},
        public youWin = null,
        public soldierList = null,
        public nextSoldierId = 0
    ) {}

    public static newContext(): Context {
        Context.singleton = new Context();
        return Context.singleton;
    }

    public static getContext(): Context {
        return Context.singleton;
    }

    public static syncContext(context: Context) {
        if (!Context.singleton) {
            Context.newContext();
        }
        Context.singleton.gameRunning = context.gameRunning;
        Context.singleton.gameTerminated = context.gameTerminated;
        Context.singleton.distMatrix = context.distMatrix;
        Context.singleton.map = context.map;
        Context.singleton.dictSoldierNum = context.dictSoldierNum;
        Context.singleton.youWin = context.youWin;
        Context.singleton.soldierList = context.soldierList;
    }
}

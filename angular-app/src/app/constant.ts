export class Constant {
    public static UNIT_SIZE = 3; // px
    public static MAP_WIDTH_UNIT = 200;
    public static MAP_HEIGHT_UNIT = 200;
    public static SOLDIER_NUM_EACH = 500;
    public static COLOR_NUM = 2;
    public static COLOR_LIST = ["red", "blue", "green", "black", "purple"];
    public static SIGHT_RANGE_UNIT = 500; // how far can a soldier can see in sight
    public static SHOOT_RANGE_UNIT = 50; // how far can a bullet can shoot
    public static GAME_TOTAL_TIME = 60; // in seconds

    public static getConstantMap() {
        let map = new Map<String, any>();
        map.set("UNIT_SIZE", Constant.UNIT_SIZE);
        map.set("MAP_WIDTH_UNIT", Constant.MAP_WIDTH_UNIT);
        map.set("MAP_HEIGHT_UNIT", Constant.MAP_HEIGHT_UNIT);
        map.set("SOLDIER_NUM_EACH", Constant.SOLDIER_NUM_EACH);
        map.set("COLOR_NUM", Constant.COLOR_NUM);
        map.set("COLOR_LIST", Constant.COLOR_LIST);
        map.set("SIGHT_RANGE_UNIT", Constant.SIGHT_RANGE_UNIT);
        map.set("SHOOT_RANGE_UNIT", Constant.SHOOT_RANGE_UNIT);
        map.set("GAME_TOTAL_TIME", Constant.GAME_TOTAL_TIME);
        return map;
    }
}
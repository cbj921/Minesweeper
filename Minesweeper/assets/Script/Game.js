const GAME_STATE = cc.Enum({
    PREPARE: 0,
    PLAY: 1,
    WIN: 2,
    DEAD: 3
});
const TOUCH_STATE = cc.Enum({
    BLANK: 0,
    FLAG: 1,
});

cc.Class({
    extends: cc.Component,

    properties: {
        tilesLayout: cc.Node,
        tile: cc.Prefab,
        btnStart: cc.Node,
        tiles: [], // 用数组保存所有tile引用
        picPrepare: cc.SpriteFrame,
        picPlay: cc.SpriteFrame,
        picWin: cc.SpriteFrame,
        picDead: cc.SpriteFrame,

        gameState: {
            default: GAME_STATE.PREPARE,
            type: GAME_STATE,
        },
        touchState: {// 左键点开方块，右键标记flag，flag状态下再右键一次Doubt
            default: TOUCH_STATE.BLANK,
            type: TOUCH_STATE
        },
        row: 0,
        col: 0,
        bombNum: 0,

    },

    onLoad: function () {
        this.Tile = require("Blank"); // 获得Blank脚本中的状态量：STATE,TYPE
        let self = this; // 将this赋值给self，好处就是在回调函数中self依旧对应的是this
        for (let r = 0; r < this.row; r++) {
            for (let c = 0; c < this.col; c++) {
                let genTile = cc.instantiate(this.tile);
                genTile.name = String(r * this.col + c); // 必须为 字符串 类型，否则会出错，将生成的方块名字命名为在 tiles数组 中的下标
                genTile.on(cc.Node.EventType.MOUSE_UP, function (event) {
                    // 对每一个生成的方块都开启 鼠标事件监听
                    if (event.getButton() === cc.Event.EventMouse.BUTTON_LEFT) {
                        self.touchState = TOUCH_STATE.BLANK;
                    } else if (event.getButton() === cc.Event.EventMouse.BUTTON_RIGHT) {
                        self.touchState = TOUCH_STATE.FLAG;
                    }
                    self.onTouchTile(genTile); // 这时候这里的是指每一个生成的方块。
                });
                this.tilesLayout.addChild(genTile);
                this.tiles.push(genTile);
            }
        }
        this.newGame();
    },

    newGame: function () {
        let tilesLength = this.tiles.length;
        // 初始化场景
        for (let n = 0; n < tilesLength; n++) {
            this.tiles[n].getComponent("Blank").ClickType = this.Tile.TYPE.ZERO;
            this.tiles[n].getComponent("Blank").state = this.Tile.STATE.NONE;
        }
        // 添加雷
        let tilesIndex = [];
        for (let i = 0; i < tilesLength; i++) {
            tilesIndex[i] = i; // 初始化方块数组，然后雷将随机填入其中，一维数组表示二维地图
        }
        for (let b = 0; b < this.bombNum; b++) {
            let n = Math.floor(Math.random() * tilesIndex.length); // 随机炸弹位置
            this.tiles[tilesIndex[n]].getComponent("Blank").ClickType = this.Tile.TYPE.BOMB;
            tilesIndex.splice(n, 1); // 删除第 n 个位置一个元素，避免重复放雷
        }
        // 标记雷周围的方块
        for (let n = 0; n < tilesLength; n++) {
            let tempBomb = 0;
            if (this.tiles[n].getComponent("Blank").ClickType == this.Tile.TYPE.ZERO) {
                let roundTiles = this.tileRound(n);
                for (let m = 0; m < roundTiles.length; m++) {
                    if (roundTiles[m].getComponent("Blank").ClickType == this.Tile.TYPE.BOMB) {
                        tempBomb++;
                    }
                }
                this.tiles[n].getComponent("Blank").ClickType = tempBomb; // 周围有多少雷就标记几
            }
        }
        this.gameState = GAME_STATE.PLAY;
        this.btnStart.getComponent(cc.Sprite).SpriteFrame = this.picPlay;
    },

    // 返回 name 为 n 的 tile 的周围 tile 数组
    tileRound: function (n) {// col表明每排有几个元素
        // Math.floor(n/this.row)==15的时候就是最后一行了，n%this.col==29时就是最后一列
        // 这里逻辑不能出错，一出错就运行失败
        let roundTiles = [];
        if (n % this.col > 0) {//left
            roundTiles.push(this.tiles[n - 1]);
        }
        if (n % this.col < this.col - 1) {// right
            roundTiles.push(this.tiles[n + 1]);
        }
        if (Math.floor(n / this.col) < this.row - 1) {// bottom
            roundTiles.push(this.tiles[n + this.col]);
        }
        if (Math.floor(n / this.col) > 0) {// top
            roundTiles.push(this.tiles[n - this.col]);
        }
        if (n % this.col > 0 && Math.floor(n / this.col) > 0) {// 左上
            roundTiles.push(this.tiles[n - this.col - 1]);
        }
        if (n % this.col > 0 && Math.floor(n / this.col) < this.row - 1) {// 左下
            roundTiles.push(this.tiles[n + this.col - 1]);
        }
        if (n % this.col < this.col - 1 && Math.floor(n / this.col) > 0) {// 右上
            roundTiles.push(this.tiles[n - this.col + 1]);
        }
        if (n % this.col < this.col - 1 && Math.floor(n / this.col) < this.row - 1) {// 右下
            roundTiles.push(this.tiles[n + this.col + 1]);
        }
        return roundTiles;
    },

    onTouchTile: function (touchTile) {
        if (this.gameState != GAME_STATE.PLAY) {
            return;
        }
        switch (this.touchState) {
            case TOUCH_STATE.BLANK:
                if (touchTile.getComponent("Blank").ClickType === this.Tile.TYPE.BOMB) {
                    touchTile.getComponent("Blank").state = this.Tile.STATE.CLICK;
                    this.gameOver(); // 点到炸弹游戏结束
                    return;
                }
                let testTiles = []; // 定义一个栈
                if (touchTile.getComponent("Blank").state === this.Tile.STATE.NONE) {
                    testTiles.push(touchTile);
                    while (testTiles.length) {
                        // 当栈不为空的时候
                        let testTile = testTiles.pop();
                        if (testTile.getComponent("Blank").ClickType == this.Tile.TYPE.ZERO) {
                            testTile.getComponent("Blank").state = this.Tile.STATE.CLICK;
                            let roundTiles = this.tileRound(parseInt(testTile.name));
                            for (let i = 0; i < roundTiles.length; i++) {
                                if (roundTiles[i].getComponent("Blank").state == this.Tile.STATE.NONE) {
                                    testTiles.push(roundTiles[i]);
                                }
                            }
                        } else if (testTile.getComponent("Blank").ClickType >0
                            && testTile.getComponent("Blank").ClickType <9) {
                            testTile.getComponent("Blank").state = this.Tile.STATE.CLICK;
                        }
                    }
                    this.judgeWin();
                }
                break;

            case TOUCH_STATE.FLAG:
                if (touchTile.getComponent("Blank").state == this.Tile.STATE.NONE) {
                    touchTile.getComponent("Blank").state = this.Tile.STATE.FLAG;
                } else if (touchTile.getComponent("Blank").state == this.Tile.STATE.FLAG) {
                    touchTile.getComponent("Blank").state = this.Tile.STATE.DOUBT;
                } else {
                    touchTile.getComponent("Blank").state = this.Tile.STATE.NONE;
                }
                console.log("right click");
                break;

            default: break;

        }
    },

    judgeWin:function(){
        var confNum = 0;
        //判断是否胜利
        for(let i=0;i<this.tiles.length;i++){
            if(this.tiles[i].getComponent('Blank').state === this.Tile.STATE.CLICK){
                confNum++;
            }
        }
        if(confNum === this.tiles.length-this.bombNum){
            this.gameState = GAME_STATE.WIN;
            this.btnStart.getComponent(cc.Sprite).spriteFrame = this.picWin;
        }
    },

    gameOver:function(){
        this.gameState = GAME_STATE.DEAD;
        this.btnStart.getComponent(cc.Sprite).spriteFrame = this.picDead;
    },

    onBtnShow:function(){
        if(this.gameState === GAME_STATE.PREPARE){
            this.newGame();
        }
        if(this.gameState === GAME_STATE.DEAD){
            // this.bombNum--;
            this.newGame();
        }
        if(this.gameState === GAME_STATE.WIN){
            // this.bombNum++;
            this.newGame();
        }
    }

    // update (dt) {},
});

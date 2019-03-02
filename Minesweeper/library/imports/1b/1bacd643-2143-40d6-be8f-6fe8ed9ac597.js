"use strict";
cc._RF.push(module, '1bacdZDIUNA1r6Pb+jtmsWX', 'Game');
// Script/Game.js

"use strict";

var GAME_STATE = cc.Enum({
    PREPARE: -1,
    PLAY: -1,
    DEAD: -1,
    WIN: -1
});
var TOUCH_STATE = cc.Enum({
    BLANK: -1,
    FLAG: -1
});

cc.Class({
    extends: cc.Component,

    properties: {
        tilesLayout: cc.Node,
        tile: cc.Prefab,
        btnShow: cc.Node,
        tiles: [], //用一个数组保存所有tile的引用，数组下标就是相应tile的tag
        picPrepare: cc.SpriteFrame,
        picPlay: cc.SpriteFrame,
        picDead: cc.SpriteFrame,
        picWin: cc.SpriteFrame,
        gameState: {
            default: GAME_STATE.PREPARE,
            type: GAME_STATE
        },
        touchState: { //左键点开tile，右键插旗
            default: TOUCH_STATE.BLANK,
            type: TOUCH_STATE
        },
        row: 0,
        col: 0,
        bombNum: 0
    },

    onLoad: function onLoad() {
        var _this = this;

        this.Tile = require("Tile");
        var self = this;
        for (var y = 0; y < this.row; y++) {
            var _loop = function _loop(x) {
                var tile = cc.instantiate(_this.tile);
                tile.name = String(y * _this.col + x);
                tile.on(cc.Node.EventType.MOUSE_UP, function (event) {
                    if (event.getButton() === cc.Event.EventMouse.BUTTON_LEFT) {
                        self.touchState = TOUCH_STATE.BLANK;
                    } else if (event.getButton() === cc.Event.EventMouse.BUTTON_RIGHT) {
                        self.touchState = TOUCH_STATE.FLAG;
                    }
                    self.onTouchTile(tile);
                });
                _this.tilesLayout.addChild(tile);
                _this.tiles.push(tile);
            };

            for (var x = 0; x < this.col; x++) {
                _loop(x);
            }
        }
        this.newGame();
    },

    newGame: function newGame() {
        //初始化场景
        for (var _n = 0; _n < this.tiles.length; _n++) {
            this.tiles[_n].getComponent("Tile").type = this.Tile.TYPE.ZERO;
            this.tiles[_n].getComponent("Tile").state = this.Tile.STATE.NONE;
        }
        //添加雷
        var tilesIndex = [];
        for (var i = 0; i < this.tiles.length; i++) {
            tilesIndex[i] = i;
        }
        for (var j = 0; j < this.bombNum; j++) {
            var n = Math.floor(Math.random() * tilesIndex.length);
            this.tiles[tilesIndex[n]].getComponent("Tile").type = this.Tile.TYPE.BOMB;
            tilesIndex.splice(n, 1); //从第n个位置删除一个元素
            //如果没有splice方法可以用这种方式
            // tilesIndex[n] = tilesIndex[tilesIndex.length-1];
            // tilesIndex.length--;
        }
        //标记雷周围的方块
        for (var k = 0; k < this.tiles.length; k++) {
            var tempBomb = 0;
            if (this.tiles[k].getComponent("Tile").type == this.Tile.TYPE.ZERO) {
                var roundTiles = this.tileRound(k);
                for (var m = 0; m < roundTiles.length; m++) {
                    if (roundTiles[m].getComponent("Tile").type == this.Tile.TYPE.BOMB) {
                        tempBomb++;
                    }
                }
                this.tiles[k].getComponent("Tile").type = tempBomb;
            }
        }

        this.gameState = GAME_STATE.PLAY;
        this.btnShow.getComponent(cc.Sprite).spriteFrame = this.picPlay;
    },

    //返回tag为i的tile的周围tile数组
    tileRound: function tileRound(i) {
        var roundTiles = [];
        if (i % this.col > 0) {
            //left
            roundTiles.push(this.tiles[i - 1]);
        }
        if (i % this.col > 0 && Math.floor(i / this.col) > 0) {
            //left top
            roundTiles.push(this.tiles[i - this.col - 1]);
        }
        if (i % this.col > 0 && Math.floor(i / this.col) < this.row - 1) {
            //left bottom
            roundTiles.push(this.tiles[i + this.col - 1]);
        }
        if (Math.floor(i / this.col) > 0) {
            //bottom
            roundTiles.push(this.tiles[i - this.col]);
        }
        if (Math.floor(i / this.col) < this.row - 1) {
            //top
            roundTiles.push(this.tiles[i + this.col]);
        }
        if (i % this.col < this.col - 1) {
            //right
            roundTiles.push(this.tiles[i + 1]);
        }
        if (i % this.col < this.col - 1 && Math.floor(i / this.col) > 0) {
            //rihgt top
            roundTiles.push(this.tiles[i - this.col + 1]);
        }
        if (i % this.col < this.col - 1 && Math.floor(i / this.col) < this.row - 1) {
            //right bottom
            roundTiles.push(this.tiles[i + this.col + 1]);
        }
        return roundTiles;
    },

    onTouchTile: function onTouchTile(touchTile) {
        if (this.gameState != GAME_STATE.PLAY) {
            return;
        }
        switch (this.touchState) {
            case TOUCH_STATE.BLANK:
                if (touchTile.getComponent("Tile").type === this.Tile.TYPE.BOMB) {
                    touchTile.getComponent("Tile").state = this.Tile.STATE.CLIKED;
                    this.gameOver();
                    return;
                }
                var testTiles = [];
                if (touchTile.getComponent("Tile").state === this.Tile.STATE.NONE) {
                    testTiles.push(touchTile);
                    while (testTiles.length) {
                        var testTile = testTiles.pop();
                        if (testTile.getComponent("Tile").type === 0) {
                            testTile.getComponent("Tile").state = this.Tile.STATE.CLIKED;
                            var roundTiles = this.tileRound(parseInt(testTile.name));
                            for (var i = 0; i < roundTiles.length; i++) {
                                if (roundTiles[i].getComponent("Tile").state == this.Tile.STATE.NONE) {
                                    testTiles.push(roundTiles[i]);
                                }
                            }
                        } else if (testTile.getComponent("Tile").type > 0 && testTile.getComponent("Tile").type < 9) {
                            testTile.getComponent("Tile").state = this.Tile.STATE.CLIKED;
                        }
                    }
                    this.judgeWin();
                }

                break;
            case TOUCH_STATE.FLAG:
                if (touchTile.getComponent("Tile").state == this.Tile.STATE.NONE) {
                    touchTile.getComponent("Tile").state = this.Tile.STATE.FLAG;
                } else if (touchTile.getComponent("Tile").state == this.Tile.STATE.FLAG) {
                    touchTile.getComponent("Tile").state = this.Tile.STATE.DOUBT;
                } else {
                    touchTile.getComponent("Tile").state = this.Tile.STATE.NONE;
                }
                break;
            default:
                break;
        }
    },

    judgeWin: function judgeWin() {
        var confNum = 0;
        //判断是否胜利
        for (var i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i].getComponent("Tile").state === this.Tile.STATE.CLIKED) {
                confNum++;
            }
        }
        if (confNum === this.tiles.length - this.bombNum) {
            this.gameState = GAME_STATE.WIN;
            this.btnShow.getComponent(cc.Sprite).spriteFrame = this.picWin;
        }
    },

    gameOver: function gameOver() {
        this.gameState = GAME_STATE.DEAD;
        this.btnShow.getComponent(cc.Sprite).spriteFrame = this.picDead;
    },

    onBtnShow: function onBtnShow() {
        if (this.gameState === GAME_STATE.PREPARE) {
            this.newGame();
        }
        if (this.gameState === GAME_STATE.DEAD) {
            // this.bombNum--;
            this.newGame();
        }
        if (this.gameState === GAME_STATE.WIN) {
            // this.bombNum++;
            this.newGame();
        }
    }

});

cc._RF.pop();
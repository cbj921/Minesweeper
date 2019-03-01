(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Game.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1bacdZDIUNA1r6Pb+jtmsWX', 'Game', __filename);
// Script/Game.js

"use strict";

var GAME_STATE = cc.Enum({
    PREPARE: 0,
    PLAY: 1,
    WIN: 2,
    DEAD: 3
});
var TOUCH_STATE = cc.Enum({
    BLANK: 0,
    FLAG: 1,
    DOUBT: 2
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
            type: GAME_STATE
        },
        touchState: { // 左键点开方块，右键标记flag，flag状态下再右键一次Doubt
            default: TOUCH_STATE.BLANK,
            type: TOUCH_STATE
        },
        row: 0,
        col: 0,
        bombNum: 0

    },

    onLoad: function onLoad() {
        this.Tile = require("Blank"); // 获得Blank脚本中的状态量：STATE,TYPE
        var self = this; // 将this赋值给self，好处就是在回调函数中self依旧对应的是this
        for (var r = 0; r < this.row; r++) {
            for (var c = 0; c < this.col; c++) {
                var genTile = cc.instantiate(this.tile);
                genTile.name = String(r * this.col + c); // 必须为 字符串 类型，否则会出错，将生成的方块名字命名为在 tiles数组 中的下标
                genTile.on(cc.Node.EventType.MOUSE_UP, function (event) {
                    // 对每一个生成的方块都开启 鼠标事件监听
                    if (event.getButton() === cc.Event.EventMouse.BUTTON_LEFT) {
                        self.touchState = TOUCH_STATE.BLANK;
                    } else if (event.getButton() === cc.Event.EventMouse.BUTTON_RIGHT) {
                        if (self.touchState === TOUCH_STATE.BLANK) {
                            self.touchState = TOUCH_STATE.FLAG;
                        }
                        if (self.touchState === TOUCH_STATE.FLAG) {
                            self.touchState = TOUCH_STATE.DOUBT;
                        } else self.touchState = TOUCH_STATE.BLANK;
                    }
                    //self.onTouchTile(this); // 该函数还没写先注释，这时候这里的this又是啥？？？
                });
                this.tilesLayout.addChild(genTile);
                this.tiles.push(genTile);
            }
        }
        this.newGame();
    },

    newGame: function newGame() {
        // 初始化场景

    },

    start: function start() {}
}

// update (dt) {},
);

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=Game.js.map
        
(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Blank.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f6da1522BNKVLT6b/I295sG', 'Blank', __filename);
// Script/Blank.js

"use strict";

var TYPE = cc.Enum({
    ZERO: 0,
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
    SIX: 6,
    SEVEN: 7,
    EIGHT: 8,
    NENE: 9
});

var STATE = cc.Enum({
    NONE: -1, // 未点击
    CLICK: -1, // 已点击
    FLAG: -1, // 插旗
    DOUBT: -1 // 疑问
});

// 其他脚本引用的状态量
module.exports = {
    STATE: STATE,
    TYPE: TYPE
};

cc.Class({
    extends: cc.Component,

    properties: {},

    start: function start() {}
});

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
        //# sourceMappingURL=Blank.js.map
        
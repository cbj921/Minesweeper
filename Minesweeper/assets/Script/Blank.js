
const TYPE = cc.Enum({
    ZERO:  0,
    ONE:   1,
    TWO:   2,
    THREE: 3,
    FOUR:  4,
    FIVE:  5,
    SIX:   6,
    SEVEN: 7,
    EIGHT: 8,
    NENE:  9
});

const STATE = cc.Enum({
    NONE:  -1, // 未点击
    CLICK: -1, // 已点击
    FLAG:  -1, // 插旗
    DOUBT: -1  // 疑问
});

// 其他脚本引用的状态量
module.exports = {
    STATE: STATE,
    TYPE:  TYPE
};

cc.Class({
    extends: cc.Component,

    properties: {

    },



    start() {

    },

});

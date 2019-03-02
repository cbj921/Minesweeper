const TYPE = cc.Enum({
    ZERO: 0,
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
    SIX: 6,
    SEVEN: 7,
    EIGHT: 8,
    BOMB: 9
});
const STATE = cc.Enum({
    NONE: -1,//未点击
    CLIKED: -1,//已点开
    FLAG: -1,//插旗
    DOUBT: -1,//疑问
});

//其他脚本访问
module.exports = {
    STATE: STATE,
    TYPE: TYPE,
};

cc.Class({
    extends: cc.Component,

    properties: {
        picNone: cc.SpriteFrame,
        picFlag: cc.SpriteFrame,
        picDoubt: cc.SpriteFrame,
        picZero: cc.SpriteFrame,
        picOne: cc.SpriteFrame,
        picTwo: cc.SpriteFrame,
        picThree: cc.SpriteFrame,
        picFour: cc.SpriteFrame,
        picFive: cc.SpriteFrame,
        picSix: cc.SpriteFrame,
        picSeven: cc.SpriteFrame,
        picEight: cc.SpriteFrame,
        picBomb: cc.SpriteFrame,
        _state: {
            default: STATE.NONE,
            type: STATE,
            visible: false
        },
        state: {
            get: function () {
                return this._state;
            },
            set: function (value) {
                if (value !== this._state) {
                    this._state = value;
                    switch (this._state) {
                        case STATE.NONE:
                            this.getComponent(cc.Sprite).spriteFrame = this.picNone;
                            break;
                        case STATE.CLIKED:
                            this.showType();
                            break;
                        case STATE.FLAG:
                            this.getComponent(cc.Sprite).spriteFrame = this.picFlag;
                            break;
                        case STATE.DOUBT:
                            this.getComponent(cc.Sprite).spriteFrame = this.picDoubt;
                            break;
                        default: break;
                    }
                }
            },
            type: STATE,
        },
        type: {
            default: TYPE.ZERO,
            type: TYPE,
        },
    },

    showType: function () {
        switch (this.type) {
            case TYPE.ZERO:
                this.getComponent(cc.Sprite).spriteFrame = this.picZero;
                break;
            case TYPE.ONE:
                this.getComponent(cc.Sprite).spriteFrame = this.picOne;
                break;
            case TYPE.TWO:
                this.getComponent(cc.Sprite).spriteFrame = this.picTwo;
                break;
            case TYPE.THREE:
                this.getComponent(cc.Sprite).spriteFrame = this.picThree;
                break;
            case TYPE.FOUR:
                this.getComponent(cc.Sprite).spriteFrame = this.picFour;
                break;
            case TYPE.FIVE:
                this.getComponent(cc.Sprite).spriteFrame = this.picFive;
                break;
            case TYPE.SIX:
                this.getComponent(cc.Sprite).spriteFrame = this.picSix;
                break;
            case TYPE.SEVEN:
                this.getComponent(cc.Sprite).spriteFrame = this.picSeven;
                break;
            case TYPE.EIGHT:
                this.getComponent(cc.Sprite).spriteFrame = this.picEight;
                break;
            case TYPE.BOMB:
                this.getComponent(cc.Sprite).spriteFrame = this.picBomb;
                break;
            default: break;
        }
    }
});

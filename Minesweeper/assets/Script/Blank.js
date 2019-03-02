
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
    BOMB:  9
});

const STATE = cc.Enum({ //如果设为-1，系统将会分配为上一个枚举值+1，在这里我不用-1，直接设为其他值，加强可读性
    NONE:  0, // 未点击
    CLICK: 1, // 已点击
    FLAG:  2, // 插旗
    DOUBT: 3  // 疑问
});

// 其他脚本引用的状态量
module.exports = {
    STATE: STATE,
    TYPE:  TYPE
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

        _state: { // 定义 _state 私有变量，用来表明当前方块的状态，初始状态不可见
            default: STATE.NONE,
            type: STATE,
            visible: false
        },

        state: { // 定义state 对象，在属性中设置了 get 或 set 以后，访问属性的时候，就能触发预定义的 get 或 set 方法
            get: function(){
                return this._state;
            },
    
            set: function(value){
                if(value != this._state){
                    this._state = value;
                    switch(this._state){
                        case STATE.NONE:
                            this.getComponent(cc.Sprite).SpriteFrame = this.picNone;
                            break;
                        case STATE.CLICK:
                            this.showType();
                            break;
                        case STATE.FLAG:
                            this.getComponent(cc.Sprite).SpriteFrame = this.picFlag;
                            break;
                        case STATE.DOUBT:
                            this.getComponent(cc.Sprite).SpriteFrame = this.picDoubt;
                            break;
                        default: break;
                    }
                }
            },
            type: STATE,  // 类型为 STATE
        },

        ClickType: {
            default: TYPE.ZERO,
            type: TYPE,
        },
    },

    showType: function(){
        switch(this.ClickType){
            case TYPE.ZERO:
                this.getComponent(cc.Sprite).SpriteFrame = this.picZero;
                break;
            case TYPE.ONE:
                this.getComponent(cc.Sprite).SpriteFrame = this.picOne;
                break;
            case TYPE.TWO:
                this.getComponent(cc.Sprite).SpriteFrame = this.picTwo;
                break;
            case TYPE.THREE:
                this.getComponent(cc.Sprite).SpriteFrame = this.picThree;
                break;
            case TYPE.FOUR:
                this.getComponent(cc.Sprite).SpriteFrame = this.picFour;
                break;
            case TYPE.FIVE:
                this.getComponent(cc.Sprite).SpriteFrame = this.picFive;
                break;
            case TYPE.SIX:
                this.getComponent(cc.Sprite).SpriteFrame = this.picSix;
                break;
            case TYPE.SEVEN:
                this.getComponent(cc.Sprite).SpriteFrame = this.picSeven;
                break;
            case TYPE.EIGHT:
                this.getComponent(cc.Sprite).SpriteFrame = this.picEight;
                break;
            case TYPE.BOMB:
                this.getComponent(cc.Sprite).SpriteFrame = this.picBomb;
                break;
            default: break;

        }
    },

});

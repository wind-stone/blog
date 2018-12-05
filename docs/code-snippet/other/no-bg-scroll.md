# 滚动穿透

```html
<div class="rule-mask popup-mask">
  <div class="rule-content popup-content">
    <div class="rule-inner">
      <div class="rule-header">活动攻略</div>
      <div class="rule-list">
        <div class="scroll">
          <p>你好</p>
          <p>你好</p>
          <p>你好</p>
          <p>你好</p>
          <p>你好</p>
          <p>你好</p>
          <p>你好</p>
          <p>你好</p>
          <p>你好</p>
          <p>你好</p>
          <p>你好</p>
          <p>你好</p>
          <p>你好</p>
          <p>你好</p>
          <p>你好</p>
          <p>你好</p>
          <p>你好</p>
          <p>你好</p>
          <p>你好</p>
          <p>你好</p>
          <p>你好</p>
          <p>你好</p>
          <p>你好</p>
          <p>你好</p>
          <p>你好</p>
          <p>你好</p>
          <p>你好</p>
          <p>你好</p>
          <p>你好</p>
          <p>你好</p>
        </div>
      </div>
    </div>
  </div>
</div>
```

```css
.popup-mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0,0,0,.6)
}

.popup-mask > .popup-content {
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%)
}

.rule-inner {
    width: 280px;
    height: 342px;
    background: #FFE6B1
}

.rule-header {
    padding: 6px 0 10px;
    font-size: 16px;
    line-height: 22px;
    color: #864A12;
    text-align: center
}

.rule-list {
    height: 304px;
    overflow: scroll
}
```

```js
// 使用了 zepto

// 禁止背景滚动
function forbidBgScroll() {
    const $ruleMask = $('.rule-mask');
    const $ruleContent = $('.rule-content');
    const $ruleList = $('.rule-list');

    $ruleMask.on('touchmove', function (evt) {
        var target = evt.target;
        if (
            $(target).parents('.rule-content').length === 0 && $(target) !== $ruleContent
            || $(target).hasClass('rule-header')
        ) {
            evt.preventDefault();
        }
    });

    let startY;
    let offsetHeight;
    let scrollHeight;
    $ruleList.on('touchstart', function (evt) {
        const targetTouches = evt.targetTouches || [];
        if (targetTouches.length > 0) {
            const touch = targetTouches[0] || {};
            startY = touch.clientY;
            offsetHeight = $ruleList[0].offsetHeight;
            scrollHeight = $ruleList[0].scrollHeight;
        }
    });
    $ruleList.on('touchmove', function (evt) {
        const changedTouches = evt.changedTouches;
        let canMove = false;
        var scrollTop = this.scrollTop;
        if (changedTouches.length > 0) {
            const touch = changedTouches[0] || {};
            const moveY = touch.clientY;
            if (moveY > startY && scrollTop <= 0) {
                canMove = false;
            } else if (moveY < startY && scrollTop + offsetHeight >= scrollHeight) {
                canMove = false;
            } else {
                canMove = true;
            }
            if (!canMove) {
                evt.preventDefault();
            }
        }
    });
}

forbidBgScroll();
```
export function loadScript(url: string) {
  return new Promise(function (resolve, reject) {
    const script = document.createElement('script');
    script.src = url;
    script.type = 'text/javascript';
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

export function getOffsetTop($el: HTMLElement, $scroll: HTMLElement | Window): number {
  let offset = 0;
  while ($el && $el !== $scroll) {
    offset += $el.offsetTop;
    $el = $el.offsetParent as HTMLElement;
  }
  return offset;
}
export function getOffsetLeft($el: HTMLElement, $scroll: HTMLElement): number {
  let offset = 0;
  while ($el && $el !== $scroll) {
    offset += $el.offsetLeft;
    $el = $el.offsetParent as HTMLElement;
  }
  return offset;
}

export function scrollTo(
  $scroll: HTMLElement | Window,
  { left, top }: { left?: number; top?: number },
  callback?: () => void,
): void {
  const supportSmoothScrollTo = 'scrollBehavior' in document.documentElement.style;
  if (!supportSmoothScrollTo) {
    console.log('use scrollToPolyfill');
    scrollToPolyfill($scroll, { left, top }, callback);
    return;
  }

  console.log('use scrollTo');
  const beginLeft = $scroll === window ? window.pageXOffset : ($scroll as HTMLElement).scrollLeft;
  const beginTop = $scroll === window ? window.pageYOffset : ($scroll as HTMLElement).scrollTop;
  const isXScroll = left !== undefined && left !== beginLeft;
  const isYScroll = top !== undefined && top !== beginTop;

  let ended = false;
  if (!isXScroll && !isYScroll) {
    callback && callback();
  } else {
    if (callback) {
      const onScroll = function () {
        if (isXScroll) {
          const scrollLeft =
            $scroll === window ? window.pageXOffset : ($scroll as HTMLElement).scrollLeft;
          if (Math.abs(scrollLeft - left!) < 1) {
            ended = true;
            callback();
            $scroll.removeEventListener('scroll', onScroll);
          }
        } else if (isYScroll) {
          const scrollTop =
            $scroll === window ? window.pageYOffset : ($scroll as HTMLElement).scrollTop;
          if (Math.abs(scrollTop - top!) < 1) {
            ended = true;
            callback();
            $scroll.removeEventListener('scroll', onScroll);
          }
        }
      };
      $scroll.addEventListener('scroll', onScroll);
      // 兜底，有scrollTo方法但是调用没有效果的设备，强制结束
      setTimeout(function () {
        if (!ended) {
          callback();
          $scroll.removeEventListener('scroll', onScroll);
        }
      }, 2000);
    }
    $scroll.scrollTo({ left: left || 0, top: top || 0, behavior: 'smooth' });
  }
}

export const nextTick =
  window.requestAnimationFrame ||
  function (callback: () => void) {
    setTimeout(callback, 17);
  };

export function scrollToPolyfill(
  $scroll: HTMLElement | Window,
  { left, top }: { left?: number; top?: number },
  callback?: () => void,
): void {
  const beginLeft = $scroll === window ? window.pageXOffset : ($scroll as HTMLElement).scrollLeft;
  const beginTop = $scroll === window ? window.pageYOffset : ($scroll as HTMLElement).scrollTop;
  const isXScroll = left !== undefined && left !== beginLeft;
  const isYScroll = top !== undefined && top !== beginTop;
  if (!isXScroll && !isYScroll) {
    callback && callback();
    return;
  }

  const from = isXScroll ? beginLeft : beginTop;
  const to = isXScroll ? left : top!;
  const count = Math.round(Math.abs(to - from) / 50);
  const piece = (to - from) / count;
  let counter = 1;

  const setScroll = function (to: number) {
    const $scrollingElement =
      $scroll === window ? document.scrollingElement || document.documentElement : $scroll;
    if (isXScroll) {
      ($scrollingElement as HTMLElement).scrollLeft = to;
    } else {
      ($scrollingElement as HTMLElement).scrollTop = to;
    }
  };
  const doOnce = function () {
    if (counter < count) {
      setScroll(Math.round(from + counter * piece));
      counter++;
      nextTick(doOnce);
    } else if (counter === count) {
      setScroll(to);
      callback && callback();
    } else {
      callback && callback();
    }
  };
  nextTick(doOnce);
}

/**
 * 监听页面的可见性
 * @param cb 回调函数
 * @param visibleTrigger 是否在页面显示的时候触发回调
 * @param ifRemoveListener 是否需要移除事件
 */
export function pageVisibleHandle(
  cb: () => void,
  visibleTrigger = true,
  needRemoveListener = true,
): () => void {
  const removeListener = () => document.removeEventListener('visibilitychange', handler);
  const handler = () => {
    if (document.visibilityState === 'visible' && visibleTrigger) {
      cb();
      needRemoveListener && removeListener();
    } else if (document.visibilityState === 'hidden' && !visibleTrigger) {
      cb();
      needRemoveListener && removeListener();
    }
  };
  document.addEventListener('visibilitychange', handler);
  // 返回 handler ，needRemoveListener为false的情况下，也可以手动remove
  return handler;
}

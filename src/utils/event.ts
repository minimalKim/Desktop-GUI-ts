import { DRAG_BOX_SELECTOR } from './constants';

type Position = {
  x: number;
  y: number;
};

type mouseUpCallbackProps = {
  position: Position;
  draggingElId: string;
};

export function createMouseDownHandlerForDragDrop(
  needSwap: boolean,
  mouseUpCallback?: ({ position, draggingElId }: mouseUpCallbackProps) => void
) {
  let draggingEl: HTMLElement = null;
  let targetEl: HTMLElement = null;
  let placeholderEl: HTMLElement = null;
  let isDraggingStarted = false;
  let position: Position = { x: 0, y: 0 };
  let insertPosition: 'afterend' | 'beforebegin' = 'afterend';

  const isOver = function (nodeA: Element, nodeB: Element) {
    const rectA = nodeA.getBoundingClientRect();
    const rectB = nodeB.getBoundingClientRect();
    return rectA.top + rectA.height / 2 > rectB.top + rectB.height / 2;
  };

  function isDifferentEl(elementA: HTMLElement, elementB: HTMLElement) {
    return elementA?.dataset.id !== elementB?.dataset.id;
  }

  const mouseUpHandler = function (e: MouseEvent) {
    if (needSwap) {
      if (!isDifferentEl(targetEl, draggingEl)) return;
      targetEl?.insertAdjacentElement(insertPosition, draggingEl);

      placeholderEl?.parentNode?.removeChild(placeholderEl);
      draggingEl.style.removeProperty('top');
      draggingEl.style.removeProperty('left');
      draggingEl.style.removeProperty('position');
    }

    mouseUpCallback &&
      mouseUpCallback({
        position: { x: e.pageX - position.x, y: e.pageY - position.y },
        draggingElId: draggingEl.dataset.id,
      });

    position = { x: null, y: null };
    draggingEl = null;
    isDraggingStarted = false;

    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };

  const mouseMoveHandler = (e: MouseEvent) => {
    const draggingRect = draggingEl.getBoundingClientRect();

    const newTargetEl = Array.from(document.querySelectorAll(DRAG_BOX_SELECTOR)).find(el => {
      const { top, right, bottom, left } = (el as HTMLElement).dataset;
      return e.clientY > +top && e.clientX < +right && e.clientY < +bottom && e.clientX > +left;
    }) as HTMLElement;

    if (isDifferentEl(targetEl, newTargetEl) && isDifferentEl(draggingEl, newTargetEl)) {
      if (targetEl) {
        targetEl.style.border = '2px solid transparent';
        targetEl.style.backgroundColor = 'transparent';
      }
      targetEl = newTargetEl as HTMLElement;
    }

    if (targetEl && isOver(draggingEl, targetEl)) {
      targetEl.style.borderTop = '2px solid transparent';
      targetEl.style.borderBottom = '2px solid rgba(255, 255, 255, 0.7)';
      targetEl.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
      insertPosition = 'afterend';
    }

    if (targetEl && !isOver(draggingEl, targetEl)) {
      targetEl.style.borderBottom = '2px solid transparent';
      targetEl.style.borderTop = '2px solid rgba(255, 255, 255, 0.7)';
      targetEl.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
      insertPosition = 'beforebegin';
    }

    if (!isDraggingStarted) {
      isDraggingStarted = true;

      if (needSwap) {
        placeholderEl = document.createElement('div');
        placeholderEl.classList.add('placeholder');
        draggingEl.parentNode.insertBefore(placeholderEl, draggingEl.nextSibling);
        placeholderEl.style.height = `${draggingRect.height}px`;
      }
    }

    draggingEl.style.position = 'absolute';
    draggingEl.style.top = `${e.pageY - position.y}px`;
    draggingEl.style.left = `${e.pageX - position.x}px`;
  };

  return function mouseDownHandler(e: MouseEvent) {
    let isRightButton = false;
    if ('which' in e)
      // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
      isRightButton = e.which == 3;
    else if ('button' in e)
      // IE, Opera
      isRightButton = e.button == 2;
    if (isRightButton) return;

    const target = e.target as HTMLElement;
    draggingEl = target.closest(DRAG_BOX_SELECTOR);

    const rect = draggingEl.getBoundingClientRect();
    position = { x: e.pageX - rect.left, y: e.pageY - rect.top };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };
}

export const clickSwitcher = (function () {
  const delay = 200;
  let clickTimer = setTimeout(() => {}, 0);

  function _switch(
    e: MouseEvent,
    simpleClickHandler: (e: MouseEvent) => void,
    doubleClickHandler: (e: MouseEvent) => void
  ) {
    clearTimeout(clickTimer);
    if (e.detail === 2) doubleClickHandler(e);
    else clickTimer = setTimeout(simpleClickHandler, delay, e);
  }
  return _switch;
})();

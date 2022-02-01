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
  let placeholderEl: HTMLElement = null;
  let isDraggingStarted = false;
  let position: Position = { x: 0, y: 0 };

  const swap = function (nodeA: Element, nodeB: Element) {
    const parentA = nodeA.parentNode;
    const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;
    nodeB.parentNode.insertBefore(nodeA, nodeB);
    parentA.insertBefore(nodeB, siblingA);
  };

  const isAbove = function (nodeA: Element, nodeB: Element) {
    // Get the bounding rectangle of nodes
    const rectA = nodeA.getBoundingClientRect();
    const rectB = nodeB.getBoundingClientRect();
    return rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2;
  };

  const mouseUpHandler = function (e: MouseEvent) {
    // Remove the placeholder
    if (needSwap) {
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

  function mouseMoveHandler(e: MouseEvent) {
    const draggingRect = draggingEl.getBoundingClientRect();

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

    if (!needSwap) return;

    const prevEle = draggingEl.previousElementSibling;
    const nextEle = placeholderEl.nextElementSibling;

    if (prevEle && isAbove(draggingEl, prevEle)) {
      swap(placeholderEl, draggingEl);
      swap(placeholderEl, prevEle);
      return;
    }

    if (nextEle && isAbove(nextEle, draggingEl)) {
      swap(nextEle, placeholderEl);
      swap(nextEle, draggingEl);
    }
  }

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

    // Calculate the mouse position
    const rect = draggingEl.getBoundingClientRect();
    position = { x: e.pageX - rect.left, y: e.pageY - rect.top };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };
}

export const clickSwitcher = (function () {
  const delay = 100;
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

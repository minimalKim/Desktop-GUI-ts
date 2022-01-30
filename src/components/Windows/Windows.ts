import { WindowType, Window } from './Window';
import Component from '@/core/Component';
import { createMouseDownHandlerForDragDrop } from '@/utils/event';
import { DRAG_GRABBER_SELECTOR } from '@/utils/constants';

type WindowsProps = {
  windows: WindowType[];
  closeWindow: (id: string) => void;
  dragWindow: (id: string, draggingWindowState: WindowType) => void;
};
type WindowsState = {};

export class Windows extends Component<WindowsProps, WindowsState> {
  willMount(): void {
    this.props.windows.map(window => {
      new Window(this.targetEl, window);
    });
  }

  setEvent(): void {
    const { closeWindow, dragWindow } = this.props;
    const closeHandler = ({ target }: MouseEvent) => {
      const targetEl = target as HTMLElement;
      const windowEl = targetEl.closest('.window') as HTMLElement;
      closeWindow(windowEl.dataset.id);
    };

    const mouseDownHandler = createMouseDownHandlerForDragDrop(false, ({ position, draggingElId }) => {
      const draggingWindowState = this.props.windows.find(window => window.id === draggingElId);
      dragWindow(draggingElId, { ...draggingWindowState, position });
    });

    this.addEvent('mousedown', DRAG_GRABBER_SELECTOR, mouseDownHandler);
    this.addEvent('click', '.close', closeHandler);
  }
}

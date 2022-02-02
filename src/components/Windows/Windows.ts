import { Window } from './Window';
import { createMouseDownHandlerForDragDrop } from '@/utils/event';
import { DRAG_GRABBER_SELECTOR } from '@/utils/constants';
import { StatelessComponent } from '@/core/Component';
import { IWindow } from '@/types';

type WindowsProps = {
  windows: IWindow[];
  closeWindow: (id: string) => void;
  dragWindow: (id: string, draggingWindowState: IWindow) => void;
};

export class Windows extends StatelessComponent<WindowsProps> {
  willMount(): void {
    this.props.windows.map(window => {
      new Window(this.targetEl, window);
    });
  }

  setEvent(): void {
    const { closeWindow, dragWindow } = this.props;

    const closeHandler = ({ target }: MouseEvent) => {
      const targetEl = target as HTMLElement;
      const id = (targetEl.closest('[data-id]') as HTMLElement).dataset.id;
      closeWindow(id);
    };

    const mouseDownHandler = createMouseDownHandlerForDragDrop(false, ({ position, draggingElId }) => {
      const draggingWindowState = this.props.windows.find(window => window.id === draggingElId);
      dragWindow(draggingElId, { ...draggingWindowState, position });
    });

    this.addEvent('click', closeHandler, '.close');
    this.addEvent('mousedown', mouseDownHandler, DRAG_GRABBER_SELECTOR);
  }
}

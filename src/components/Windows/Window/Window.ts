import { DRAG_BOX, DRAG_GRABBER } from '@/utils/constants';
import Component from '@/core/Component';
import styles from './Window.module.css';

export type WindowType = {
  id: string;
  title: string;
  type: string;
  order: number;
  position: { x: number; y: number };
};

export class Window extends Component<WindowType, WindowType> {
  template() {
    return `
      <div class="${styles.container} window ${DRAG_BOX}" data-id="${this.props.id}">
        <div class="${styles.header}">
        <button class="${styles.close} close">X</button>
          <span class="${styles.spacer} ${DRAG_GRABBER}" ></span>
          <h3 class="title">${this.props.title}</h3>
        </div>
        <div class="${styles.innerWrapper}"></div>
      </div>
    `;
  }

  didMount(): void {
    this.element.style.position = 'absolute';
    this.element.style.top = `${this.props.position.y}px`;
    this.element.style.left = `${this.props.position.x}px`;
  }
}

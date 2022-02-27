import { WindowType } from '@/types/index';
import { DRAG_BOX, DRAG_GRABBER } from '@/utils/constants';
import { StatelessComponent } from '@/core/Component';
import styles from './Window.module.css';

type WindowProps = WindowType;

export class Window extends StatelessComponent<WindowProps> {
  template() {
    return `
      <div class="${styles.container} window ${DRAG_BOX}" data-id="${this.props.id}">
        <div class="${styles.header}">
        <button class="${styles.close} close"></button>
          <div class="${styles.grabber} ${DRAG_GRABBER}">
            <h3 class="title">${this.props.title}</h3>
          </div>
        </div>
        <div class="${styles.innerWrapper}"></div>
      </div>
    `;
  }

  didMount(): void {
    this.element.style.position = 'absolute';
    this.element.style.zIndex = this.props.isSelected ? '5' : '1';
    this.element.style.top = `${this.props.position.y}px`;
    this.element.style.left = `${this.props.position.x}px`;
  }
}

import { StatelessComponent } from '@/core/Component';
import { IApplicationIcon } from '@/types';
import { APPLICATION_LABEL, DRAG_BOX, DRAG_GRABBER } from '@/utils/constants';
import styles from './ApplicationIcon.module.css';

type ApplicationIconProps = IApplicationIcon;

export class ApplicationIcon extends StatelessComponent<ApplicationIconProps> {
  template() {
    return `
      <div class="${styles.wrapper} ${DRAG_BOX} ${APPLICATION_LABEL}" data-id="${this.props.id}">
        <div class="${styles.icon} ${DRAG_GRABBER}"></div>
        <h3 class="title"></h3>
      </div>`;
  }

  didMount(): void {
    const titleEl = this.element.querySelector('.title');
    titleEl.textContent = this.props.title;

    const { top, right, bottom, left } = this.element.getBoundingClientRect();
    this.element.dataset.top = top.toString();
    this.element.dataset.right = right.toString();
    this.element.dataset.bottom = bottom.toString();
    this.element.dataset.left = left.toString();
  }
}

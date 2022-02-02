import { StatelessComponent } from '@/core/Component';
import { IApplicationIcon } from '@/types';
import { APPLICATION_LABEL, DRAG_BOX, DRAG_GRABBER } from '@/utils/constants';
import styles from './Application.module.css';

type ApplicationProps = IApplicationIcon;

export class Application extends StatelessComponent<ApplicationProps> {
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
  }
}

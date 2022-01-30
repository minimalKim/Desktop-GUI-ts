import Component from '@/core/Component';
import { DRAG_BOX, DRAG_GRABBER } from '@/utils/constants';
import styles from './Application.module.css';

type ApplicationProps = {
  order: number;
  type: string;
  title: string;
  id: string;
};

type ApplicationState = ApplicationProps;

export class Application extends Component<ApplicationProps, ApplicationState> {
  template() {
    return `
      <div class="${styles.wrapper} application ${DRAG_BOX}" data-id="${this.props.id}">
        <div class="${styles.icon} application ${DRAG_GRABBER}"></div>
        <h3 class="title">${this.props.title}</h3>
      </div>`;
  }
}

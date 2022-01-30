import Component from '@/core/Component';
import styles from './Application.module.css';

type ApplicationProps = {
  order: number;
  type: string;
  title: string;
  id: string;
};

type ApplicationState = ApplicationProps;

export default class Application extends Component<ApplicationProps, ApplicationState> {
  template() {
    return `
      <div class="${styles.iconWrapper} icon" data-id="${this.props.id}">
        <div class="${styles.icon}"></div>
        <h3 class="title">${this.props.title}</h3>
      </div>`;
  }
}

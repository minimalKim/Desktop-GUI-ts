import { ICON_LABEL, FOLDER_LABEL } from '@/utils/constants';
import { makeId } from '@/utils/helper';
import Component from './../core/Component';
import styles from './Desktop.module.css';

type DesktopState = {};
type DesktopProps = {};

export default class Desktop extends Component<DesktopProps, DesktopState> {
  template() {
    return `
      <div class="${styles.desktop}">
        <div class="window-root"></div>
        <section class="icon-root ${styles.iconRoot}"></section>
      </div>`;
  }

  willMount(): void {
    this.state = {
      icons: [
        { order: 0, type: ICON_LABEL, title: 'Todo', id: makeId() },
        { order: 1, type: ICON_LABEL, title: '2', id: makeId() },
        { order: 2, type: ICON_LABEL, title: '3', id: makeId() },
      ],
      folders: [
        {
          order: 3,
          type: FOLDER_LABEL,
          title: '4',
          id: makeId(),
          children: [
            {
              order: 0,
              type: FOLDER_LABEL,
              title: '7',
              id: makeId(),
              children: [{ order: 0, type: ICON_LABEL, title: '8', id: makeId() }],
            },
          ],
        },
        { order: 4, type: FOLDER_LABEL, title: '5', id: makeId() },
        { order: 5, type: FOLDER_LABEL, title: '6', id: makeId() },
        { order: 6, type: FOLDER_LABEL, title: '7', id: makeId() },
        { order: 7, type: FOLDER_LABEL, title: '8', id: makeId() },
      ],
    };
  }
}

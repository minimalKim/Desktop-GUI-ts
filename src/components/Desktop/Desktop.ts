import { FOLDER_LABEL, APPLICATION_LABEL } from '@/utils/constants';
import { makeId } from '@/utils/helper';
import Component from '@/core/Component';
import styles from './Desktop.module.css';
import { Icons } from '../Icons';

export type ApplicationType = {
  order: number;
  type: string;
  title: string;
  id: string;
};

export type FolderType = {
  order: number;
  type: string;
  title: string;
  id: string;
  children?: Array<FolderType | ApplicationType>;
};

type DesktopProps = {};
type DesktopState = {
  icons: {
    applications: ApplicationType[];
    folders: FolderType[];
  };
  windows: [];
};

export class Desktop extends Component<DesktopProps, DesktopState> {
  template() {
    return `
      <div class="${styles.desktop}">
        <div class="window-root"></div>
        <section class="icon-root ${styles.iconRoot}"></section>
      </div>`;
  }

  willMount(): void {
    this.state = {
      icons: {
        applications: [
          { order: 0, type: APPLICATION_LABEL, title: 'Todo', id: makeId() },
          { order: 1, type: APPLICATION_LABEL, title: '2', id: makeId() },
          { order: 2, type: APPLICATION_LABEL, title: '3', id: makeId() },
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
                children: [{ order: 0, type: APPLICATION_LABEL, title: '8', id: makeId() }],
              },
            ],
          },
          { order: 4, type: FOLDER_LABEL, title: '5', id: makeId() },
          { order: 5, type: FOLDER_LABEL, title: '6', id: makeId() },
          { order: 6, type: FOLDER_LABEL, title: '7', id: makeId() },
          { order: 7, type: FOLDER_LABEL, title: '8', id: makeId() },
        ],
      },
      windows: [],
    };
  }

  didMount(): void {
    const windowRootEl = this.targetEl.querySelector('.window-root') as HTMLElement;
    const iconRootEl = this.targetEl.querySelector('.icon-root') as HTMLElement;
    new Icons(iconRootEl, { icons: this.state.icons, swapIcons: this.swapIcons.bind(this) });
  }

  swapIcons(newIcons: { applications: ApplicationType[]; folders: FolderType[] }): void {
    console.log({ ...this.state, icons: newIcons });
    this.setState({ ...this.state, icons: newIcons });
  }
}

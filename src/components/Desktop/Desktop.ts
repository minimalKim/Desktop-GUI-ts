import { ContextMenu } from './../ContextMenu/ContextMenu';
import { Windows } from './../Windows/Windows';
import { FOLDER_LABEL, APPLICATION_LABEL, DRAG_GRABBER_SELECTOR, WINDOW_LABEL } from '@/utils/constants';
import { makeId } from '@/utils/helper';
import { Component } from '@/core/Component';
import { Icons } from '../Icons';
import { WindowType, Window } from '../Windows';
import styles from './Desktop.module.css';

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
  contextMenu: {
    isVisible: boolean;
    isIconClicked: boolean;
    iconId: string | null;
    position: { x: number; y: number };
  };
  windows?: WindowType[];
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
      contextMenu: {
        position: { x: 0, y: 0 },
        isVisible: false,
        isIconClicked: false,
        iconId: null,
      },
      windows: [],
    };
  }

  didMount(): void {
    const windowRootEl = this.element.querySelector('.window-root') as HTMLElement;
    new Windows(windowRootEl, {
      windows: this.state.windows,
      closeWindow: this.closeWindow.bind(this),
      dragWindow: this.dragWindow.bind(this),
    });

    const iconRootEl = this.element.querySelector('.icon-root') as HTMLElement;
    new Icons(iconRootEl, {
      icons: this.state.icons,
      swapIcons: this.swapIcons.bind(this),
      doubleClickIcon: this.doubleClickIcon.bind(this),
    });

    new ContextMenu(this.element, {
      contextMenu: this.state.contextMenu,
      deleteIcon: this.deleteIcon.bind(this),
      createFolder: this.createFolder.bind(this),
    });
  }

  setEvent(): void {
    this.addEvent('contextmenu', (e: MouseEvent) => {
      e.preventDefault();
      const targetEl = e.target as HTMLElement;
      const position = { x: e.clientX, y: e.clientY };
      const dataIdEl = targetEl.closest('[data-id]') as HTMLElement;
      const isIconClicked = dataIdEl?.classList.contains('folder') || dataIdEl?.classList.contains('application');
      const iconId = isIconClicked ? dataIdEl.dataset.id : null;

      this.openContextMenu(position, isIconClicked, iconId);
    });

    this.addEvent('click', () => this.closeContextMenu());
  }

  openContextMenu(position: { x: number; y: number }, isIconClicked: boolean, iconId: string | null) {
    const contextMenu = { ...this.state.contextMenu };
    this.setState({
      ...this.state,
      contextMenu: {
        ...contextMenu,
        isVisible: true,
        position,
        isIconClicked,
        iconId,
      },
    });
  }

  deleteIcon(id: string) {
    const applications = [...this.state.icons.applications];
    const folders = [...this.state.icons.folders];

    this.setState({
      ...this.state,
      icons: {
        applications: applications.filter(application => application.id !== id),
        folders: folders.filter(folder => folder.id !== id),
      },
    });
  }

  createFolder() {
    const folders = [...this.state.icons.folders];
    console.log(this.state);
    this.setState({
      ...this.state,
      icons: {
        ...this.state.icons,
        folders: [
          ...folders,
          {
            order: folders.length + this.state.icons.applications.length,
            type: FOLDER_LABEL,
            title: `new folder ${folders.length + 1}`,
            id: makeId(),
          },
        ],
      },
    });
  }

  closeContextMenu() {
    const contextMenu = { ...this.state.contextMenu };

    this.setState({
      ...this.state,
      contextMenu: {
        ...contextMenu,
        isVisible: false,
      },
    });
  }

  swapIcons(newIcons: { applications: ApplicationType[]; folders: FolderType[] }): void {
    this.setState({ ...this.state, icons: newIcons });
  }

  doubleClickIcon(title: string): void {
    const windows = [...this.state.windows] || [];
    const openedWindowIdx = windows.findIndex(window => window.title === title);

    if (openedWindowIdx >= 0) {
      windows.map(window => (window.isSelected = false));
      windows[openedWindowIdx].isSelected = true;

      this.setState({
        ...this.state,
        windows,
      });
      return;
    }

    this.setState({
      ...this.state,
      windows: [
        ...windows,
        {
          id: makeId(),
          title,
          position: { x: 500 + 50 * windows.length, y: 100 + 60 * windows.length },
          type: WINDOW_LABEL,
          isSelected: true,
        },
      ],
    });
  }

  closeWindow(id: string): void {
    const windows = [...this.state.windows] || [];

    this.setState({
      ...this.state,
      windows: windows.filter(window => window.id !== id),
    });
  }

  dragWindow(id: string, draggingWindowState: WindowType): void {
    const windows = [...this.state.windows] || [];
    windows.map(window => (window.isSelected = false));
    draggingWindowState.isSelected = true;

    this.setState({
      ...this.state,
      windows: [...windows.filter(window => window.id !== id), draggingWindowState],
    });
  }
}

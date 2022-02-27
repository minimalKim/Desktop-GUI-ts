import { IconsType, ContextMenuType, WindowType } from '@/types';
import { ContextMenu } from './../ContextMenu/ContextMenu';
import { Windows } from './../Windows/Windows';
import { FOLDER_LABEL, APPLICATION_LABEL, WINDOW_LABEL, LINK_LABEL } from '@/utils/constants';
import { makeId } from '@/utils/helper';
import { Icons } from '../Icons';
import styles from './Desktop.module.css';
import { StatefulComponent } from '@/core/Component';

type DesktopProps = {};
type DesktopState = {
  icons: IconsType;
  contextMenu: ContextMenuType;
  windows?: WindowType[];
};

export class Desktop extends StatefulComponent<DesktopProps, DesktopState> {
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
        links: [
          { order: 0, type: LINK_LABEL, title: 'Github', id: makeId(), url: process.env.GITHUB_URL },
          {
            order: 1,
            type: LINK_LABEL,
            title: 'Notion',
            id: makeId(),
            url: process.env.NOTION_URL,
          },
        ],
        applications: [{ order: 2, type: APPLICATION_LABEL, title: 'Todo', id: makeId() }],
        folders: [
          { order: 3, type: FOLDER_LABEL, title: 'folder 1', id: makeId() },
          { order: 4, type: FOLDER_LABEL, title: 'folder 2', id: makeId() },
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
      const isIconClicked = [FOLDER_LABEL, APPLICATION_LABEL, LINK_LABEL].some(className =>
        dataIdEl?.classList.contains(className)
      );
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
    const links = [...this.state.icons.links];

    this.setState({
      ...this.state,
      icons: {
        links: links.filter(link => link.id !== id),
        applications: applications.filter(application => application.id !== id),
        folders: folders.filter(folder => folder.id !== id),
      },
    });
  }

  createFolder() {
    const folders = [...this.state.icons.folders];
    const icons = { ...this.state.icons };
    const iconsLength = Object.entries(icons)
      .map(icon => icon[1].length)
      .reduce((a, b) => a + b);

    this.setState({
      ...this.state,
      icons: {
        ...icons,
        folders: [
          ...folders,
          {
            order: iconsLength,
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

  swapIcons(newIcons: IconsType): void {
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

import { Component } from '@/core/Component';
import styles from './ContextMenu.module.css';

type ContextMenuProps = {
  contextMenu: {
    isVisible: boolean;
    isIconClicked: boolean;
    position: { x: number; y: number };
    iconId: string | null;
  };
  deleteIcon: (id: string) => void;
  createFolder: () => void;
};

type ContextMenuState = {};

export class ContextMenu extends Component<ContextMenuProps, ContextMenuState> {
  template() {
    return `
      <div class="context-menu ${styles.wrapper}" >
        <ul>
          ${
            this.props.contextMenu.isIconClicked
              ? `<li class="delete">Delete</li>`
              : `<li class="new-folder">New Folder</li>
                  <li class="reload">ReLoad</li>
                  <li>More info...</li>`
          }
        </ul>
      </div>`;
  }

  didMount(): void {
    const { isVisible, position } = this.props.contextMenu;
    this.element.style.visibility = isVisible ? 'visible' : 'hidden';
    this.element.style.position = 'absolute';
    this.element.style.top = `${position.y}px`;
    this.element.style.left = `${position.x}px`;
  }

  setEvent(): void {
    const { contextMenu, deleteIcon, createFolder } = this.props;
    this.addEvent('click', () => deleteIcon(contextMenu.iconId), '.delete');
    this.addEvent('click', () => createFolder(), '.new-folder');
    this.addEvent('click', () => location.reload(), '.reload');
  }
}

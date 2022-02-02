import { StatelessComponent } from '@/core/Component';
import { IFolderIcon } from '@/types/index';
import { DRAG_BOX, DRAG_GRABBER, FOLDER_LABEL } from '@/utils/constants';
import { folderIconDataURI } from './image';
import styles from './Folder.module.css';

type FolderProps = IFolderIcon;

export class Folder extends StatelessComponent<FolderProps> {
  template() {
    return `
      <div class="${styles.wrapper} ${DRAG_BOX} ${FOLDER_LABEL}" data-id="${this.props.id}">
        <div class="${styles.grabber} ${DRAG_GRABBER}">
          <img alt="folder-icon" >
        </div>
        <h3 class="title"></h3>
      </div>`;
  }

  didMount(): void {
    const titleEl = this.element.querySelector('.title');
    titleEl.textContent = this.props.title;

    const imgEl = this.element.querySelector('img');
    imgEl.ondragstart = () => false;
    imgEl.src = folderIconDataURI;
  }
}

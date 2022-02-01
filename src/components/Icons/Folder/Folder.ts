import { FolderType } from './../../Desktop/Desktop';
import { DRAG_BOX, DRAG_GRABBER } from '@/utils/constants';
import { Component } from '@/core/Component';
import styles from './Folder.module.css';

export class Folder extends Component<FolderType, FolderType> {
  template() {
    return `
      <div class="${styles.wrapper} ${DRAG_BOX} folder" data-id="${this.props.id}">
        <div class="${styles.grabber} ${DRAG_GRABBER}">
          <div class="${styles.front}"></div>
          <div class="${styles.back}"></div>   
          <h3 class="title"></h3>
        </div>
      </div>`;
  }

  didMount(): void {
    const titleEl = this.element.querySelector('.title');
    titleEl.textContent = this.props.title;
  }
}

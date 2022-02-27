import { DRAG_BOX, FOLDER_LABEL, DRAG_GRABBER, LINK_LABEL, DRAG_GRABBER_SELECTOR } from '@/utils/constants';
import { StatelessComponent } from '../Component';
import { IconType } from '@/types';
import styles from './Icon.module.css';
import { LinkIconProps } from '@/components/Icons/LinkIcon';
import { defaultIconDataURI } from './image';

export class IconComponent<P extends IconType> extends StatelessComponent<P> {
  protected imgDataURI: string;

  setImgDataURI(imgDataURI: string): void {
    this.imgDataURI = imgDataURI;
  }

  template(): string {
    const { type, id } = this.props;

    return `
      <div class="${styles.wrapper} ${DRAG_BOX} ${type}" data-id="${id}">
        ${type === LINK_LABEL ? '<a target="_blank">' : ''}
          <div class="${DRAG_GRABBER}">
            <img alt=${type} >
          </div>
          <h3 class="title"></h3>
        ${type === LINK_LABEL ? '</a>' : ''}
      </div>`;
  }

  didMount(): void {
    if (this.props.type === LINK_LABEL) {
      const aEl = this.element.querySelector('a');
      aEl.href = (this.props as unknown as LinkIconProps).url;
    }

    const titleEl = this.element.querySelector('.title');
    titleEl.textContent = this.props.title;

    const imgEl = this.element.querySelector('img');
    imgEl.ondragstart = () => false;
    imgEl.src = this.imgDataURI || defaultIconDataURI;

    const { top, right, bottom, left } = this.element.getBoundingClientRect();
    this.element.dataset.top = top.toString();
    this.element.dataset.right = right.toString();
    this.element.dataset.bottom = bottom.toString();
    this.element.dataset.left = left.toString();
  }
}

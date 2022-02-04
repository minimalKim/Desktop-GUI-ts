import { GithubIconDataURI, notionIconDataURI } from './image';
import { ILinkIcon } from '@/types/index';
import { StatelessComponent } from '@/core/Component';
import { DRAG_BOX, DRAG_GRABBER, LINK_LABEL } from '@/utils/constants';
import styles from './LinkIcon.module.css';

type LinkIconProps = ILinkIcon;

export class LinkIcon extends StatelessComponent<LinkIconProps> {
  template() {
    return `
      <div class="${styles.wrapper} ${DRAG_BOX} ${LINK_LABEL}" data-id="${this.props.id}">
        <a target="_blank">
          <div class="${styles.icon} ${DRAG_GRABBER}">
            <img alt="${this.props.title}-icon" >
          </div>
          <h3 class="title"></h3>
        </a>
      </div>`;
  }

  didMount(): void {
    const titleEl = this.element.querySelector('.title');
    titleEl.textContent = this.props.title;

    const aEl = this.element.querySelector('a');
    aEl.href = this.props.url;

    const imgEl = this.element.querySelector('img');
    imgEl.ondragstart = () => false;
    imgEl.src = this.props.title === 'Github' ? GithubIconDataURI : notionIconDataURI;
  }
}

import { GithubIconDataURI, notionIconDataURI } from './image';
import { ILinkIcon } from '@/types/index';
import { IconComponent } from '@/core/Icon/Icon';

export type LinkIconProps = ILinkIcon;

export class LinkIcon extends IconComponent<LinkIconProps> {
  willMount(): void {
    this.props.title === 'Github' ? this.setImgDataURI(GithubIconDataURI) : this.setImgDataURI(notionIconDataURI);
  }
}

import { GithubIconDataURI, notionIconDataURI } from './image';
import { LinkIconType } from '@/types/index';
import { IconComponent } from '@/core/Icon/Icon';

export type LinkIconProps = LinkIconType;

export class LinkIcon extends IconComponent<LinkIconProps> {
  willMount(): void {
    this.props.title === 'Github' ? this.setImgDataURI(GithubIconDataURI) : this.setImgDataURI(notionIconDataURI);
  }
}

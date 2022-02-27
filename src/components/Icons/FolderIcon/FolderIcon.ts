import { FolderIconType } from '@/types/index';
import { folderIconDataURI } from './image';
import { IconComponent } from '@/core/Icon/Icon';

type FolderIconProps = FolderIconType;

export class FolderIcon extends IconComponent<FolderIconProps> {
  willMount(): void {
    this.setImgDataURI(folderIconDataURI);
  }
}

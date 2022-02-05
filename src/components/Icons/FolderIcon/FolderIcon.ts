import { IFolderIcon } from '@/types/index';
import { folderIconDataURI } from './image';
import { IconComponent } from '@/core/Icon/Icon';

type FolderIconProps = IFolderIcon;

export class FolderIcon extends IconComponent<FolderIconProps> {
  willMount(): void {
    this.setImgDataURI(folderIconDataURI);
  }
}

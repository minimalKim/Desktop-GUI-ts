export interface IContextMenu {
  isVisible: boolean;
  isIconClicked: boolean;
  position: Position;
  iconId: string | null;
}

export interface IWindow extends BaseUI {
  isSelected: boolean;
  position: Position;
}

export interface ILinkIcon extends IIcon {
  url: string;
}

export interface IApplicationIcon extends IIcon {}

export interface IFolderIcon extends IIcon {
  children?: Array<IFolderIcon | IApplicationIcon>;
}

export interface IIcon extends BaseUI {
  order: number;
}

interface BaseUI {
  id: string;
  title: string;
  type: string;
}

export type IconsType = { links: ILinkIcon[]; applications: IApplicationIcon[]; folders: IFolderIcon[] };

export type Position = {
  x: number;
  y: number;
};

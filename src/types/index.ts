export type Position = {
  x: number;
  y: number;
};

type BaseUIType = {
  id: string;
  title: string;
  type: string;
};

export type IconType = BaseUIType & {
  order: number;
};

export type LinkIconType = IconType & {
  url: string;
};

export type ApplicationIconType = IconType;

export type FolderIconType = IconType & {
  children?: Array<FolderIconType | ApplicationIconType>;
};

export type IconsType = { links: LinkIconType[]; applications: ApplicationIconType[]; folders: FolderIconType[] };

export type ContextMenuType = {
  isVisible: boolean;
  isIconClicked: boolean;
  position: Position;
  iconId: string | null;
};

export type WindowType = BaseUIType & {
  isSelected: boolean;
  position: Position;
};

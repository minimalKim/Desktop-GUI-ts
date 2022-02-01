import { Folder } from './Folder';
import { ApplicationType, FolderType } from './../Desktop';
import { APPLICATION_LABEL, DRAG_GRABBER_SELECTOR } from '@/utils/constants';
import { Component } from '@/core/Component';
import { clickSwitcher, createMouseDownHandlerForDragDrop } from '@/utils/event';
import { Application } from './Application';

type IconsProps = {
  icons: {
    applications: ApplicationType[];
    folders: FolderType[];
  };
  swapIcons: (newIcons: newIcons) => void;
  doubleClickIcon: (title: string) => void;
};

type newIcons = { applications: ApplicationType[]; folders: FolderType[] };

type IconsState = {};

export class Icons extends Component<IconsProps, IconsState> {
  willMount(): void {
    const { sortedIcons, targetEl } = this;
    sortedIcons.map(icon =>
      icon.type === APPLICATION_LABEL ? new Application(targetEl, icon) : new Folder(targetEl, icon)
    );
  }

  setEvent(): void {
    const { icons, swapIcons, doubleClickIcon } = this.props;

    const mouseDownHandler = createMouseDownHandlerForDragDrop(true, () => {
      const iconEls = this.targetEl.children;
      const newIcons: newIcons = { applications: [], folders: [] };

      Array.from(iconEls).map((iconEl, idx) => {
        const itemId = (iconEl as HTMLElement).dataset.id;
        const isApplication = iconEl.classList.contains('application');

        const matchedItemState = isApplication
          ? icons.applications.find(application => application.id === itemId)
          : icons.folders.find(folder => folder.id === itemId);
        if (!matchedItemState) return;

        isApplication
          ? newIcons.applications.push({ ...matchedItemState, order: idx + 1 })
          : newIcons.folders.push({ ...matchedItemState, order: idx + 1 });
      });

      swapIcons(newIcons);
    });

    const doubleClickHandler = ({ target }: MouseEvent) => {
      const targetEl = target as HTMLElement;
      const title = targetEl.closest('[data-id]').querySelector('.title').textContent;
      doubleClickIcon(title);
    };

    this.addEvent(
      'mousedown',
      (e: MouseEvent) => clickSwitcher(e, mouseDownHandler, doubleClickHandler),
      DRAG_GRABBER_SELECTOR
    );
  }

  get sortedIcons() {
    const icons = [...this.props.icons.applications, ...this.props.icons.folders];
    return icons.sort((a, b) => a.order - b.order);
  }
}

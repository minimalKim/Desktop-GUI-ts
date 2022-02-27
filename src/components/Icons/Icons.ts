import { LinkIcon } from './LinkIcon/LinkIcon';
import { FolderIcon } from './FolderIcon/FolderIcon';
import { ApplicationIcon } from './ApplicationIcon/ApplicationIcon';
import { FOLDER_LABEL, LINK_LABEL } from './../../utils/constants';
import { IconsType, LinkIconType } from '@/types/index';
import { APPLICATION_LABEL, DRAG_GRABBER_SELECTOR } from '@/utils/constants';
import { StatelessComponent } from '@/core/Component';
import { clickSwitcher, createMouseDownHandlerForDragDrop } from '@/utils/event';

type IconsProps = {
  icons: IconsType;
  swapIcons: (newIcons: IconsType) => void;
  doubleClickIcon: (title: string) => void;
};

export class Icons extends StatelessComponent<IconsProps> {
  willMount(): void {
    const { sortedIcons, targetEl } = this;

    sortedIcons.map(icon => {
      switch (icon.type) {
        case APPLICATION_LABEL:
          return new ApplicationIcon(targetEl, icon);
        case FOLDER_LABEL:
          return new FolderIcon(targetEl, icon);
        case LINK_LABEL:
          return new LinkIcon(targetEl, icon as LinkIconType);
      }
    });
  }

  setEvent(): void {
    const { icons, swapIcons, doubleClickIcon } = this.props;

    const mouseDownHandler = createMouseDownHandlerForDragDrop(true, () => {
      const iconEls = this.targetEl.children;
      const newIcons: IconsType = { applications: [], folders: [], links: [] };

      Array.from(iconEls).map((iconEl, idx) => {
        const itemId = (iconEl as HTMLElement).dataset.id;

        const isApplication = iconEl.classList.contains(APPLICATION_LABEL);
        const isLink = iconEl.classList.contains(LINK_LABEL);

        const matchedItemState = isApplication
          ? icons.applications.find(application => application.id === itemId)
          : isLink
          ? icons.links.find(link => link.id === itemId)
          : icons.folders.find(folder => folder.id === itemId);
        if (!matchedItemState) return;

        isApplication
          ? newIcons.applications.push({ ...matchedItemState, order: idx + 1 })
          : isLink
          ? newIcons.links.push({ ...(matchedItemState as LinkIconType), order: idx + 1 })
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
    const icons = [...this.props.icons.applications, ...this.props.icons.folders, ...this.props.icons.links];
    return icons.sort((a, b) => a.order - b.order);
  }
}

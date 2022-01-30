import { ApplicationType, FolderType } from './../Desktop';
import { APPLICATION_LABEL } from './../../utils/constants';
import Component from '@/core/Component';
import Application from './Application';

type IconsProps = {
  icons: {
    applications: ApplicationType[];
    folders: FolderType[];
  };
};
type IconsState = {};

export default class Icons extends Component<IconsProps, IconsState> {
  didMount(): void {
    const { sortedIcons } = this;
    const icon = sortedIcons.map(icon => {
      icon.type === APPLICATION_LABEL ? new Application(this.targetEl, icon) : '';
    });
  }

  setEvent(): void {
    this.addEvent('mousedown', '.icon', e => {
      console.log('click');
    });
  }

  get sortedIcons() {
    const icons = [...this.props.icons.applications, ...this.props.icons.folders];
    return icons.sort((a, b) => a.order - b.order);
  }
}

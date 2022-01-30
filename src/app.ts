import { Desktop } from './components/Desktop';
import Component from './core/Component';

type AppState = {};
type AppProps = {};

export default class App extends Component<AppProps, AppState> {
  template() {
    return `
      <main id="desktop"></main>
    `;
  }

  didMount() {
    const desktopEl = this.targetEl.querySelector('#desktop') as HTMLElement;
    new Desktop(desktopEl);
  }
}

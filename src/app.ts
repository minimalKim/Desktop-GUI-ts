import { StatelessComponent } from '@/core/Component';
import { Desktop } from './components/Desktop';
import { StatefulComponent } from './core/Component';

type AppProps = {};

export default class App extends StatelessComponent<AppProps> {
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

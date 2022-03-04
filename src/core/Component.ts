import { isEqual } from '@/utils/helper';

export interface IComponent {
  willMount(): void;
  template(): void;
  render(isUpdated: boolean): void;
  didMount(): void;
  setEvent(): void;
  addEvent(eventType: string, callback: (event: Event) => void, selector?: string): void;
}

export interface IStatefulComponent<S> extends IComponent {
  setState(newState: S): void;
}

export class StatelessComponent<P> implements IComponent {
  protected readonly targetEl: HTMLElement;
  protected element: HTMLElement;
  protected readonly props: P;

  constructor(targetEl: HTMLElement, props?: P) {
    this.targetEl = targetEl;
    this.props = props;
    this.willMount();
    this.setEvent();
    this.render(false);
  }

  willMount() {}

  template() {
    return '';
  }

  render(isUpdated: boolean) {
    const template = document.createElement('template');
    template.innerHTML = this.template();

    if (isUpdated && this.targetEl.hasChildNodes()) {
      this.targetEl.childNodes.forEach(child => this.targetEl.removeChild(child));
    }

    this.element = template.content.firstElementChild as HTMLElement;
    this.element && this.targetEl.insertAdjacentElement('beforeend', this.element);

    this.didMount();
  }

  didMount() {}

  setEvent() {}

  addEvent(eventType: string, callback: (event: Event) => void, selector?: string) {
    const hasClosest = (target: EventTarget) => {
      const eventTargetEl = target as HTMLElement;
      return !!eventTargetEl.closest(selector);
    };
    this.targetEl.addEventListener(eventType, event => {
      if (selector && !hasClosest(event.target)) return;
      callback(event);
    });
  }
}

export class StatefulComponent<P, S> extends StatelessComponent<P> implements IStatefulComponent<S> {
  protected state: S;

  setState(newState: S) {
    if (isEqual(this.state, newState)) return;
    this.state = { ...this.state, ...newState };
    this.render(true);
  }
}

export interface IComponent {
  willMount(): void;
  template(): void;
  render(isUpdated: boolean): void;
  didMount(): void;
  setEvent(): void;
  addEvent(eventType: string, selector: string, callback: (event: Event) => void): void;
}

export default class Component<P, S> implements IComponent {
  protected readonly targetEl: HTMLElement;
  element: HTMLElement;
  state: S;
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

  setState(newState: S) {
    this.state = { ...this.state, ...newState };
    this.render(true);
  }

  setEvent() {}

  addEvent(eventType: string, selector: string, callback: (event: Event) => void) {
    const hasClosest = (target: EventTarget) => {
      const eventTargetEl = target as HTMLElement;
      return !!eventTargetEl.closest(selector);
    };
    this.targetEl.addEventListener(eventType, event => {
      if (!hasClosest(event.target)) return false;
      callback(event);
    });
  }
}

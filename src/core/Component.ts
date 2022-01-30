export interface IComponent {
  willMount(): void;
  template(): void;
  render(): void;
  didMount(): void;
  setEvent(): void;
  addEvent(eventType: string, selector: string, callback: (event: Event) => void): void;
}

export default class Component<P, S> implements IComponent {
  targetEl: HTMLElement;
  protected state: S;
  props: P;

  constructor(targetEl: HTMLElement, props?: P) {
    this.targetEl = targetEl;
    this.props = props;
    this.willMount();
    this.setEvent();
    this.render();
  }

  willMount() {}

  template() {
    return '';
  }

  render() {
    const template = document.createElement('template');
    template.innerHTML = this.template();
    template.content.firstElementChild &&
      this.targetEl.insertAdjacentElement('beforeend', template.content.firstElementChild);
    this.didMount();
  }

  didMount() {}

  setState(newState: S) {
    this.state = { ...this.state, ...newState };
    this.render();
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

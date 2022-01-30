import styles from './test.module.css';

export function test($target: HTMLElement, text: string) {
  const $h2 = document.createElement('h2');
  $h2.classList.add(styles.test);
  $h2.innerText = text;
  $target.appendChild($h2);
}

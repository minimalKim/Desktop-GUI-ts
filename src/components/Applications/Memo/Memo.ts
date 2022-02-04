import { StatefulComponent } from '@/core/Component';

type MemoProps = {};
type MemoState = {
  memos: IMemo[];
};

interface IMemo {
  title: string;
  contents: string;
  createdAt: Date;
}

export class Memo extends StatefulComponent<MemoProps, MemoState> {
  template(): string {
    return `
    <div>
      <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
      </ul>
      <section>
      </section>
    </div>
      `;
  }

  willMount(): void {
    this.setState({
      memos: [
        {
          title: '1',
          contents: 'test',
          createdAt: new Date(),
        },
        {
          title: '2',
          contents: 'test',
          createdAt: new Date(),
        },
        {
          title: '3',
          contents: 'test',
          createdAt: new Date(),
        },
      ],
    });
  }
}

export function makeId(): string {
  return Math.random().toString(36);
}

export const getType = (obj: Array<any> | Object) => {
  return Object.prototype.toString.call(obj).slice(8, -1);
};

export const replacer = (_: any, value: any) => {
  switch (getType(value)) {
    case 'Array':
      return (value as Array<any>).sort();
    case 'Object':
      return Object.entries(value).sort();
    default:
      return value;
  }
};

export const stringify = <S>(state: S) => {
  return JSON.stringify(state, replacer);
};

export const isEqual = <S>(prevState: S, newState: S): boolean => {
  return stringify(prevState) === stringify(newState);
};

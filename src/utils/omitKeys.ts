export default function <T extends object>(obj: T, keys: string[]) {
  const newObj: any = Object.assign({}, obj);
  for (const key of keys) {
    delete newObj[key];
  }

  return newObj as T;
}

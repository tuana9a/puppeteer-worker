export default function nullify(object: any) {
  const keys = Object.keys(object);
  for (const key of keys) {
    // eslint-disable-next-line no-param-reassign
    object[key] = null;
  }
}

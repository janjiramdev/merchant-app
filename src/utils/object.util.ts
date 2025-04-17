export const cleanObject = <T>(obj: T): T => {
  return Object.fromEntries(
    Object.entries(obj as object).filter((entrie) => entrie[1] !== undefined),
  ) as T;
};

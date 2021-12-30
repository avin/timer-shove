export const wait = (time: number): Promise<void> => {
  return new Promise((r) => {
    setTimeout(r, time);
  });
};

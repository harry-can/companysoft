export default (s: string) => {
  return s.replace(
    /[A-Z]/gi,
    (c) =>
      'UVWXYZABCDEFGHIJKLMNOPQRSTuvwxyzabcdefghijklmnopqrst'[
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.indexOf(c)
      ],
  );
};

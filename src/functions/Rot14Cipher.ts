export default (s: string) => {
  return s.replace(
    /[A-Z]/gi,
    (c) =>
      'OPQRSTUVWXYZABCDEFGHIJKLMNopqrstuvwxyzabcdefghijklmn'[
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.indexOf(c)
      ],
  );
};

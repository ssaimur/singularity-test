const getDateIntArr = () =>
  Date.now()
    .toString()
    .split('')
    .reverse()
    .map((d) => parseInt(d));

export const generateOTP = () => {
  let seed = getDateIntArr();
  const dateIntArr = getDateIntArr();
  seed = dateIntArr.map((d, index) => {
    let newVal = d + seed[index];
    if (newVal > 9) {
      newVal = newVal % 10;
    }
    return newVal;
  });
  seed.push(seed.shift() || 0);
  return seed.join('').substring(0, 6);
};
export const encryptLogPhoneNumber = (phoneNumber: string) => {
  const startIndex = 3;
  const endIndex = phoneNumber.length - 4;
  let replacedStr = '';
  for (let i = 0; i < phoneNumber.length; i++) {
    if (i >= startIndex && i < endIndex) {
      replacedStr += '*';
    } else {
      replacedStr += phoneNumber[i];
    }
  }

  return replacedStr;
};

export const encryptLogString = (str: string) => {
  const startIndex = 0;
  const endIndex = str.length;
  let replacedStr = '';
  for (let i = 0; i < str.length; i++) {
    if (i >= startIndex && i < endIndex) {
      replacedStr += '*';
    } else {
      replacedStr += str[i];
    }
  }

  return replacedStr;
};

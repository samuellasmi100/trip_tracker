const sixDigitGenerator = () => {
  let min = 100000;
  let max = 999999;
  let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
};

const censorWord = (str) => {
  return str[0] + "*".repeat(str?.length - 2) + str.slice(-1);
};

const censorEmail = (email) => {
  let arr = email.split("@");
  return censorWord(arr[0]) + "@" + arr[1];
};

module.exports = {
  censorWord,
  censorEmail,
  sixDigitGenerator,
};

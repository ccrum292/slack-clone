module.exports = str => {
  try {
    JSON.parse(str);
  } catch (err) {
    return false;
  }

  return true;
}
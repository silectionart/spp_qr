module.exports = (obj, list) => {
  list.forEach(item => {
    obj[item] = parseInt(obj[item].toString());
  })
  return obj;
}
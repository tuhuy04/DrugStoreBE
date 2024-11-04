export const mapOrder = (array, order, key) => {
  return array.sort((a, b) => {
    return order.indexOf(a[key]) - order.indexOf(b[key]);
  })
};

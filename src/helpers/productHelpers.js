export const getInStockQuantity = (quantity) => {
  const parsedQuantity = parseInt(quantity, 10);
  return parsedQuantity > 0 ? parsedQuantity : 0;
};

export const checkIfOutOfStock = (tags) => tags?.findIndex((el) => el.key === 'out_of_stock') >= 0;

export const convertToFinalPaymentValue = (amount) => parseFloat(amount * 100).toFixed(0);

export const calculateTotalPrice = (product, productCount, modificators, vatPrice) => {
  const unitCost = parseFloat(product.list_price);
  const additionalCost = modificators
    .filter((modificator) => modificator.checked)
    .reduce((sum, addon) => sum + parseFloat(addon.price), 0);
  const productWithAddonsCost = unitCost + additionalCost;
  const totalVatPrice = vatPrice * productCount;
  const totalPrice = productWithAddonsCost * productCount + totalVatPrice;

  return totalPrice;
};

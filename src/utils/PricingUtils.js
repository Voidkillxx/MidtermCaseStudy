/**
 * Calculates the selling price of a product after applying a discount.
 * @param {number} price - The original price of the product.
 * @param {number} discount - The discount percentage (e.g., 10 for 10%).
 * @returns {number} The calculated selling price.
 */
export function calculateSellingPrice(price, discount) {
  const validPrice = parseFloat(price) || 0;
  const validDiscount = parseFloat(discount) || 0;
  
  // Selling Price = Price * (1 - Discount/100)
  return validPrice * (1 - validDiscount / 100);
}
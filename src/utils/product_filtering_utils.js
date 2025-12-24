// Utility functions for product filtering based on tags

/**
 * Filter products by a specific tag key
 * @param {Array} products - Array of product objects
 * @param {string} tagKey - The tag key to filter by (e.g., 'bestseller', 'new', 'exclusive', 'limited')
 * @returns {Array} Filtered array of products
 */
export const filterProductsByTag = (products, tagKey) => {
  if (!products || !Array.isArray(products)) {
    return [];
  }

  return products.filter(
    (product) =>
      product.tags &&
      Array.isArray(product.tags) &&
      product.tags.some((tag) => tag.key === tagKey)
  );
};

/**
 * Filter products by multiple tag keys (OR condition)
 * @param {Array} products - Array of product objects
 * @param {Array} tagKeys - Array of tag keys to filter by
 * @returns {Array} Filtered array of products
 */
export const filterProductsByMultipleTags = (products, tagKeys) => {
  if (
    !products ||
    !Array.isArray(products) ||
    !tagKeys ||
    !Array.isArray(tagKeys)
  ) {
    return [];
  }

  return products.filter(
    (product) =>
      product.tags &&
      Array.isArray(product.tags) &&
      product.tags.some((tag) => tagKeys.includes(tag.key))
  );
};

/**
 * Filter products that have ALL specified tags (AND condition)
 * @param {Array} products - Array of product objects
 * @param {Array} tagKeys - Array of tag keys that must all be present
 * @returns {Array} Filtered array of products
 */
export const filterProductsByAllTags = (products, tagKeys) => {
  if (
    !products ||
    !Array.isArray(products) ||
    !tagKeys ||
    !Array.isArray(tagKeys)
  ) {
    return [];
  }

  return products.filter((product) => {
    if (!product.tags || !Array.isArray(product.tags)) {
      return false;
    }

    const productTagKeys = product.tags.map((tag) => tag.key);
    return tagKeys.every((tagKey) => productTagKeys.includes(tagKey));
  });
};

/**
 * Get all unique tag keys from products
 * @param {Array} products - Array of product objects
 * @returns {Array} Array of unique tag keys
 */
export const getUniqueTagKeys = (products) => {
  if (!products || !Array.isArray(products)) {
    return [];
  }

  const tagKeys = new Set();

  products.forEach((product) => {
    if (product.tags && Array.isArray(product.tags)) {
      product.tags.forEach((tag) => {
        if (tag.key) {
          tagKeys.add(tag.key);
        }
      });
    }
  });

  return Array.from(tagKeys);
};

/**
 * Get products organized by sections based on their tags
 * @param {Array} products - Array of product objects
 * @param {Object} sectionConfig - Configuration object for sections
 * @returns {Array} Array of section objects with filtered products
 */
export const getProductsBySection = (products, sectionConfig = null) => {
  if (!products || !Array.isArray(products)) {
    return [];
  }

  // Default section configuration
  const defaultSectionConfig = {
    bestseller: {
      title: "Best Sellers",
      tagKey: "bestseller",
      priority: 1,
    },
    new: {
      title: "New Arrivals",
      tagKey: "new",
      priority: 2,
    },
    exclusive: {
      title: "Exclusive",
      tagKey: "exclusive",
      priority: 3,
    },
    limited: {
      title: "Limited",
      tagKey: "limited",
      priority: 4,
    },
  };

  const config = sectionConfig || defaultSectionConfig;

  const sections = Object.entries(config).map(([key, sectionData]) => ({
    key,
    title: sectionData.title,
    priority: sectionData.priority || 999,
    products: filterProductsByTag(products, sectionData.tagKey),
  }));

  // Filter out sections with no products and sort by priority
  return sections
    .filter((section) => section.products.length > 0)
    .sort((a, b) => a.priority - b.priority);
};

/**
 * Get products that don't belong to any specific section (no tags or unmatched tags)
 * @param {Array} products - Array of product objects
 * @param {Array} usedTagKeys - Array of tag keys that are already used in sections
 * @returns {Array} Array of products without matching tags
 */
export const getUncategorizedProducts = (products, usedTagKeys = []) => {
  if (!products || !Array.isArray(products)) {
    return [];
  }

  return products.filter((product) => {
    if (
      !product.tags ||
      !Array.isArray(product.tags) ||
      product.tags.length === 0
    ) {
      return true; // Products with no tags
    }

    // Check if product has any tags that match the used tag keys
    const hasMatchingTag = product.tags.some((tag) =>
      usedTagKeys.includes(tag.key)
    );
    return !hasMatchingTag;
  });
};

/**
 * Get tag statistics for products
 * @param {Array} products - Array of product objects
 * @returns {Object} Object with tag statistics
 */
export const getTagStatistics = (products) => {
  if (!products || !Array.isArray(products)) {
    return {};
  }

  const tagStats = {};

  products.forEach((product) => {
    if (product.tags && Array.isArray(product.tags)) {
      product.tags.forEach((tag) => {
        if (tag.key) {
          if (!tagStats[tag.key]) {
            tagStats[tag.key] = {
              count: 0,
              translatedValue: tag.translated_value || tag.key,
              products: [],
            };
          }
          tagStats[tag.key].count++;
          tagStats[tag.key].products.push(product.id);
        }
      });
    }
  });

  return tagStats;
};

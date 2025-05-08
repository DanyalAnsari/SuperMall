/**
 * Format category for display
 * @param {Object} category - Raw category data
 * @returns {Object} Formatted category
 */
export const formatCategory = (category) => {
  if (!category) return null;
  
  return {
    id: category._id,
    name: category.name,
    slug: category.slug,
    description: category.description || '',
    icon: category.icon || 'ShoppingBag',
    parentCategory: category.parent_category,
    subcategories: category.subcategories || [],
    isActive: category.isActive,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
};

/**
 * Get parent categories (categories with no parent)
 * @param {Array} categories - List of categories
 * @returns {Array} Parent categories
 */
export const getParentCategories = (categories) => {
  if (!categories || !Array.isArray(categories)) return [];
  return categories.filter((cat) => !cat.parentCategory);
};

/**
 * Organize categories in a hierarchical tree structure
 * @param {Array} categories - List of categories
 * @returns {Array} Tree structure of categories
 */
export const buildCategoriesTree = (categories) => {
  if (!categories || !Array.isArray(categories)) return [];
  
  const tree = [];
  const map = {};
  
  // First pass: create map of categories by ID
  categories.forEach((category) => {
    map[category.id] = {
      ...category,
      children: [],
    };
  });
  
  // Second pass: build the tree structure
  categories.forEach((category) => {
    if (category.parentCategory && map[category.parentCategory]) {
      // If it has a parent, add to parent's children
      map[category.parentCategory].children.push(map[category.id]);
    } else {
      // If it's a top-level category, add to tree
      tree.push(map[category.id]);
    }
  });
  
  return tree;
};

/**
 * Get subcategories for a specific category
 * @param {Array} categories - List of all categories
 * @param {String} categoryId - Parent category ID
 * @returns {Array} List of subcategories
 */
export const getSubcategories = (categories, categoryId) => {
  if (!categories || !Array.isArray(categories) || !categoryId) return [];
  return categories.filter((cat) => cat.parentCategory === categoryId);
};

/**
 * Find a category by ID from a list of categories
 * @param {Array} categories - List of categories
 * @param {String} id - Category ID to find
 * @returns {Object|null} The found category or null
 */
export const findCategoryById = (categories, id) => {
  if (!categories || !Array.isArray(categories) || !id) return null;
  return categories.find((cat) => cat.id === id) || null;
};

/**
 * Find a category by slug from a list of categories
 * @param {Array} categories - List of categories
 * @param {String} slug - Category slug to find
 * @returns {Object|null} The found category or null
 */
export const findCategoryBySlug = (categories, slug) => {
  if (!categories || !Array.isArray(categories) || !slug) return null;
  return categories.find((cat) => cat.slug === slug) || null;
}; 
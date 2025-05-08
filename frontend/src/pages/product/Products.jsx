import React, { useState, useEffect } from "react";
import { useProducts } from "../../features/products/hooks/useProducts";
import { Link, useParams } from "react-router";
import ProductCard from "../../features/products/components/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCategories } from "@/features/categories/hooks/useCategories";

const ProductsSidebar = ({
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  applyFilters,
}) => {
  const { categories } = useCategories();
  return (
    <div className="p-4 border-r h-full">
      <div className="collapse collapse-arrow mb-4">
        <input type="checkbox" defaultChecked />
        <div className="collapse-title px-0 font-medium">Categories</div>
        <div className="collapse-content px-0">
          <ul className="menu menu-sm">
            <li>
              <button
                className={!selectedCategory ? "active" : ""}
                onClick={() => {
                  setSelectedCategory("");
                  applyFilters();
                }}
              >
                All Products
              </button>
            </li>
            {categories.map((category) => (
              <li>
                <button
                  className={selectedCategory === category.name ? "active" : ""}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    applyFilters();
                  }}
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="collapse collapse-arrow mb-4">
        <input type="checkbox" defaultChecked />
        <div className="collapse-title px-0 font-medium">Price Range</div>
        <div className="collapse-content px-0">
          <div className="form-control">
            <div className="flex flex-col gap-2 mb-2">
              <input
                type="number"
                placeholder="Min price"
                className="input input-bordered input-sm w-full"
                min="0"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, min: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Max price"
                className="input input-bordered input-sm w-full"
                min="0"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, max: e.target.value })
                }
              />
            </div>
            <button
              className="btn btn-sm btn-outline w-full"
              onClick={applyFilters}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductsHeader = ({ sortBy, setSortBy, sortOptions, setFilter }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>All Products</li>
        </ul>
      </div>
      <select
        className="select select-bordered select-sm w-auto min-w-[160px]"
        value={sortBy}
        onChange={(e) => {
          setSortBy(e.target.value);
          setFilter("sort", sortOptions[e.target.value]);
        }}
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="lowPrice">Price: Low to High</option>
        <option value="highPrice">Price: High to Low</option>
        <option value="popular">Most Popular</option>
      </select>
    </div>
  );
};

const Products = () => {
  // State for filters and search
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("newest");

  // Get URL params before calling hooks
  const { categoryId } = useParams();
  const initialCategory = categoryId;

  // Set initial state from URL params
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Map sort options to API sort parameters
  const sortOptions = {
    newest: "-createdAt",
    oldest: "createdAt",
    highPrice: "-price",
    lowPrice: "price",
  };

  // Get products using hook with initial category from URL
  const {
    products,
    pagination,
    isLoading,
    isError,
    error,
    setFilter,
    updateFilters,
    goToPage,
  } = useProducts({
    // Initial filters
    limit: 9,
    page: 1,
    sort: sortOptions[sortBy],
    category: initialCategory || undefined,
    "price[gte]": priceRange.min || undefined,
    "price[lte]": priceRange.max || undefined,
  });

  // Handler for applying all filters
  const applyFilters = () => {
    updateFilters({
      category: selectedCategory || undefined,
      "price[gte]": priceRange.min || undefined,
      "price[lte]": priceRange.max || undefined,
      page: 1,
    });
  };

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-[1fr_4fr] gap-2">
      {/* Sidebar */}
      <ProductsSidebar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        applyFilters={applyFilters}
      />

      {/* Main Content */}
      <div className="flex flex-col gap-6 px-4 py-6">
        <ProductsHeader
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOptions={sortOptions}
          setFilter={setFilter}
        />

        {/* Product Grid */}
        {isLoading ? (
          <div className="w-full flex justify-center items-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : isError ? (
          <div className="w-full py-8">
            <div className="alert alert-error">
              <span>
                Error loading products:{" "}
                {error?.data?.message || "Unknown error"}
              </span>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="w-full py-8">
            <div className="alert alert-info">
              <span>No products found matching your criteria</span>
            </div>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div className="flex-shrink-0" key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="join">
              <button
                className="join-item btn btn-sm"
                onClick={() => goToPage(pagination.page - 1)}
                disabled={pagination.page <= 1}
              >
                <ChevronLeft size={16} />
              </button>

              {/* Page buttons */}
              {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === pagination.pages ||
                    (page >= pagination.page - 1 && page <= pagination.page + 1)
                )
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <button className="join-item btn btn-sm btn-disabled">
                        ...
                      </button>
                    )}
                    <button
                      className={`join-item btn btn-sm ${
                        pagination.page === page ? "btn-active" : ""
                      }`}
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}

              <button
                className="join-item btn btn-sm"
                onClick={() => goToPage(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;

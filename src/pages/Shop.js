import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/Shop.css';

const Search = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [price, setPrice] = useState(250);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedSubCategories, setSelectedSubCategories] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedRating, setSelectedRating] = useState(0);
    const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const [selectedSubSubCategories, setSelectedSubSubCategories] = useState([]);
    const [categoriesWithSubs, setCategoriesWithSubs] = useState({});

    useEffect(() => {
        const normalizeCategory = (value) => {
            if (!value) return null;

            const val = value.trim().toLowerCase();

            if (["jewellery", "jewelry"].includes(val)) return "Jewelry";
            if (["accessories", "accessory"].includes(val)) return "Accessories";
            if (["homeware", "other"].includes(val)) return null;
            if (["clothing", "clothes"].includes(val)) return "Clothing";

            return val.charAt(0).toUpperCase() + val.slice(1); // Capitalize
        };

        const fetchProducts = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/products");
                setProducts(res.data);

                const catMap = {};

                res.data.forEach(product => {
                    const rawCategory = normalizeCategory(product.category);
                    const rawSubcategory = normalizeCategory(product.subcategory);

                    if (!rawCategory) return;

                    if (!catMap[rawCategory]) catMap[rawCategory] = new Set();

                    // Skip "Bags" if it's a subcategory of "Clothing"
                    if (rawCategory === "Clothing" && rawSubcategory === "Bags") return;

                    // Skip adding subcategory if it's same as category
                    if (rawSubcategory && rawSubcategory !== rawCategory) {
                        catMap[rawCategory].add(rawSubcategory);
                    }
                });

                const categoriesObj = {};
                Object.entries(catMap).forEach(([cat, subSet]) => {
                    categoriesObj[cat] = Array.from(subSet);
                });

                setCategoriesWithSubs(categoriesObj);
            } catch (error) {
                console.error("Failed to fetch products", error);
            }
        };

        fetchProducts();
    }, []);



    const allBrands = [...new Set(products.map(p => p.brand).filter(Boolean))];

    const filteredProducts = products.filter((product) => {
        const title = (product.title || '').toLowerCase();
        const brand = (product.brand || '').toLowerCase();
        const query = (searchQuery || '').toLowerCase();

        const matchesSearch = title.includes(query) || brand.includes(query);
        const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(brand);
        const matchesPrice = Number(product.price) <= Number(price);
        const matchesRating = Number(product.rating || 0) >= Number(selectedRating);

        const productCategory = (product.category || '').toLowerCase().trim();
        const productSubCategory = (product.subcategory || '').toLowerCase().trim();

        const matchesCategory = selectedCategories.length === 0 || selectedCategories.map(c => c.toLowerCase().trim()).includes(productCategory);
        const matchesSubCategory = selectedSubCategories.length === 0 || selectedSubCategories.map(s => s.toLowerCase().trim()).includes(productSubCategory);

        // Apply subcategory filter if it exists on product and user selected subcategories
        const categoryMatch =
            productSubCategory && selectedSubCategories.length > 0
                ? matchesSubCategory
                : matchesCategory;

        return matchesSearch && categoryMatch && matchesBrand && matchesPrice && matchesRating;
    });


    const toggleSelection = (value, setter, current) => {
        setter(current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value]);
    };

    return (
        <div>
            <header className="main-navbar">
                <div className="nav-container">
                    <div className="logo">JOCAL</div>
                    <nav className="nav-links">
                        <a href="/">Home</a>
                        <a href="#">Deals</a>
                        <a href="/contact.html">Contact</a>
                    </nav>
                    <div className="nav-icons">
                        <i className="fa-regular fa-user"></i>
                        <i className="fa-regular fa-heart"></i>
                        <i className="fa-solid fa-cart-shopping"></i>
                    </div>
                </div>
            </header>

            <section className="search-hero">
                <div className="search-hero-content">
                    <h1>Give All You Need</h1>
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search by title or brand..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button>Search</button>
                    </div>
                </div>
            </section>

            <div className="product-wrapper">
                <section className="search-results">
                    <aside className="sidebar">
                        <h3>Filter</h3>

                        {/* Category */}
                        <div className="filter-group">
                            <h4 onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)} style={{ cursor: 'pointer' }}>
                                {categoryDropdownOpen ? "▼" : "▶"} Category
                            </h4>

                            {categoryDropdownOpen && (
                                <div className="subcategory-list" style={{ paddingLeft: '1rem' }}>
                                    {Object.keys(categoriesWithSubs).map((category) => (
                                        <div key={category}>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.includes(category)}
                                                    onChange={() =>
                                                        toggleSelection(category, setSelectedCategories, selectedCategories)
                                                    }
                                                />
                                                {category}
                                            </label>

                                            {/* Show subcategories only if category is selected */}
                                            {selectedCategories.includes(category) && categoriesWithSubs[category].length > 0 && (
                                                <div className="subcategory-list" style={{ paddingLeft: '1rem' }}>
                                                    {categoriesWithSubs[category].map((sub) => (
                                                        <div key={sub} style={{ paddingLeft: '1rem' }}>
                                                            <label>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedSubCategories.includes(sub)}
                                                                    onChange={() =>
                                                                        toggleSelection(sub, setSelectedSubCategories, selectedSubCategories)
                                                                    }
                                                                />
                                                                {sub}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Brand Dropdown */}
                        <div className="filter-group">
                            <h4 onClick={() => setBrandDropdownOpen(!brandDropdownOpen)} style={{ cursor: 'pointer' }}>
                                {brandDropdownOpen ? "▼" : "▶"} Brand
                            </h4>
                            {brandDropdownOpen && (
                                <div className="subcategory-list" style={{ paddingLeft: '1rem' }}>
                                    {allBrands.map((brand) => (
                                        <div key={brand}>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedBrands.includes(brand)}
                                                    onChange={() => toggleSelection(brand, setSelectedBrands, selectedBrands)}
                                                />
                                                {brand}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Price */}
                        <div className="filter-group">
                            <h4>Price</h4>
                            <input
                                type="range"
                                min="0"
                                max="500"
                                step="10"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                            />
                            <p>Up to: <strong>{price} JOD</strong></p>
                        </div>

                        {/* Rating */}
                        <div className="filter-group">
                            <h4>Review</h4>
                            <div className="star-filter" id="starFilter">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                    <span
                                        key={rating}
                                        data-value={rating}
                                        className={selectedRating >= rating ? "selected" : ""}
                                        onClick={() => setSelectedRating(rating)}
                                        style={{ cursor: "pointer", color: selectedRating >= rating ? "#f5b50a" : "#ccc" }}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                        </div>
                    </aside>

                    <div className="product-grid">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <a key={product._id} href={`/item/${product._id}`} className="product-card-link">
                                    <div className="product-card">
                                        <img src={product.image} alt={product.title} />
                                        <h4>{product.title}</h4>
                                        <h6>{product.brand}</h6>
                                        <p><strong>{product.price} JOD</strong></p>
                                        <div className="product-actions">
                                            <span className="buy-now">View</span>
                                            <button className="wishlist-btn">
                                                <i className="fa-regular fa-heart"></i>
                                            </button>
                                        </div>
                                    </div>
                                </a>
                            ))
                        ) : (
                            <p>No products found</p>
                        )}
                    </div>
                </section>
            </div>
        </div >
    );
};

export default Search;
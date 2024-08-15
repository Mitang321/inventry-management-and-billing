import React, { useState } from "react";
import "./App.css";
import { inventoryItems as initialItems } from "./data";

const InventoryList = () => {
  const [items, setItems] = useState(initialItems);
  const [editItemId, setEditItemId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editQuantity, setEditQuantity] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minQuantity, setMinQuantity] = useState("");
  const [maxQuantity, setMaxQuantity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedItems, setSelectedItems] = useState([]);

  const categories = ["Fruits", "Vegetables"];

  const addItem = (name, quantity, price, category) => {
    const newItem = {
      id: items.length + 1,
      name,
      quantity: parseInt(quantity),
      price: parseFloat(price),
      category,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleEditClick = (item) => {
    setEditItemId(item.id);
    setEditName(item.name);
    setEditQuantity(item.quantity);
    setEditPrice(item.price);
    setEditCategory(item.category);
  };

  const handleSaveClick = () => {
    setItems(
      items.map((item) =>
        item.id === editItemId
          ? {
              ...item,
              name: editName,
              quantity: parseInt(editQuantity),
              price: parseFloat(editPrice),
              category: editCategory,
            }
          : item
      )
    );
    setEditItemId(null);
    setEditName("");
    setEditQuantity("");
    setEditPrice("");
    setEditCategory("");
  };

  const handleSort = (field) => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newOrder);
  };

  const sortedItems = items.sort((a, b) => {
    if (sortField) {
      const valueA = a[sortField];
      const valueB = b[sortField];
      if (sortOrder === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    }
    return items;
  });

  const filteredItems = sortedItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPrice =
      (!minPrice || item.price >= parseFloat(minPrice)) &&
      (!maxPrice || item.price <= parseFloat(maxPrice));
    const matchesQuantity =
      (!minQuantity || item.quantity >= parseInt(minQuantity)) &&
      (!maxQuantity || item.quantity <= parseInt(maxQuantity));
    const matchesCategory =
      !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesPrice && matchesQuantity && matchesCategory;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredItems.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === currentItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(currentItems.map((item) => item.id));
    }
  };

  const handleBulkDelete = () => {
    setItems(items.filter((item) => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  };

  const handleBulkCategoryChange = (newCategory) => {
    setItems(
      items.map((item) =>
        selectedItems.includes(item.id)
          ? { ...item, category: newCategory }
          : item
      )
    );
    setSelectedItems([]);
  };

  const calculateTotalValue = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateAveragePrice = () => {
    if (items.length === 0) return 0;
    return calculateTotalValue() / items.length;
  };

  return (
    <div className="App">
      <h1>Inventory List</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="number"
          placeholder="Min Price (₹)"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price (₹)"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Min Quantity"
          value={minQuantity}
          onChange={(e) => setMinQuantity(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Quantity"
          value={maxQuantity}
          onChange={(e) => setMaxQuantity(e.target.value)}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedItems.length === currentItems.length}
                onChange={handleSelectAll}
              />
            </th>
            <th onClick={() => handleSort("name")}>Name</th>
            <th onClick={() => handleSort("quantity")}>Quantity</th>
            <th onClick={() => handleSort("price")}>Price (₹)</th>
            <th onClick={() => handleSort("category")}>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleSelectItem(item.id)}
                />
              </td>
              <td>
                {editItemId === item.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                ) : (
                  item.name
                )}
              </td>
              <td>
                {editItemId === item.id ? (
                  <input
                    type="number"
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(e.target.value)}
                  />
                ) : (
                  item.quantity
                )}
              </td>
              <td>
                {editItemId === item.id ? (
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                  />
                ) : (
                  `₹${item.price}`
                )}
              </td>
              <td>
                {editItemId === item.id ? (
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                ) : (
                  item.category
                )}
              </td>
              <td>
                {editItemId === item.id ? (
                  <>
                    <button onClick={handleSaveClick}>Save</button>
                    <button onClick={() => setEditItemId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditClick(item)}>Edit</button>
                    <button onClick={() => removeItem(item.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={currentPage === number ? "active" : ""}
          >
            {number}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addItem(editName, editQuantity, editPrice, editCategory);
        }}
      >
        <h2>Add New Item</h2>
        <input
          type="text"
          placeholder="Item Name"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={editQuantity}
          onChange={(e) => setEditQuantity(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price (₹)"
          value={editPrice}
          onChange={(e) => setEditPrice(e.target.value)}
          required
        />
        <select
          value={editCategory}
          onChange={(e) => setEditCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <button type="submit">Add Item</button>
      </form>

      <div className="bulk-actions">
        <button onClick={handleBulkDelete}>Delete Selected</button>
        <select
          onChange={(e) => handleBulkCategoryChange(e.target.value)}
          value=""
        >
          <option value="">Change Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="totals">
        <h2>Total Inventory Value: ₹{calculateTotalValue().toFixed(2)}</h2>
        <h2>Average Item Price: ₹{calculateAveragePrice().toFixed(2)}</h2>
      </div>
    </div>
  );
};

export default InventoryList;

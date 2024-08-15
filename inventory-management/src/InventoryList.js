// src/InventoryList.js
import React, { useState } from "react";
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
  const [categories, setCategories] = useState(["Fruits", "Vegitables"]);
  const [selectedCategory, setSelectedCategory] = useState("");

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

  const filteredItems = items.filter((item) => {
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

  return (
    <div>
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
            <th>Name</th>
            <th>Quantity</th>
            <th>Price (₹)</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item.id}>
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
                  <input
                    type="text"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                  />
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
                    <button onClick={() => removeItem(item.id)}>Remove</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AddItemForm addItem={addItem} categories={categories} />
    </div>
  );
};

const AddItemForm = ({ addItem, categories }) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(categories[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && quantity && price && category) {
      addItem(name, quantity, price, category);
      setName("");
      setQuantity("");
      setPrice("");
      setCategory(categories[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Item</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <input
        type="number"
        placeholder="Price (₹)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <button type="submit">Add Item</button>
    </form>
  );
};

export default InventoryList;

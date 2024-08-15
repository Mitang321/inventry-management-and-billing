// src/InventoryList.js
import React, { useState } from "react";
import { inventoryItems as initialItems } from "./data";

const InventoryList = () => {
  const [items, setItems] = useState(initialItems);

  const addItem = (name, quantity, price) => {
    const newItem = {
      id: items.length + 1,
      name,
      quantity: parseInt(quantity),
      price: parseFloat(price),
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div>
      <h1>Inventory List</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price (₹)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.price}</td>
              <td>
                <button onClick={() => removeItem(item.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AddItemForm addItem={addItem} />
    </div>
  );
};

const AddItemForm = ({ addItem }) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && quantity && price) {
      addItem(name, quantity, price);
      setName("");
      setQuantity("");
      setPrice("");
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
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button type="submit">Add Item</button>
    </form>
  );
};

export default InventoryList;

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
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
  const [billingItems, setBillingItems] = useState([]);
  const [billName, setBillName] = useState("");

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

  const generateBill = () => {
    if (!billName) return;
    const bill = {
      name: billName,
      items: selectedItems.map((id) => {
        const item = items.find((item) => item.id === id);
        return {
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
        };
      }),
      totalAmount: selectedItems.reduce((total, id) => {
        const item = items.find((item) => item.id === id);
        return total + item.price * item.quantity;
      }, 0),
    };
    setBillingItems([...billingItems, bill]);
    setSelectedItems([]);
    setBillName("");
  };

  const exportToCSV = () => {
    const header = "Name,Quantity,Price,Total\n";
    const rows = items
      .map(
        (item) =>
          `${item.name},${item.quantity},${item.price},${
            item.price * item.quantity
          }`
      )
      .join("\n");
    const csvContent = `data:text/csv;charset=utf-8,${header}${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inventory.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="App container">
      <h1 className="my-4">Inventory List</h1>

      <div className="filters mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="number"
          className="form-control mt-2"
          placeholder="Min Price (₹)"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          className="form-control mt-2"
          placeholder="Max Price (₹)"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <input
          type="number"
          className="form-control mt-2"
          placeholder="Min Quantity"
          value={minQuantity}
          onChange={(e) => setMinQuantity(e.target.value)}
        />
        <input
          type="number"
          className="form-control mt-2"
          placeholder="Max Quantity"
          value={maxQuantity}
          onChange={(e) => setMaxQuantity(e.target.value)}
        />
        <select
          className="form-control mt-2"
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

      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>
              <input type="checkbox" onChange={handleSelectAll} />
            </th>
            <th onClick={() => handleSort("name")}>Name</th>
            <th onClick={() => handleSort("quantity")}>Quantity</th>
            <th onClick={() => handleSort("price")}>Price (₹)</th>
            <th>Category</th>
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
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.price.toFixed(2)}</td>
              <td>{item.category}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEditClick(item)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => removeItem(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between mb-4">
        <button className="btn btn-primary" onClick={() => exportToCSV()}>
          Export to CSV
        </button>
        <div>
          {pageNumbers.map((number) => (
            <button
              key={number}
              className={`btn btn-outline-primary me-2 ${
                currentPage === number ? "active" : ""
              }`}
              onClick={() => setCurrentPage(number)}
            >
              {number}
            </button>
          ))}
        </div>
      </div>

      {editItemId ? (
        <form>
          <h2>Edit Item</h2>
          <input
            type="text"
            className="form-control mb-2"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Item Name"
          />
          <input
            type="number"
            className="form-control mb-2"
            value={editQuantity}
            onChange={(e) => setEditQuantity(e.target.value)}
            placeholder="Quantity"
          />
          <input
            type="number"
            className="form-control mb-2"
            value={editPrice}
            onChange={(e) => setEditPrice(e.target.value)}
            placeholder="Price (₹)"
          />
          <select
            className="form-select mb-2"
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
          <button
            type="button"
            className="btn btn-success"
            onClick={handleSaveClick}
          >
            Save
          </button>
        </form>
      ) : (
        <form>
          <h2>Add Item</h2>
          <input
            type="text"
            className="form-control mb-2"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Item Name"
          />
          <input
            type="number"
            className="form-control mb-2"
            value={editQuantity}
            onChange={(e) => setEditQuantity(e.target.value)}
            placeholder="Quantity"
          />
          <input
            type="number"
            className="form-control mb-2"
            value={editPrice}
            onChange={(e) => setEditPrice(e.target.value)}
            placeholder="Price (₹)"
          />
          <select
            className="form-select mb-2"
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
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              addItem(editName, editQuantity, editPrice, editCategory)
            }
          >
            Add Item
          </button>
        </form>
      )}

      <div className="billing-section mt-4">
        <h2>Create Bill</h2>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Bill Name"
          value={billName}
          onChange={(e) => setBillName(e.target.value)}
        />
        <button className="btn btn-success mb-2" onClick={generateBill}>
          Generate Bill
        </button>

        {billingItems.length > 0 && (
          <div>
            <h3>Generated Bills</h3>
            <ul className="list-group">
              {billingItems.map((bill, index) => (
                <li key={index} className="list-group-item">
                  <h4>{bill.name}</h4>
                  <ul className="list-group">
                    {bill.items.map((item, idx) => (
                      <li key={idx} className="list-group-item">
                        {item.name} - {item.quantity} x ₹{item.price} = ₹
                        {item.total}
                      </li>
                    ))}
                  </ul>
                  <strong>Total Amount: ₹{bill.totalAmount.toFixed(2)}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-4">
        <h2>Summary</h2>
        <p>Total Inventory Value: ₹{calculateTotalValue().toFixed(2)}</p>
        <p>Average Price per Item: ₹{calculateAveragePrice().toFixed(2)}</p>
      </div>
    </div>
  );
};

export default InventoryList;

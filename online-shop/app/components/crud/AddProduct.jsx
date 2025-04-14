'use client'
import React, { useEffect, useState } from "react";
import { TextField, Button, Container, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useAuth } from "../../../context/authContext";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const { fetchWithAuth } = useAuth();

  useEffect(() => {
    fetchWithAuth("http://localhost:8000/api/categories/all", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Error loading categories", err));

    fetchWithAuth("http://localhost:8000/api/brands/all", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(res => res.json())
      .then(data => setBrands(data))
      .catch(err => console.error("Error loading brands", err));
  }, [fetchWithAuth]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const newProduct = {
      title: name,
      description: desc,
      category: categoryId,
      brand: brandId,
    };

    fetchWithAuth("http://localhost:8000/api/products/new", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    })
    .then((response) => {
      if (response.ok) {
        alert("Товар добавлен");
        setName("");
        setDesc("");
        setCategoryId("");
        setBrandId("");
      } else {
        console.error("Error, product not added");
      }
    })
    .catch((error) => console.error("Error, product not added", error));
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Добавить новый товар</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Название"
          fullWidth
          sx={{ mb: 2 }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          label="Описание"
          fullWidth
          sx={{ mb: 2 }}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="category-label">Категория</InputLabel>
          <Select
            labelId="category-label"
            value={categoryId}
            label="Категория"
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.title}>
                {cat.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="brand-label">Бренд</InputLabel>
          <Select
            labelId="brand-label"
            value={brandId}
            label="Бренд"
            onChange={(e) => setBrandId(e.target.value)}
          >
            {brands.map((brand) => (
              <MenuItem key={brand.id} value={brand.title}>
                {brand.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button type="submit" variant="contained">Добавить товар</Button>
      </form>
    </Container>
  );
};

export default AddProduct;

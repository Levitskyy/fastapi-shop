'use client'
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { TextField, Button, Container, Typography, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { useAuth } from "../../../context/authContext";

const UpdateProduct = () => {
  const { productId } = useParams();
  const router = useRouter();
  const { fetchWithAuth } = useAuth();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetchWithAuth(`http://localhost:8000/api/products/one/${productId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Ошибка при загрузке товара");
      }
    })
    .then(data => {
      setName(data.title);
      setDesc(data.description);
      setCategoryId(data.category.id);
      setBrandId(data.brand.id);
    })
    .catch(error => console.error("Error loading product:", error));

    fetchWithAuth("http://localhost:8000/api/categories/all", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Ошибка при загрузке категорий");
      }
    })
    .then(data => setCategories(data))
    .catch(error => console.error("Error loading categories:", error));

    fetchWithAuth("http://localhost:8000/api/brands/all", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Ошибка при загрузке брендов");
      }
    })
    .then(data => setBrands(data))
    .catch(error => console.error("Error loading brands:", error));
  }, [productId, fetchWithAuth]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (parseFloat(price.replace(",", ".")) < 0) {
      alert("Price can not be negative");
      return;
    }

    const updatedProduct = {
      title: name,
      description: desc,
      category_id: parseInt(categoryId),
      brand_id: parseInt(brandId),
    };

    fetchWithAuth(`http://localhost:8000/api/products/${productId}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    })
    .then(response => {
      if (response.ok) {
        alert("Товар обновлен");
        router.push("/manage/products/");
      } else {
        throw new Error("Ошибка при обновлении товара");
      }
    })
    .catch(error => console.error("Error updating product:", error));
  };

  return (
    <Container>
      <Typography variant="h6" sx={{ mb: 2 }}>Обновление товара</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Название"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          label="Описание"
          variant="outlined"
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
              <MenuItem key={cat.id} value={cat.id}>
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
              <MenuItem key={brand.id} value={brand.id}>
                {brand.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" variant="contained">Обновить товар</Button>
      </form>
    </Container>
  );
};

export default UpdateProduct;

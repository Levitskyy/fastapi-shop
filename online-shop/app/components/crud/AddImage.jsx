'use client'
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, Typography, Button, Paper, Alert, Input } from "@mui/material";
import { useAuth } from "../../../context/authContext";

const AddImage = () => {
  const { productId } = useParams();
  const [file, setFile] = useState(null);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();
  const { fetchWithAuth } = useAuth();

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
        throw new Error("Не удалось загрузить информацию о товаре");
      }
    })
    .then(data => setProduct(data))
    .catch(err => {
      console.error(err);
      setError("Не удалось загрузить информацию о товаре");
    });
  }, [productId, fetchWithAuth]);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Выберите файл перед загрузкой");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("product_id", productId);

    try {
      const response = await fetchWithAuth("http://localhost:8000/api/images/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        router.push("/manage/products/");
      } else {
        throw new Error("Произошла ошибка при загрузке изображения");
      }
    } catch (err) {
      console.error(err);
      setError("Произошла ошибка при загрузке изображения");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Загрузка изображения
      </Typography>

      {product && (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6">{product.name}</Typography>
          <Typography variant="body1" sx={{ my: 1 }}>
            {product.description}
          </Typography>
        </Paper>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Input
          type="file"
          onChange={handleChange}
          inputProps={{ accept: "image/*" }}
          sx={{ mb: 2 }}
        />
        <br />
        <Button variant="contained" color="primary" type="submit">
          Загрузить
        </Button>
      </form>
    </Box>
  );
};

export default AddImage;

'use client'
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container, Typography, Button, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions
} from "@mui/material";
import { useAuth } from "../../../context/authContext";

const DeleteProduct = () => {
  const { productId } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [open, setOpen] = useState(false);
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
        throw new Error("Ошибка при загрузке товара");
      }
    })
    .then(data => setProduct(data))
    .catch(error => {
      console.error("Error loading product:", error);
      router.push("/manage/products/");
    });
  }, [productId, router, fetchWithAuth]);

  const handleDelete = () => {
    fetchWithAuth(`http://localhost:8000/api/products/${productId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(response => {
      if (response.ok) {
        alert("Товар удалён");
        router.push("/manage/products/");
      } else {
        throw new Error("Ошибка при удалении товара");
      }
    })
    .catch(error => {
      console.error("Error deleting product:", error);
      alert("Ошибка при удалении товара");
    });
  };

  if (!product) return null;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Удаление товара
      </Typography>
      <Typography>Вы действительно хотите удалить товар <strong>{product.title}</strong>?</Typography>

      <Button
        variant="contained"
        color="error"
        sx={{ mt: 2, mr: 2 }}
        onClick={() => setOpen(true)}
      >
        Удалить
      </Button>
      <Button
        variant="outlined"
        sx={{ mt: 2 }}
        onClick={() => router.push("/manage/products/")}
      >
        Отмена
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Это действие необратимо. Удалить товар <strong>{product.title}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Отмена</Button>
          <Button onClick={handleDelete} color="error">Удалить</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DeleteProduct;

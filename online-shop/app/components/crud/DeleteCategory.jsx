'use client'
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container, Typography, Button, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions
} from "@mui/material";
import { useAuth } from "../../../context/authContext";

const DeleteCategory = () => {
  const { categoryName } = useParams();
  const router = useRouter();
  const [category, setCategory] = useState(null);
  const [open, setOpen] = useState(false);
  const { fetchWithAuth } = useAuth();

  useEffect(() => {
    setCategory(categoryName);
  }, [categoryName]);

  const handleDelete = () => {
    fetchWithAuth(`http://localhost:8000/categories/${categoryName}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(response => {
      if (response.ok) {
        alert("Категория удалена");
        router.push("/categories/");
      } else {
        throw new Error("Ошибка при удалении категории");
      }
    })
    .catch(error => {
      console.error("Error deleting category:", error);
      alert("Ошибка при удалении категории");
    });
  };

  if (!category) return null;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Удаление категории
      </Typography>
      <Typography>Вы действительно хотите удалить категорию <strong>{category}</strong>?</Typography>

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
        onClick={() => router.push("/manage/categories/")}
      >
        Отмена
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Это действие необратимо. Удалить категорию <strong>{category}</strong>?
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

export default DeleteCategory;

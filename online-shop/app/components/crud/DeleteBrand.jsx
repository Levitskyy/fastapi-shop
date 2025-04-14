'use client'
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container, Typography, Button, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions
} from "@mui/material";
import { useAuth } from "../../../context/authContext";

const DeleteBrand = () => {
  const { brandName } = useParams();
  const router = useRouter()
  const [brand, setBrand] = useState(null);
  const [open, setOpen] = useState(false);
  const { fetchWithAuth } = useAuth();

  useEffect(() => {
    setBrand(brandName)
  }, [brandName]);

  const handleDelete = () => {
    fetchWithAuth(`http://localhost:8000/api/brands/${brandName}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(response => {
      if (response.ok) {
        alert("Бренд удалён");
        router.push("/manage/brands/");
      } else {
        throw new Error("Ошибка при удалении бренда");
      }
    })
    .catch(error => {
      console.error("Error deleting brand:", error);
      alert("Ошибка при удалении бренда");
    });
  };

  if (!brand) return null;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Удаление бренда
      </Typography>
      <Typography>Вы действительно хотите удалить бренд <strong>{brand}</strong>?</Typography>

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
        onClick={() => router.push("/manage/brands/")}
      >
        Отмена
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Это действие необратимо. Удалить бренд <strong>{brand}</strong>?
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

export default DeleteBrand;

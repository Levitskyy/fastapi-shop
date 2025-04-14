'use client'
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container, Typography, Button, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions
} from "@mui/material";
import { useAuth } from "../../../context/authContext";

const DeletePurchase = () => {
  const { purchaseId } = useParams();
  const router = useRouter();
  const [purchase, setPurchase] = useState(null);
  const [open, setOpen] = useState(false);
  const { fetchWithAuth } = useAuth();

  useEffect(() => {
    fetchWithAuth(`http://localhost:8000/api/purchases/one/${purchaseId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(response => response.json())
    .then(data => {
      setPurchase(data);
    })
    .catch(error => {
      console.error("Error loading purchase", error);
      router.push("/");
    });
  }, [purchaseId, router, fetchWithAuth]);

  const handleDelete = () => {
    fetchWithAuth(`http://localhost:8000/api/purchases/${purchaseId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(response => {
      if (response.ok) {
        alert("Запись о покупке удалена");
        router.push("/");
      } else {
        throw new Error("Ошибка при удалении записи о покупке");
      }
    })
    .catch(error => {
      console.error("Error deleting purchase:", error);
      alert("Ошибка при удалении записи о покупке");
    });
  };

  if (!purchase) return null;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Удаление записи о покупке
      </Typography>
      <Typography>Вы действительно хотите удалить запись о покупке
        <strong> номер "{purchase.id}"
        (Товар: {purchase.product.name},
        Купил {purchase.user.username}
        )
        </strong>?</Typography>

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
        onClick={() => router.push("/")}
      >
        Отмена
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Это действие необратимо. Удалить запись о покупке <strong>{purchase.id} (
              Товар: {purchase.product.name},
              приобретший пользователь {purchase.user.username}
              )</strong>?
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

export default DeletePurchase;

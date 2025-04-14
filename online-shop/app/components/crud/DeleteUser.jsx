'use client'
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container, Typography, Button, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions
} from "@mui/material";
import { useAuth } from "../../../context/authContext";

const DeleteUser = () => {
  const router = useRouter();
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const { fetchWithAuth } = useAuth();

  useEffect(() => {
    if (username) {
      fetchWithAuth(`http://localhost:8000/api/auth/users/one/${username}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error loading user");
        }
      })
      .then((data) => setUser(data))
      .catch((error) => {
        console.error("Error loading user", error);
        router.push("/manage/users/");
      });
    }
  }, [username, fetchWithAuth, router]);

  const handleDelete = () => {
    fetchWithAuth(`http://localhost:8000/api/auth/users/one/${user.id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      if (response.ok) {
        alert("Пользователь удалён");
        router.push("/manage/users/");
      } else {
        throw new Error("Error deleting user");
      }
    })
    .catch((error) => {
      console.error("Error deleting user", error);
      alert("Ошибка при удалении пользователя");
    });
  };

  if (!user) return null;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Удаление пользователя
      </Typography>
      <Typography>Вы действительно хотите удалить пользователя <strong>{user.username}</strong>?</Typography>

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
        onClick={() => router.push("/manage/users")}
      >
        Отмена
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Это действие необратимо. Удалить пользователя <strong>{user.username}</strong>?
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

export default DeleteUser;

'use client'
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { TextField, Button, Container, Typography, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { useAuth } from "../../../context/authContext";

const UpdateUser = () => {
  const router = useRouter();
  const { username } = useParams();
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
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
      .then((data) => setRole(data.role))
      .catch((error) => console.error("Error loading user", error));
    }
  }, [username, fetchWithAuth]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const updatedUser = {
      username: username,
      role,
    };

    if (password) {
      updatedUser.password = password;
    }

    fetchWithAuth(`http://localhost:8000/api/auth/users/one/${username}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    })
    .then((response) => {
      if (response.ok) {
        alert("Данные пользователя обновлены");
        router.push("/manage/users/");
      } else {
        throw new Error("Error updating user");
      }
    })
    .catch((error) => console.error("Error, user not updated", error));
  };

  return (
    <Container>
      <Typography variant="h6" sx={{ mb: 2 }}>Обновление данных пользователя</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Имя пользователя"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={username}
          InputProps={{
            readOnly: true,
          }}
        />

        <TextField
          label="Пароль"
          variant="outlined"
          type="password"
          fullWidth
          sx={{ mb: 2 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Роль</InputLabel>
          <Select
            value={role}
            label="Роль"
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value="admin">Администратор</MenuItem>
            <MenuItem value="manager">Менеджер</MenuItem>
            <MenuItem value="user">Пользователь</MenuItem>
          </Select>
        </FormControl>

        <Button type="submit" variant="contained">Обновить данные пользователя</Button>
      </form>
    </Container>
  );
};

export default UpdateUser;

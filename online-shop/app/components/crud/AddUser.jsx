'use client'
import React, { useState } from "react";
import { TextField, Button, Container, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useAuth } from "../../../context/authContext";

const AddUser = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { fetchWithAuth } = useAuth();

  const handleSubmit = (event) => {
    event.preventDefault();

    const newUser = {
      username,
      password,
      role,
    };

    fetchWithAuth("http://localhost:8000/api/auth/register", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
    .then((response) => {
      if (response.ok) {
        alert("Пользователь добавлен!");
        setUsername("");
        setPassword("");
      } else {
        console.error("Error, user not added");
      }
    })
    .catch((error) => console.error("Error, user not added", error));
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Добавить нового пользователя</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Имя пользователя"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
        <Button type="submit" variant="contained">Добавить пользователя</Button>
      </form>
    </Container>
  );
};

export default AddUser;

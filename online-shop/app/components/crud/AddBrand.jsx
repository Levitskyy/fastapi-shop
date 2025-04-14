'use client'
import React, { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import { useAuth } from "../../../context/authContext";

const AddBrand = () => {
  const [title, setTitle] = useState("");
  const { fetchWithAuth } = useAuth();

  const handleSubmit = (event) => {
    event.preventDefault();

    const newBrand = {
      title,
    };

    fetchWithAuth("http://localhost:8000/api/brands/new", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBrand), 
    }).then((response) => {
        alert("Бренд добавлен");
        setTitle("");
      }).catch((error) => console.error("Error:", error));
  };

  return (
    <Container>
      <Typography variant="h6" sx={{ mb: 2 }}>Добавить новый бренд</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Название бренда"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Button type="submit" variant="contained">Добавить бренд</Button>
      </form>
    </Container>
  );
};

export default AddBrand;

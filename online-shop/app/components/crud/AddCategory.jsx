'use client'
import React, { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import { useAuth } from "../../../context/authContext";

const AddCategory = () => {
  const [title, setTitle] = useState("");
  const { fetchWithAuth } = useAuth();

  const handleSubmit = (event) => {
    event.preventDefault();

    const newCategory = {
      title,
    };

    fetchWithAuth("http://localhost:8000/api/categories/new", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCategory), 
    }).then((response) => {
        alert("Категория добавлена");
        setTitle("");
      }).catch((error) => console.error("Error:", error));
  };

  return (
    <Container>
      <Typography variant="h6" sx={{ mb: 2 }}>Добавить новую категорию</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Название категории"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Button type="submit" variant="contained">Добавить категорию</Button>
      </form>
    </Container>
  );
};

export default AddCategory;

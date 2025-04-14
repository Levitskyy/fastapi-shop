'use client'
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { TextField, Button, Container, Typography } from "@mui/material";
import { useAuth } from "../../../context/authContext";

const UpdateCategory = () => {
  const { categoryName } = useParams();
  const router = useRouter();
  const [name, setName] = useState("");
  const { fetchWithAuth } = useAuth();

  useEffect(() => {
    setName(categoryName);
  }, [categoryName]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const updatedCategory = {
      title: name,
    };

    fetchWithAuth(`http://localhost:8000/api/categories/${categoryName}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCategory),
    })
    .then((response) => {
      if (response.ok) {
        alert("Категория обновлена");
        router.push("/manage/categories/");
      } else {
        throw new Error("Ошибка при обновлении категории");
      }
    })
    .catch((error) => console.error("Error updating category", error));
  };

  return (
    <Container>
      <Typography variant="h6" sx={{ mb: 2 }}>Обновление категории</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Название категории"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button type="submit" variant="contained">Обновить категорию</Button>
      </form>
    </Container>
  );
};

export default UpdateCategory;

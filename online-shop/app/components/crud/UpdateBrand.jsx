'use client'
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { TextField, Button, Container, Typography } from "@mui/material";
import { useAuth } from "../../../context/authContext";

const UpdateBrand = () => {
  const { brandName } = useParams();
  const router = useRouter();
  const [name, setName] = useState("");
  const { fetchWithAuth } = useAuth();

  useEffect(() => {
    setName(brandName);
  }, [brandName]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const updatedBrand = {
      title: name,
    };

    fetchWithAuth(`http://localhost:8000/api/brands/${brandName}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedBrand),
    })
    .then((response) => {
      if (response.ok) {
        alert("Бренд обновлен");
        router.push("/manage/brands/");
      } else {
        throw new Error("Ошибка при обновлении бренда");
      }
    })
    .catch((error) => console.error("Error updating brand", error));
  };

  return (
    <Container>
      <Typography variant="h6" sx={{ mb: 2 }}>Обновление бренда</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Название бренда"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button type="submit" variant="contained">Обновить бренд</Button>
      </form>
    </Container>
  );
};

export default UpdateBrand;

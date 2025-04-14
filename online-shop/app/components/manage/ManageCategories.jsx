'use client'
import React, { useEffect, useState } from "react";
import { Button, TableContainer, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/authContext";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const { fetchWithAuth } = useAuth();

  useEffect(() => {
    fetchWithAuth("http://localhost:8000/api/categories/all", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error loading categories");
      }
    })
    .then(data => setCategories(data))
    .catch(error => console.error("Error loading categories:", error));
  }, []);

  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"}}>
        Управление категориями
        <Button variant="contained" onClick={() => router.push("/manage/categories/add")}>Добавить</Button>
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Название</TableCell>
            <TableCell>Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.id}</TableCell>
              <TableCell>{category.title}</TableCell>
              <TableCell>
                <Button onClick={() => router.push(`/manage/categories/update/${category.title}`)}>Обновить</Button>
                <Button color="error" onClick={() => router.push(`/manage/categories/delete/${category.title}`)}>Удалить</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ManageCategories;

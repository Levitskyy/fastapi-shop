import React, { useEffect, useState } from "react";
import { Button, TableContainer, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/authContext";

const ManageBrands = () => {
  const [brands, setBrands] = useState([]);
  const router = useRouter()
  const { fetchWithAuth } = useAuth();

  useEffect(() => {
    fetchWithAuth("http://localhost:8000/api/brands/all", {
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
        throw new Error("Error loading brands");
      }
    })
    .then(data => setBrands(data))
    .catch(error => console.error("Error loading brands:", error));
  }, []);

  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center"}}>
        Управление брендами
        <Button variant="contained" onClick={() => router.push("/manage/brands/add")}>Добавить</Button>
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
          {brands.map((brand) => (
            <TableRow key={brand.id}>
              <TableCell>{brand.id}</TableCell>
              <TableCell>{brand.title}</TableCell>
              <TableCell>
                <Button onClick={() => router.push(`/manage/brands/update/${brand.title}`)}>Обновить</Button>
                <Button color="error" onClick={() => router.push(`/manage/brands/delete/${brand.title}`)}>Удалить</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ManageBrands;
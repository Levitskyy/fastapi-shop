'use client'
import React, { useEffect, useState } from "react";
import { Button, TableContainer, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/authContext";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const router = useRouter();
  const { fetchWithAuth } = useAuth();

  useEffect(() => {
    fetchWithAuth("http://localhost:8000/api/products/all", {
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
        throw new Error("Error loading products");
      }
    })
    .then(data => setProducts(data))
    .catch(error => console.error("Error loading products:", error));
  }, []);

  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Управление товарами
        <Button variant="contained" onClick={() => router.push("/manage/products/add")}>Добавить</Button>
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Изображение</TableCell>
            <TableCell>Название</TableCell>
            <TableCell>Бренд</TableCell>
            <TableCell>Описание</TableCell>
            <TableCell>Категория</TableCell>
            <TableCell>Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                { product.images?.[0]?.path ?
                  (<img width="150px" height="150px" src={`http://localhost:8000/api${product.images[0].path}`} alt="Empty" />) :
                  (<Button 
                  onClick={() => router.push(`/manage/img/add/${product.id}`)}
                  style={{
                    width: "150px", height: "150px", border: "1px solid black",
                    fontWeight: "bold", fontSize: "100px", color: "grey",
                    }}>+</Button>)}
              </TableCell>
              <TableCell>{product.title}</TableCell>
              <TableCell>{product.brand.title}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>{product.category.title}</TableCell>
              <TableCell>
                <Button onClick={() => router.push(`/manage/products/update/${product.id}`)}>Обновить</Button>
                <Button color="error" onClick={() => router.push(`/manage/products/delete/${product.id}`)}>Удалить</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ManageProducts;

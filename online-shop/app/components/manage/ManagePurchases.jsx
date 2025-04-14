'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, TableContainer, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@mui/material";
import { useAuth } from "../../../context/authContext";

const ManagePurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const router = useRouter();
  const { fetchWithAuth } = useAuth();

  useEffect(() => {
    fetchWithAuth("http://localhost:8000/api/purchases/all", {
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
        throw new Error("Error loading purchases");
      }
    })
    .then((data) => setPurchases(data))
    .catch((error) => console.error("Error loading purchases", error));
  }, [fetchWithAuth]);

  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Купленный продукт</TableCell>
            <TableCell>Приобретший пользователь</TableCell>
            <TableCell>Количество товара</TableCell>
            <TableCell>Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {purchases.map((purchase) => (
            <TableRow key={purchase.id}>
              <TableCell>{purchase.id}</TableCell>
              <TableCell>{purchase.product.title}</TableCell>
              <TableCell>{purchase.user.username}</TableCell>
              <TableCell>
                <Button color="error" onClick={() => router.push(`/purchase/delete/${purchase.id}`)}>Удалить</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ManagePurchases;

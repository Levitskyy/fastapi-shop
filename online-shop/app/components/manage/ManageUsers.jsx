'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, TableContainer, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@mui/material";
import { useAuth } from "../../../context/authContext";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const router = useRouter();
  const { fetchWithAuth } = useAuth();

  useEffect(() => {
    fetchWithAuth("http://localhost:8000/api/auth/users/all", {
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
        throw new Error("Error loading users");
      }
    })
    .then((data) => setUsers(data))
    .catch((error) => console.error("Error loading users", error));
  }, [fetchWithAuth]);

  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Управление пользователями
        <Button variant="contained" onClick={() => router.push("/manage/users/add")}>Добавить</Button>
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Имя пользователя</TableCell>
            <TableCell>Роль пользователя</TableCell>
            <TableCell>Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Button onClick={() => router.push(`/manage/users/update/${user.username}`)}>Обновить</Button>
                <Button color="error" onClick={() => router.push(`/manage/users/delete/${user.username}`)}>Удалить</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ManageUsers;

import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography,
  TextField, TablePagination, Box, Button,
} from "@mui/material";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
        try {
          const response = await fetch(`http://localhost:8000/api/products/search?title=${search}&limit=${limit}&skip=${(page - 1) * limit}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setProducts(data);
        } catch (error) {
          console.log(error);
        }
      };
  
      fetchProducts();
  }, [page, limit, search]);

  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ p: 2 }}>Список товаров</Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Поиск по названию"
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Изображение</TableCell>
            <TableCell>Название</TableCell>
            <TableCell>Бренд</TableCell>
            <TableCell>Описание</TableCell>
            <TableCell>Категория</TableCell>
            <TableCell></TableCell> 
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.title}>
                <TableCell>
                    {product.images.length > 0 ? (
                        <img width="150px" height="150px" src={`http://localhost:8000/api${product.images[0].path}`} />
                    ) : (
                        <img width="150px" height="150px" src={`http://localhost:8000/api/static/images/std.png`} />
                    )}
                </TableCell>
                <TableCell>{product.title}</TableCell>
                <TableCell>{product.brand.title}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.category.title}</TableCell>
                <TableCell>  
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => alert(`Приобретение товара: ${product.title}`)}
                >
                    Приобрести
                </Button>
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={1000}
        page={page - 1}
        onPageChange={(e, newPage) => setPage(newPage + 1)}
        rowsPerPage={limit}
        onRowsPerPageChange={(e) => {
          setLimit(parseInt(e.target.value, 10));
          setPage(1);
        }}
        rowsPerPageOptions={[1, 5, 10, 20, 50]}
      />
    </TableContainer>
  );
};

export default ProductList; 
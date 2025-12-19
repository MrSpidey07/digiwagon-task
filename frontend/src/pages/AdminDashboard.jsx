import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Collapse,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { productsAPI } from "../services/api";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      setProducts(response.data.data.products);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await productsAPI.delete(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product");
    }
  };

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-64">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" className="mb-6 font-bold">
        Admin Dashboard
      </Typography>
      <Typography variant="body1" className="mb-6 text-gray-600">
        View and manage all submitted products
      </Typography>

      {error && (
        <Alert severity="error" className="mb-4" onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {products.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Typography variant="h6" color="textSecondary">
              No products found
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Products submitted by users will appear here
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow className="bg-gray-100">
                <TableCell width={50}></TableCell>
                <TableCell>
                  <strong>Product Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Description</strong>
                </TableCell>
                <TableCell>
                  <strong>Submitted By</strong>
                </TableCell>
                <TableCell>
                  <strong>Variants</strong>
                </TableCell>
                <TableCell>
                  <strong>Created At</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <>
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => toggleRow(product.id)}
                      >
                        {expandedRows[product.id] ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      {product.description
                        ? product.description.length > 50
                          ? `${product.description.substring(0, 50)}...`
                          : product.description
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={product.user?.email || "Unknown"}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${product.variants?.length || 0} variants`}
                        size="small"
                        color="secondary"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(product.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(product.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow key={`${product.id}-variants`}>
                    <TableCell colSpan={7} className="p-0">
                      <Collapse
                        in={expandedRows[product.id]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box className="p-4 bg-gray-50">
                          <Typography
                            variant="subtitle2"
                            className="mb-2 font-bold"
                          >
                            Variants:
                          </Typography>
                          {product.variants && product.variants.length > 0 ? (
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Variant Name</TableCell>
                                  <TableCell align="right">Amount</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {product.variants.map((variant) => (
                                  <TableRow key={variant.id}>
                                    <TableCell>{variant.name}</TableCell>
                                    <TableCell align="right">
                                      ₹{parseFloat(variant.amount).toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : (
                            <Typography variant="body2" color="textSecondary">
                              No variants
                            </Typography>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AdminDashboard;

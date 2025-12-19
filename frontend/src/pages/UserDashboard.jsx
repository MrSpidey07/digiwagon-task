import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  IconButton,
  Snackbar,
  Alert,
  InputAdornment,
  Link,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { productsAPI } from "../services/api";

const UserDashboard = () => {
  const [productName, setProductName] = useState("");
  const [variants, setVariants] = useState([{ name: "", amount: "0" }]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleAddVariant = () => {
    setVariants([...variants, { name: "", amount: "0" }]);
  };

  const handleRemoveVariant = (index) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
    setErrors({ ...errors, [`variant_${index}_${field}`]: "" });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!productName.trim()) {
      newErrors.productName = "Product name is required";
    }

    variants.forEach((variant, index) => {
      if (!variant.name.trim()) {
        newErrors[`variant_${index}_name`] = "Variant name is required";
      }
      if (
        !variant.amount ||
        isNaN(variant.amount) ||
        Number(variant.amount) <= 0
      ) {
        newErrors[`variant_${index}_amount`] = "Valid amount is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: "Please fix the validation errors",
        severity: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const productData = {
        name: productName,
        description: "",
        variants: variants.map((v) => ({
          name: v.name,
          amount: Number(v.amount),
        })),
      };

      await productsAPI.create(productData);

      setSnackbar({
        open: true,
        message: "Product submitted successfully!",
        severity: "success",
      });

      // Reset form
      setProductName("");
      setVariants([{ name: "", amount: "0" }]);
      setErrors({});
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to submit product",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box className="max-w-3xl mx-auto">
      <Card elevation={0} sx={{ border: "none", boxShadow: "none" }}>
        <CardContent className="p-6">
          <Typography variant="h6" className="mb-6 font-semibold text-gray-800">
            Product Information
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              placeholder="Product Name"
              value={productName}
              onChange={(e) => {
                setProductName(e.target.value);
                setErrors({ ...errors, productName: "" });
              }}
              error={!!errors.productName}
              helperText={errors.productName}
              variant="outlined"
              sx={{ mb: 3 }}
            />

            <Typography
              variant="body1"
              className="mb-3 font-medium text-gray-700"
            >
              Variants:
            </Typography>

            {variants.map((variant, index) => (
              <Box key={index} className="flex gap-4 items-center mb-4">
                <TextField
                  placeholder="Name"
                  value={variant.name}
                  onChange={(e) =>
                    handleVariantChange(index, "name", e.target.value)
                  }
                  error={!!errors[`variant_${index}_name`]}
                  variant="outlined"
                  sx={{ flex: 2 }}
                />
                <TextField
                  label="Amount"
                  type="number"
                  value={variant.amount}
                  onChange={(e) =>
                    handleVariantChange(index, "amount", e.target.value)
                  }
                  error={!!errors[`variant_${index}_amount`]}
                  sx={{ width: 180 }}
                  inputProps={{ min: 0, step: 0.01 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography variant="body2" color="textSecondary">
                          | INR
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                />
                <IconButton
                  onClick={() => handleRemoveVariant(index)}
                  disabled={variants.length === 1}
                  sx={{ color: "text.secondary" }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            ))}

            <Link
              component="button"
              type="button"
              variant="body2"
              onClick={handleAddVariant}
              sx={{
                textDecoration: "underline",
                cursor: "pointer",
                mb: 3,
                display: "block",
              }}
            >
              Add Variant
            </Link>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 2,
                px: 6,
                py: 1.5,
                textTransform: "none",
                backgroundColor: "#5c4bb3",
                "&:hover": {
                  backgroundColor: "#4a3d9e",
                },
              }}
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserDashboard;

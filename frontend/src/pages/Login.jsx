import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Tab,
  Tabs,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [tab, setTab] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let user;
      if (tab === 0) {
        // Login
        user = await login(formData.email, formData.password);
      } else {
        // Register
        user = await register({
          email: formData.email,
          password: formData.password,
          name: formData.name,
        });
      }
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <Typography variant="h4" className="text-center mb-6 font-bold">
            DigiWagon
          </Typography>

          <Tabs
            value={tab}
            onChange={(_, newValue) => setTab(newValue)}
            className="mb-6"
            centered
          >
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>

          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {tab === 1 && (
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
              />
            )}
            <TextField
              fullWidth
              required
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              required
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              helperText={tab === 1 ? "Minimum 6 characters" : ""}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              className="mt-4"
              disabled={loading}
            >
              {loading ? "Please wait..." : tab === 0 ? "Login" : "Register"}
            </Button>
          </form>

          <Typography
            variant="body2"
            className="text-center mt-4 text-gray-600"
          >
            {tab === 0 ? (
              <>Admin Login: admin@example.com / admin123</>
            ) : (
              <>Register as a new user to submit products</>
            )}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;

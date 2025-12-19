import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box className="min-h-screen">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" className="flex-grow">
            DigiWagon
          </Typography>
          <Box className="flex items-center gap-4">
            <Typography variant="body1">
              {user?.name || user?.email} ({user?.role})
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="main" className="p-6">
        {children}
      </Box>
    </Box>
  );
};

export default Layout;

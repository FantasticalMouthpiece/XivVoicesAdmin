import Head from "next/head";
import Layout from "../components/Layout/Layout";
import {
  Typography,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
} from "@mui/icons-material";
import { useState } from "react";
import useSessionRedirect from "@/hooks/useSessionRedirect";

export default function Settings() {
  const { loading } = useSessionRedirect();

  const [darkMode, setDarkMode] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [apiKey, setApiKey] = useState("••••••••••••••••");

  // TODO: Save this to user preferences
  // TODO: Add a light mode
  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // TODO: Save this to user preferences
  // TODO: Send an email to admins when new reports are generated
  const handleToggleEmailNotifications = () => {
    setEmailNotifications(!emailNotifications);
  };

  // TODO: Save this to user preferences
  const handleRegenerateApiKey = () => {
    // This would typically call an API to regenerate the key
    setApiKey("new-api-key-would-be-here");
  };

  if (loading) {
    return (
      <Layout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>Settings - XIV Voices Admin</title>
        <meta name="description" content="Settings for XIV Voices Admin" />
      </Head>

      <Layout title="Settings">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configure your XIV Voices Admin preferences
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Appearance" />
              <CardContent>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <PaletteIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Dark Mode"
                      secondary="Toggle dark/light theme"
                    />
                    <Switch
                      edge="end"
                      checked={darkMode}
                      onChange={handleToggleDarkMode}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Notifications" />
              <CardContent>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <NotificationsIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email Notifications"
                      secondary="Receive email alerts for new reports"
                    />
                    <Switch
                      edge="end"
                      checked={emailNotifications}
                      onChange={handleToggleEmailNotifications}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardHeader title="API Access" />
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    API Key
                  </Typography>
                  <TextField
                    fullWidth
                    value={apiKey}
                    disabled
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleRegenerateApiKey}
                          sx={{ ml: 1 }}
                        >
                          Regenerate
                        </Button>
                      ),
                    }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: "block" }}
                  >
                    This key provides access to the XIV Voices Admin API. Keep
                    it secure.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Layout>
    </>
  );
}

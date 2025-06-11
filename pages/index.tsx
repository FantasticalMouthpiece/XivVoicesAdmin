import { useSession, signIn } from "next-auth/react";
import Head from "next/head";
import Layout from "../components/Layout/Layout";
import {
  Typography,
  Box,
  Button,
  Paper,
  Avatar,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { Login as LoginIcon } from "@mui/icons-material";

export default function Home() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const user = session?.user;

  return (
    <>
      <Head>
        <title>XIV Voices Admin</title>
        <meta name="description" content="Admin panel for XIV Voices" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Welcome to{" "}
            <Box component="span" sx={{ color: "primary.main" }}>
              XIV Voices Admin
            </Box>
          </Typography>
        </Box>

        <Paper
          elevation={3}
          sx={{
            p: 3,
            maxWidth: 500,
            mx: "auto",
            backgroundColor: "background.paper",
          }}
        >
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <CircularProgress />
            </Box>
          )}

          {!loading && !user && (
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body1" gutterBottom>
                You are not signed in
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<LoginIcon />}
                onClick={() => signIn("discord")}
                sx={{ mt: 2 }}
              >
                Sign in with Discord
              </Button>
            </Box>
          )}

          {user && (
            <Box sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                {user.image && (
                  <Avatar
                    src={user.image}
                    alt={user.name}
                    sx={{ width: 64, height: 64, mr: 2 }}
                  />
                )}
                <Box>
                  <Typography variant="h6">Signed in as {user.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={3} sx={{ mt: 4 }}>
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Reports
                      </Typography>
                      <Typography variant="body2">
                        View and manage user reports
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" href="/reports">
                        View Reports
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Settings
                      </Typography>
                      <Typography variant="body2">
                        Configure application settings
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" href="/settings">
                        Go to Settings
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>
      </Layout>
    </>
  );
}

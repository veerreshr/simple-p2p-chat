import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import ListUsersComponent from "../Components/ListUsersComponent";
import ChatComponent from "./../Components/ChatComponent";
import { getAuth } from "firebase/auth";

function ChatScreen() {
  const auth = getAuth();
  const myUid = auth.currentUser.uid;
  return (
    <Box
      sx={{
        margin: {
          xs: 1,
          md: 3,
        },
      }}
    >
      My Id : {myUid}
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <ListUsersComponent />
        </Grid>
        <Grid item xs={12} md={9}>
          <ChatComponent />
        </Grid>
      </Grid>
    </Box>
  );
}

export default ChatScreen;

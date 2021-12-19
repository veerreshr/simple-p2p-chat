import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import ListUsersComponent from "../Components/ListUsersComponent";
import ChatComponent from "./../Components/ChatComponent";
import { getAuth } from "firebase/auth";
import {
  getDatabase,
  ref,
  onValue,
  push,
  onDisconnect,
  set,
  serverTimestamp,
} from "firebase/database";

function ChatScreen() {
  const db = getDatabase();
  const auth = getAuth();
  const myUid = auth.currentUser.uid;
  useEffect(() => {
    const myConnectionsRef = ref(db, `user-presence/${myUid}/connections`);

    const lastOnlineRef = ref(db, `user-presence/${myUid}/lastOnline`);

    const connectedRef = ref(db, ".info/connected");
    onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        const con = push(myConnectionsRef);

        onDisconnect(con).remove();

        set(con, true);

        onDisconnect(lastOnlineRef).set(serverTimestamp());
      }
    });
  }, []);
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

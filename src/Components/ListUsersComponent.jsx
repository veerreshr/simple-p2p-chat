import React, { useState, useEffect } from "react";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import {
  getDatabase,
  ref,
  onValue,
  update,
  child,
  get,
} from "firebase/database";
import { getAuth } from "firebase/auth";
import AddUserToChats from "./AddUserToChats";
import { useStoreActions } from "easy-peasy";

function ListUsersComponent() {
  const auth = getAuth();
  const db = getDatabase();
  const myUid = auth.currentUser.uid;

  const [peopleList, setPeopleList] = useState();

  useEffect(() => {
    if (myUid) {
      const people = ref(db, "users/" + myUid);
      onValue(people, (snapshot) => {
        const data = snapshot.val();
        setPeopleList(data);
      });
    }
  }, []);
  return (
    <Paper
      elevation={3}
      sx={{
        height: "80vh",
        padding: 2,
      }}
    >
      <AddUserToChats />
      {peopleList &&
        Object.keys(peopleList).map((person) => (
          <UserListCard key={person} contactId={person} myUid={myUid} />
        ))}
    </Paper>
  );
}

function UserListCard({ contactId, myUid }) {
  const db = getDatabase();
  const [online, setOnline] = useState(false);
  const [unread, setUnread] = useState(0);
  const [threadId, setThreadId] = useState();

  const updateOnlinePresence = () => {
    const onlineRef = ref(db, "user-presence/" + contactId + "/connections");
    onValue(onlineRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setOnline(true);
      } else {
        setOnline(false);
      }
    });
  };

  const getUnreadMessages = () => {
    const unreadMessagesRef = ref(db, `users/${myUid}/${contactId}/unread`);
    onValue(unreadMessagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setUnread(Object.keys(data).length);
        Object.keys(data).map((key) => {
          //message is in sent state, we need to change it into delivered state
          if (!data[key]) {
            const updates = {};
            updates[`threads/${threadId}/${key}/status`] = "delivered";
            updates[`users/${myUid}/${contactId}/unread/${key}`] = true;
            update(ref(db), updates);
          }
        });
      }
    });
  };

  const getThreadId = () => {
    get(child(ref(db), `users/${myUid}/${contactId}/threadId`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setThreadId(snapshot.val());
        } else {
          console.error("No data available");
        }
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  useEffect(() => {
    if (contactId) {
      if (!threadId) {
        getThreadId();
      }
      updateOnlinePresence();
      if (threadId) {
        getUnreadMessages();
      }
    }
  }, [contactId, threadId]);
  const updateChatsUser = useStoreActions(
    (actions) => actions.chats.updateChatsUser
  );
  const chatWithUser = () => {
    updateChatsUser(contactId);
  };
  return (
    <Paper
      onClick={chatWithUser}
      elevation={2}
      sx={{
        padding: 1,
        my: 2,
        "&:hover": {
          backgroundColor: "#e3e3e3",
          cursor: "pointer",
        },
        bgcolor: online ? "success.light" : "none",
      }}
    >
      <Stack
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography variant="body" component="div">
          {contactId.length > 15
            ? contactId.substring(0, 15) + "..."
            : contactId}
        </Typography>
        <Badge color="secondary" badgeContent={unread}>
          <MailIcon />
        </Badge>
      </Stack>
    </Paper>
  );
}

export default ListUsersComponent;

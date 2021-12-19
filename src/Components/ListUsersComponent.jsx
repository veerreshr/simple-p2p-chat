import React, { useState, useEffect } from "react";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { getDatabase, ref, onValue } from "firebase/database";
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
          <UserListCard name={person} pending={true} />
        ))}
    </Paper>
  );
}

function UserListCard({ name, pending }) {
  const updateChatsUser = useStoreActions(
    (actions) => actions.chats.updateChatsUser
  );
  const chatWithUser = () => {
    updateChatsUser(name);
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
      }}
    >
      <Stack
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography variant="body" component="div">
          {name.length > 15 ? name.substring(0, 15) + "..." : name}
        </Typography>
        <Badge color="secondary" variant="dot" invisible={!pending}>
          <MailIcon />
        </Badge>
      </Stack>
    </Paper>
  );
}

export default ListUsersComponent;

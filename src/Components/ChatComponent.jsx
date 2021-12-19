import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useStoreState } from "easy-peasy";
import { getAuth } from "firebase/auth";
import {
  getDatabase,
  ref,
  child,
  get,
  onValue,
  push,
  set,
  query,
  serverTimestamp,
  limitToFirst,
} from "firebase/database";
import { ToastContainer, toast } from "react-toastify";

export default function ChatComponent() {
  const auth = getAuth();
  const myUid = auth.currentUser.uid;
  const userName = useStoreState((state) => state.chats.user);

  const [messageData, setMessageData] = useState();
  const [threadId, setThreadId] = useState();
  const getMessages = (myId, personId) => {
    //this should give a thread Id and in turn should get all messages in that thread
    const dbRef = ref(getDatabase());
    let threadIdValue;
    get(child(dbRef, `users/${myId}/${personId}/threadId`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          threadIdValue = snapshot.val();
          const db = getDatabase();
          const threadRef = ref(db, "threads/" + threadIdValue);
          const limitToFirstDataRef = query(threadRef, limitToFirst(15));
          onValue(limitToFirstDataRef, (threadDataSnapshot) => {
            const threadData = threadDataSnapshot.val();
            setThreadId(threadIdValue);
            setMessageData(threadData);
          });
        } else {
          toast.info("No data available");
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  useEffect(() => {
    if (myUid && userName) {
      getMessages(myUid, userName);
    }
  }, [userName]);

  return (
    <>
      <ToastContainer />
      <Paper
        elevation={3}
        sx={{
          height: "84vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 2,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Typography variant="h6" component="h6">
              {userName}
            </Typography>
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
            >
              <ArrowDropDownIcon />
            </IconButton>
          </Stack>
        </Paper>
        <Box
          sx={{
            padding: 2,
            flexGrow: "1",
            overflowY: "scroll",
          }}
        >
          <Box sx={{ mt: "auto" }}></Box>
          {myUid &&
            messageData &&
            Object.keys(messageData).map((msg) => (
              <Message
                key={messageData[msg].by + messageData[msg].createdAt}
                message={messageData[msg]}
                myUid={myUid}
              />
            ))}
        </Box>
        <Box>
          <SendMessageComponent myUid={myUid} threadId={threadId} />
        </Box>
      </Paper>
    </>
  );
}

function SendMessageComponent({ myUid, threadId }) {
  const [value, setValue] = useState("");
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const sendMessage = () => {
    if (value) {
      let messageObj = {
        message: value,
        by: myUid,
        createdAt: serverTimestamp(),
      };
      const messageListRef = ref(getDatabase(), `threads/${threadId}`);
      const newMessageRef = push(messageListRef);
      set(newMessageRef, messageObj);
    }
  };
  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
      }}
    >
      <Grid container spacing={1}>
        <Grid item xs={11}>
          <TextField
            id="send-message"
            label="Send Message"
            multiline
            maxRows={4}
            value={value}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={1}>
          <Button
            sx={{ height: "100%", width: "100%" }}
            color="primary"
            aria-label="send"
            component="span"
            variant="contained"
            onClick={sendMessage}
          >
            <SendIcon />
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

function Message({ message, myUid }) {
  if (message.by == myUid) {
    return (
      <Grid container sx={{ my: 1 }}>
        <Grid item xs={4} md={5}></Grid>
        <Grid item xs={8} md={7}>
          <Typography variant="caption" component="div">
            {Date(message.createdAt * 1000)
              .toString()
              .substring(4, 21)}
            {/* <RenderStatus status={message.status} /> */}:
          </Typography>
          <Paper elevation={2} sx={{ padding: 1 }}>
            <Typography variant="body2">{message.message}</Typography>
          </Paper>
        </Grid>
      </Grid>
    );
  } else {
    return (
      <Grid container sx={{ my: 1 }}>
        <Grid item xs={8} md={7}>
          <Typography variant="caption" component="div">
            {message.timestamp}
          </Typography>
          <Paper elevation={2} sx={{ padding: 1 }}>
            <Typography variant="body2">{message.message}</Typography>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

function RenderStatus({ status }) {
  if (status == "sent") {
    return <DoneIcon fontSize={"small"} />;
  } else if (status == "delivered") {
    return <DoneAllIcon fontSize="small" />;
  } else if (status == "seen") {
    return <DoneAllIcon fontSize="small" color="info" />;
  }
}

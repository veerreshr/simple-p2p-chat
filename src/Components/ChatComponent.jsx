import React, { useEffect, useRef, useState } from "react";
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
  query,
  serverTimestamp,
  limitToFirst,
  update,
} from "firebase/database";
import { ToastContainer, toast } from "react-toastify";
import Avatar from "@mui/material/Avatar";

export default function ChatComponent() {
  const auth = getAuth();
  const myUid = auth.currentUser.uid;
  const recieverId = useStoreState((state) => state.chats.userId);
  const recieverDetails = useStoreState((state) => state.chats.userDetails);

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const [messageData, setMessageData] = useState();
  const [threadId, setThreadId] = useState();
  const getMessages = () => {
    const db = getDatabase();
    const threadRef = ref(db, "threads/" + threadId);
    // const limitToFirstDataRef = query(threadRef, limitToFirst(15));
    onValue(threadRef, (threadDataSnapshot) => {
      const threadData = threadDataSnapshot.val();
      setMessageData(threadData);
    });
  };
  const updateStatusToDelivered = () => {
    const db = getDatabase();
    const unreadMessagesRef = ref(
      db,
      `users/${myUid}/contacts/${recieverId}/unread`
    );
    onValue(unreadMessagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data && threadId) {
        Object.keys(data).map((key) => {
          //message is in sent state, we need to change it into delivered state
          const updates = {};
          updates[`threads/${threadId}/${key}/status`] = "seen";
          updates[`users/${myUid}/contacts/${recieverId}/unread/${key}`] = null;
          update(ref(db), updates);
        });
      }
    });
  };
  const getThreadId = () => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `users/${myUid}/contacts/${recieverId}/threadId`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setThreadId(snapshot.val());
        } else {
          toast.info("No thread Id available");
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  useEffect(() => {
    if (myUid && recieverId) {
      getThreadId();
      if (threadId) {
        getMessages();
        updateStatusToDelivered();
      }
    }
  }, [recieverId, threadId, myUid]);

  useEffect(() => {
    scrollToBottom();
  }, [messageData]);

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
            <Stack
              direction="row"
              justifyContent="space-around"
              alignItems="center"
              spacing={2}
            >
              <Avatar
                alt={"Chat Profile Image" + recieverDetails?.photoURL}
                src={recieverDetails?.photoURL}
              />
              <Typography variant="h6" component="h6">
                {recieverDetails?.name}
              </Typography>
            </Stack>

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
          {myUid &&
            messageData &&
            Object.keys(messageData).map((msg) => (
              <Message key={msg} message={messageData[msg]} myUid={myUid} />
            ))}
          <div ref={messagesEndRef} />
        </Box>
        <Box>
          <SendMessageComponent
            senderId={myUid}
            recieverId={recieverId}
            threadId={threadId}
          />
        </Box>
      </Paper>
    </>
  );
}

function SendMessageComponent({ senderId, recieverId, threadId }) {
  const [value, setValue] = useState("");
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const sendMessage = () => {
    if (value) {
      let messageObj = {
        message: value,
        by: senderId,
        createdAt: serverTimestamp(),
        status: "sent",
      };
      const db = getDatabase();
      const newMessageKey = push(child(ref(db), `threads/${threadId}`)).key;
      const updates = {};
      updates[`threads/${threadId}/${newMessageKey}`] = messageObj;
      updates[
        `users/${recieverId}/contacts/${senderId}/unread/${newMessageKey}`
      ] = false;
      setValue("");
      return update(ref(db), updates);
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
          <Paper elevation={2} sx={{ padding: 1 }}>
            <Typography variant="body2">{message.message}</Typography>
            <Stack
              flexDirection={"row"}
              alignItems={"center"}
              justifyContent={"flex-end"}
            >
              <Typography variant="caption" component="div" sx={{ px: 1 }}>
                {Date(message.createdAt * 1000)
                  .toString()
                  .substring(4, 21)}
              </Typography>
              <RenderStatus status={message.status} />
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    );
  } else {
    return (
      <Grid container sx={{ my: 1 }}>
        <Grid item xs={8} md={7}>
          <Paper elevation={2} sx={{ padding: 1 }}>
            <Typography variant="body2">{message.message}</Typography>
            <Stack
              flexDirection={"row"}
              alignItems={"center"}
              justifyContent={"flex-end"}
            >
              <Typography variant="caption" component="div" sx={{ px: 1 }}>
                {Date(message.createdAt * 1000)
                  .toString()
                  .substring(4, 21)}
              </Typography>
            </Stack>
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
  return <></>;
}

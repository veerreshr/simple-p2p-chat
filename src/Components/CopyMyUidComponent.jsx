import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { getAuth } from "firebase/auth";
function CopyMyUidComponent() {
  const auth = getAuth();
  const [open, setOpen] = useState(false);
  const [id, setId] = useState();

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(id);
    handleTooltipOpen();
  };

  useEffect(() => {
    const myUid = auth?.currentUser?.uid;
    if (myUid) {
      setId(myUid);
    } else setId(null);
  }, [auth]);
  return (
    <div>
      {id && (
        <ClickAwayListener onClickAway={handleTooltipClose}>
          <div>
            <Tooltip
              PopperProps={{
                disablePortal: true,
              }}
              onClose={handleTooltipClose}
              open={open}
              disableFocusListener
              disableHoverListener
              disableTouchListener
              title="Copied To Clipboard"
            >
              <Button
                color="inherit"
                size="small"
                sx={{ mx: 1 }}
                onClick={handleCopy}
                variant="outlined"
              >
                Click to Copy Id
              </Button>
            </Tooltip>
          </div>
        </ClickAwayListener>
      )}
    </div>
  );
}

export default CopyMyUidComponent;

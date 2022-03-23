import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const steps = ["Login", "Get User Id", "Add User", "Send Messages"];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  return (
    <Box sx={{ m: 3 }}>
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepButton color="inherit" onClick={handleStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <div>
        {allStepsCompleted() ? (
          <React.Fragment>
            <Box
              sx={{
                m: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                height: "70vh",
                overflowY: "scroll",
              }}
            >
              {" "}
              <Typography>
                All steps completed - That's how it works!
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <RenderStep activeStep={activeStep} />
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleNext} sx={{ mr: 1 }}>
                Next
              </Button>
              {activeStep !== steps.length &&
                (completed[activeStep] ? (
                  <Typography
                    variant="caption"
                    sx={{ display: "inline-block" }}
                  >
                    Step {activeStep + 1} already completed
                  </Typography>
                ) : (
                  <Button onClick={handleComplete}>
                    {completedSteps() === totalSteps() - 1
                      ? "Finish"
                      : "Complete Step"}
                  </Button>
                ))}
            </Box>
          </React.Fragment>
        )}
      </div>
    </Box>
  );
}

function RenderStep({ activeStep }) {
  return (
    <Box
      sx={{
        m: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "70vh",
        overflowY: "scroll",
      }}
    >
      {activeStep === 0 && (
        <>
          <Typography variant="h5" gutterBottom component="div">
            Google Sign In
          </Typography>

          <img
            style={{ maxHeight: "60vh" }}
            src="https://user-images.githubusercontent.com/59141533/159777771-7b2e7099-30e7-4906-892b-4892e561f430.png"
          />
        </>
      )}

      {activeStep === 1 && (
        <>
          <Box sx={{ m: 1 }}>
            <Typography variant="body1" gutterBottom component="div">
              Get the user id of your friend by asking him to share his id.
            </Typography>

            <Typography variant="body1" gutterBottom component="div">
              He can share it in two ways :<br />
              1. Click on his user profile and then select click to copy id
              option, he can now share this id with you.
              <br /> 2. He can also share this id with you by clicking on share
              button in his profile.
            </Typography>
            <br />
          </Box>
          <img
            style={{ maxHeight: "60vh" }}
            src="https://user-images.githubusercontent.com/59141533/159780967-c8220579-d002-407d-9a69-14a7384a6d36.png"
          />
        </>
      )}

      {activeStep === 2 && (
        <>
          <Typography variant="h5" gutterBottom component="div">
            Steps:
          </Typography>
          <Typography variant="body1" gutterBottom component="div">
            1.Go to the chat screen.
            <br />
            2.Find the input box mentioning Enter User Id.
            <br />
            3.Enter the user id of your friend and click on add user button.
          </Typography>

          <img
            style={{ maxHeight: "60vh" }}
            src="https://user-images.githubusercontent.com/59141533/159782794-dca7a96e-2266-4f6a-8214-e92daf9e0372.png"
          />
        </>
      )}
      {activeStep === 3 && (
        <>
          <Typography variant="h5" gutterBottom component="div">
            Thats it! You can now chat with your friend.
          </Typography>
          <img
            style={{ maxHeight: "60vh" }}
            src="https://user-images.githubusercontent.com/59141533/147008643-0b25f269-8c77-44a8-bee8-5635031e13eb.png"
          />
        </>
      )}
    </Box>
  );
}

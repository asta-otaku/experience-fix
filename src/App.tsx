import { useState } from "react";
import StepZero from "./components/StepZero";
import StepOne from "./components/StepOne";
import TapTip from "./components/TapTip";

function App() {
  const [step, setStep] = useState(3);
  const [transitioning, setTranstioning] = useState("");

  const handleNext = () => {
    setTranstioning("forward");
    setTimeout(() => {
      setStep(step + 1);
      setTranstioning("");
    }, 1000); // Adjust the delay time as needed
  };

  // const handlePrev = () => {
  //   setTranstioning("backward");
  //   setTimeout(() => {
  //     setStep(step - 1);
  //     setTranstioning("");
  //   }, 1000);
  // };

  return (
    <div
      className={`transition-transform ease-in-out duration-1000 max-w-screen-2xl mx-auto w-full h-screen ${
        transitioning === "forward"
          ? "slide-in"
          : transitioning === "backward"
          ? "slide-reverse"
          : "slide-out"
      }`}
    >
      {
        {
          0: <StepZero handleNext={handleNext} />,
          1: <StepOne />,
          3: <TapTip />,
        }[step]
      }
    </div>
  );
}

export default App;

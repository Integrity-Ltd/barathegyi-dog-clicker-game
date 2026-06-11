import { LazyMotion, domAnimation } from "framer-motion";

import { ClickerTrainer } from "./ClickerTrainer";
import { ThemeProvider } from "./theme/ThemeProvider";

export default function App() {
  return (
    <LazyMotion features={domAnimation}>
      <ThemeProvider>
        <ClickerTrainer />
      </ThemeProvider>
    </LazyMotion>
  );
}

import { LazyMotion, domAnimation } from "framer-motion";

import { ClickerTrainer } from "./ClickerTrainer";

export default function App() {
  return (
    <LazyMotion features={domAnimation}>
      <ClickerTrainer />
    </LazyMotion>
  );
}

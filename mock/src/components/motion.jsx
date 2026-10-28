import { createContext, useContext } from "react";
import { motion, useReducedMotion } from "motion/react";

// One switch for everything that moves: the visitor's Pause motion button
// and the system's reduced-motion setting both land here.
export const MotionCtx = createContext({ paused: false, toggle: () => {} });
export const useMotionOff = () => {
  const { paused } = useContext(MotionCtx);
  const reduced = useReducedMotion();
  return paused || !!reduced;
};

const ease = [0.22, 1, 0.36, 1];

/** Text rises in the first time it enters the screen. */
export function Rise({ as = "div", delay = 0, children, ...rest }) {
  const off = useMotionOff();
  const Tag = motion[as] || motion.div;
  return (
    <Tag initial={off ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, delay, ease }} {...rest}>
      {children}
    </Tag>
  );
}

/** Pictures open from a soft crop and settle, after Mirada's picture reveal. */
export function Open({ delay = 0, children, className, style }) {
  const off = useMotionOff();
  return (
    <motion.div
      className={className}
      style={style}
      initial={off ? false : { opacity: 0, y: 28, clipPath: "inset(9% 7% 9% 7%)" }}
      whileInView={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.1, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/** Children arrive one after another, 70 ms apart, as Mirada staggers them. */
export function Stagger({ children, className, step = 0.07 }) {
  const off = useMotionOff();
  return (
    <motion.div className={className} initial={off ? false : "hidden"} whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={{ hidden: {}, show: { transition: { staggerChildren: step } } }}>
      {children}
    </motion.div>
  );
}
export const item = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } };
export { motion };

import { motion } from "framer-motion";
import { useScreenSize } from "hooks";

const PageTransition = ({
  children,
  transactionType,
}: {
  children: any;
  transactionType?: "slideUpFade" | "slideRightFade" | "slideLeftFade";
}) => {
  const { isSmScreen } = useScreenSize();
  const variants = (() => {
    switch (transactionType) {
      case "slideLeftFade":
        return {
          initial: {
            x: "-20vw", // Start from left side
            opacity: 0.7, // Slightly transparent on entry
          },
          in: {
            x: 0,
            opacity: 1,
            transition: {
              type: "spring", // Spring physics for natural bounce
              damping: 15, // Controls "bounciness" (lower = more bounce)
              stiffness: 100, // Snap intensity
            },
          },
          out: {
            x: "15vw", // Slide slightly to the right on exit
            opacity: 0,
            transition: {
              type: "tween", // Smooth fade-out
              ease: "easeIn",
              duration: 0.2, // Faster exit
            },
          },
        };
      case "slideRightFade":
        return {
          initial: {
            x: "20vw", // Start from left side
            opacity: 0.7, // Slightly transparent on entry
          },
          in: {
            x: 0,
            opacity: 1,
            transition: {
              type: "spring", // Spring physics for natural bounce
              damping: 15, // Controls "bounciness" (lower = more bounce)
              stiffness: 100, // Snap intensity
            },
          },
          out: {
            x: "15vw", // Slide slightly to the right on exit
            opacity: 0,
            transition: {
              type: "tween", // Smooth fade-out
              ease: "easeIn",
              duration: 0.2, // Faster exit
            },
          },
        };
      default:
        return {
          initial: {
            y: "5vh",
            opacity: 0.9,
          },
          in: {
            y: 0,
            opacity: 1,
            transition: {
              type: "spring",
              damping: 25,
              stiffness: 250,
              mass: 0.3,
              duration: 0.3,
            },
          },
          out: {
            y: "5vh",
            opacity: 0,
            transition: {
              type: "tween",
              ease: "easeInOut",
              duration: 0.15,
            },
          },
        };
    }
  })();

  if (!isSmScreen) return children;
  return (
    <motion.div
      initial="initial"
      animate="in"
      key={window.location.pathname} // ← Unique key per route
      exit="out"
      variants={variants}
      transition={{
        type: "spring", // Default spring for all animations
        damping: 15,
        stiffness: 100,
      }}
      className="h-full w-full hide-scrollbar overflow-hidden" // Prevent scroll during transition
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;

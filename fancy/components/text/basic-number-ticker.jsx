"use client";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react"
import { animate, motion, useMotionValue, useTransform } from "motion/react";

import { cn } from "@/lib/utils";

const NumberTicker = forwardRef((
  {
    from = 0,
    target = 100,
    transition = {
      duration: 3,
      type: "tween",
      ease: "easeInOut",
    },
    className,
    onStart,
    onComplete,
    autoStart = true,
    ...props
  },
  ref
) => {
  const count = useMotionValue(from)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const [controls, setControls] = useState(null)

  // Function to start the animation
  const startAnimation = useCallback(() => {
    if (controls) controls.stop()
    onStart?.()

    count.set(from)

    const newControls = animate(count, target, {
      ...transition,
      onComplete: () => {
        onComplete?.()
      },
    })
    setControls(newControls)
  }, [])

  // Expose the startAnimation function via ref
  useImperativeHandle(ref, () => ({
    startAnimation,
  }))

  useEffect(() => {
    if (autoStart) {
      startAnimation()
    }
    return () => controls?.stop();
  }, [autoStart])

  return (
    <motion.span className={cn(className)} {...props}>
      {rounded}
    </motion.span>
  );
})

NumberTicker.displayName = "NumberTicker"

export default NumberTicker

// Usage example:
// To start the animation from outside the component:
// 1. Create a ref:
//    const tickerRef = useRef<NumberTickerRef>(null);
// 2. Pass the ref to the NumberTicker component:
//    <NumberTicker ref={tickerRef} from={0} target={100} autoStart={false} />
// 3. Call the startAnimation function:
//    tickerRef.current?.startAnimation();

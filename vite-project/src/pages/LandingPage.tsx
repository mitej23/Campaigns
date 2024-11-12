import { Button } from "@/components/ui/button";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Spotlight } from "@/components/ui/Spotlight";
import { GithubIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function LandingPage() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 400,
      },
    },
  };

  return (
    <div className="h-screen w-full rounded-md flex md:items-center md:justify-center bg-gray-50 antialiased bg-grid-gray-200/[0.4] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="#8b8cf3"
      />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0 flex flex-col items-center">
        <motion.div variants={itemVariants}>
          <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            className="mx-auto flex items-center bg-gradient-to-b from-gray-900 to-gray-600 bg-opacity-50 px-6 py-2 gap-2">
            <span>
              <GithubIcon size={14} />
            </span>
            <span className="text-white font-medium text-xs">
              Give Star on Github
            </span>
          </HoverBorderGradient>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 bg-opacity-50 mt-2">
          Streamline
        </motion.h1>

        <motion.h1
          variants={itemVariants}
          style={{ lineHeight: 1.3 }}
          className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 bg-opacity-50">
          Your Email Campaigns
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mt-4 font-normal text-base text-gray-600 max-w-lg text-center mx-auto">
          Campaign is a powerful email automation tool that helps you create,
          schedule, and optimize your marketing communications.
        </motion.p>

        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          className="mt-5">
          <Button
            className="mx-auto bg-gradient-to-b from-gray-900 to-gray-600 bg-opacity-50"
            onClick={() => navigate("/login")}>
            Get Started for Free
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default LandingPage;

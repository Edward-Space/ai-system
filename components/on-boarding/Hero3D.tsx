"use client";
import Spline from "@splinetool/react-spline";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { motion, Variants } from "motion/react";

export const Hero3D = () => {
  const containerVariants:Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants:Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants:Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className="h-[500px] lg:h-[56vw] w-full flex flex-col gap-5 items-center justify-center relative">
      <motion.div 
        className="flex flex-col gap-6 items-center justify-center z-20 text-center px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Badge className="bg-primary/10 text-primary border-primary/20">
            Chào mừng bạn đến với CDS AI
          </Badge>
        </motion.div>
        
        <motion.h1 
          className="text-white font-bold text-4xl md:text-5xl lg:text-6xl"
          variants={itemVariants}
        >
          CDS AI SYSTEM
        </motion.h1>
        
        <motion.p 
          className="text-white/80 text-lg md:text-xl max-w-2xl leading-relaxed"
          variants={itemVariants}
        >
          Giải pháp AI thông minh cho doanh nghiệp hiện đại. 
          Tối ưu hóa quy trình làm việc và nâng cao hiệu suất với công nghệ tiên tiến.
        </motion.p>
        
        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 mt-4"
          variants={itemVariants}
        >
          <Link href="/vi/login">
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" className="font-semibold px-8 py-3 bg-primary hover:bg-primary/90 cursor-pointer">
                Bắt Đầu Ngay
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </Link>
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="lg" 
              variant="outline" 
              className="font-semibold px-8 py-3 bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <Play className="w-5 h-5 mr-2" />
              Xem Demo
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="h-auto w-full absolute bottom-0 left-0 z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <Spline scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" />
      </motion.div>
    </div>
  );
};

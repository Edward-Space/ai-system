"use client";

import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ArrowRight, UserPlus, Settings, MessageSquare, BarChart3 } from "lucide-react";
import { motion, Variants } from "motion/react";

export const HowItWorksSection = () => {
  const steps = [
    {
      step: "01",
      icon: UserPlus,
      title: "Đăng Ký & Thiết Lập",
      description: "Tạo tài khoản và cấu hình hệ thống theo nhu cầu của bạn",
      details: [
        "Đăng ký tài khoản miễn phí",
        "Xác thực email và bảo mật",
        "Thiết lập thông tin doanh nghiệp"
      ]
    },
    {
      step: "02", 
      icon: Settings,
      title: "Cấu Hình AI Bot",
      description: "Tùy chỉnh bot AI với kiến thức và tính cách riêng",
      details: [
        "Upload tài liệu và dữ liệu",
        "Huấn luyện bot với kiến thức chuyên môn",
        "Thiết lập tính cách và phong cách trả lời"
      ]
    },
    {
      step: "03",
      icon: MessageSquare,
      title: "Bắt Đầu Sử Dụng",
      description: "Trò chuyện với AI và tận hưởng trải nghiệm thông minh",
      details: [
        "Chat trực tiếp với AI bot",
        "Upload file và hình ảnh để phân tích",
        "Sử dụng voice-to-text"
      ]
    },
    {
      step: "04",
      icon: BarChart3,
      title: "Theo Dõi & Tối Ưu",
      description: "Phân tích hiệu suất và cải thiện liên tục",
      details: [
        "Xem báo cáo chi tiết",
        "Phân tích xu hướng sử dụng",
        "Tối ưu hóa hiệu suất"
      ]
    }
  ];

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

  const stepVariants:Variants = { 
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const arrowVariants:Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: 0.8
      }
    }
  };

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Badge className="mb-4">Cách Thức Hoạt Động</Badge>
          </motion.div>
          <motion.h2 
            className="text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Bắt Đầu Với CDS AI Chỉ Trong 4 Bước
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Quy trình đơn giản và trực quan giúp bạn nhanh chóng triển khai 
            và tận dụng sức mạnh của AI trong công việc.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className="relative"
              variants={stepVariants}
              whileHover="hover"
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <motion.div 
                    className="flex items-center gap-4 mb-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  >
                    <motion.div 
                      className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {step.step}
                    </motion.div>
                    <motion.div 
                      className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <step.icon className="w-6 h-6 text-primary" />
                    </motion.div>
                  </motion.div>
                  
                  <motion.h3 
                    className="text-xl font-bold mb-3"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  >
                    {step.title}
                  </motion.h3>
                  <motion.p 
                    className="text-muted-foreground mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  >
                    {step.description}
                  </motion.p>
                  
                  <motion.ul 
                    className="space-y-2"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.1,
                          delayChildren: 0.5 + index * 0.1
                        }
                      }
                    }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {step.details.map((detail, detailIndex) => (
                      <motion.li 
                        key={detailIndex} 
                        className="flex items-start gap-2 text-sm"
                        variants={{
                          hidden: { opacity: 0, x: -10 },
                          visible: {
                            opacity: 1,
                            x: 0,
                            transition: { duration: 0.3 }
                          }
                        }}
                        whileHover={{ x: 5 }}
                      >
                        <motion.div 
                          className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 2, 
                            delay: detailIndex * 0.2 
                          }}
                        />
                        <span className="text-muted-foreground">{detail}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </CardContent>
              </Card>
              
              {/* Arrow connector */}
              {index < steps.length - 1 && (
                <motion.div 
                  className="hidden xl:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10"
                  variants={arrowVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2, 
                      delay: 1 + index * 0.2 
                    }}
                  >
                    <ArrowRight className="w-6 h-6 text-primary" />
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.div 
            className="bg-gradient-to-r from-card via-card/90 to-secondary/50 rounded-2xl p-8 text-white"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h3 
              className="text-2xl font-bold mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Sẵn Sàng Bắt Đầu?
            </motion.h3>
            <motion.p 
              className="mb-6 opacity-90 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              Tham gia cùng hàng nghìn doanh nghiệp đã tin tưởng và sử dụng CDS AI 
              để tối ưu hóa quy trình làm việc.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" variant="secondary" className="font-semibold">
                Dùng Thử Miễn Phí
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
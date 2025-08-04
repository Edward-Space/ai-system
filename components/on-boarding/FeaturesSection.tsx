"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { 
  MessageSquare, 
  Bot, 
  Database, 
  Settings, 
  FileText, 
  BarChart3,
  Mic,
  Image,
  Globe,
  Lock
} from "lucide-react";
import { motion, Variants } from "motion/react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: MessageSquare,
      title: "Chat AI Thông Minh",
      description: "Trò chuyện tự nhiên với AI, nhận được câu trả lời chính xác và hữu ích cho mọi câu hỏi.",
      color: "bg-blue-500/10 text-blue-600"
    },
    {
      icon: Bot,
      title: "Tạo Bot Tùy Chỉnh",
      description: "Xây dựng bot AI riêng với tính cách và kiến thức chuyên biệt cho từng lĩnh vực.",
      color: "bg-purple-500/10 text-purple-600"
    },
    {
      icon: Database,
      title: "Quản Lý Kiến Thức",
      description: "Tổ chức và quản lý cơ sở dữ liệu kiến thức một cách thông minh và hiệu quả.",
      color: "bg-green-500/10 text-green-600"
    },
    {
      icon: FileText,
      title: "Xử Lý Tài Liệu",
      description: "Upload và phân tích tài liệu PDF, Word, Excel với khả năng trích xuất thông tin thông minh.",
      color: "bg-orange-500/10 text-orange-600"
    },
    {
      icon: Mic,
      title: "Nhận Diện Giọng Nói",
      description: "Chuyển đổi giọng nói thành văn bản một cách chính xác và nhanh chóng.",
      color: "bg-red-500/10 text-red-600"
    },
    {
      icon: Image,
      title: "Phân Tích Hình Ảnh",
      description: "Nhận diện và mô tả nội dung hình ảnh với độ chính xác cao.",
      color: "bg-pink-500/10 text-pink-600"
    },
    {
      icon: BarChart3,
      title: "Báo Cáo & Thống Kê",
      description: "Theo dõi hiệu suất và tạo báo cáo chi tiết về hoạt động của hệ thống.",
      color: "bg-indigo-500/10 text-indigo-600"
    },
    {
      icon: Settings,
      title: "Cấu Hình Linh Hoạt",
      description: "Tùy chỉnh hệ thống theo nhu cầu cụ thể của doanh nghiệp.",
      color: "bg-teal-500/10 text-teal-600"
    },
    {
      icon: Globe,
      title: "Đa Ngôn Ngữ",
      description: "Hỗ trợ nhiều ngôn ngữ khác nhau, phù hợp với doanh nghiệp quốc tế.",
      color: "bg-cyan-500/10 text-cyan-600"
    },
    {
      icon: Lock,
      title: "Bảo Mật Cao",
      description: "Đảm bảo an toàn dữ liệu với các tiêu chuẩn bảo mật quốc tế.",
      color: "bg-gray-500/10 text-gray-600"
    }
  ];

  const containerVariants:Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants:Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      y: -10,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const badgeVariants:Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            variants={badgeVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Badge className="mb-4">Tính Năng Nổi Bật</Badge>
          </motion.div>
          <motion.h2 
            className="text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Khám Phá Sức Mạnh Của CDS AI
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Hệ thống AI toàn diện với đầy đủ tính năng cần thiết để tối ưu hóa 
            quy trình làm việc và nâng cao hiệu suất doanh nghiệp.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              custom={index}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group h-full">
                <CardHeader className="pb-4">
                  <motion.div 
                    className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon className="w-6 h-6" />
                  </motion.div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8">
            <motion.h3 
              className="text-2xl font-bold mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Và Còn Nhiều Tính Năng Khác
            </motion.h3>
            <motion.p 
              className="text-muted-foreground mb-6 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              CDS AI liên tục cập nhật và phát triển thêm các tính năng mới để đáp ứng 
              nhu cầu ngày càng cao của doanh nghiệp trong thời đại số.
            </motion.p>
            <motion.div 
              className="flex flex-wrap justify-center gap-2"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {["API Integration", "Real-time Sync", "Cloud Storage", "Mobile App", "Team Collaboration"].map((badge, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: {
                      opacity: 1,
                      scale: 1,
                      transition: {
                        duration: 0.3,
                        delay: 0.6 + index * 0.1
                      }
                    }
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge variant="secondary">{badge}</Badge>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
import banner from "@/assets/landing/banner.jpg";
import "./Hero.css";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-container">
        <motion.div
          className="hero-left"
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="badge">Đồng hành cùng gia đình Việt</span>

          <h1>
            Đồng hành cùng con bước vào
            <span> <i>tuổi dậy thì</i></span>
          </h1>

          <p>
            Tuổi dậy thì là giai đoạn chuyển giao quan trọng đầy biến động.
            SSCare mang đến sự kết nối tinh tế, kiến thức chuyên sâu và sự thấu
            cảm giúp cha mẹ cùng con vượt qua mọi thử thách một cách nhẹ nhàng
            nhất.
          </p>

          <button className="hero-btn">Khám phá ngay</button>
        </motion.div>

        <div className="hero-right" data-aos="fade-left">
          <img src={banner} alt="Banner" />
        </div>
      </div>
    </section>
  );
}

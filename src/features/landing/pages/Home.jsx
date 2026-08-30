import "./Home.css";

import HeroSection from "@/features/landing/components/Hero/Hero";
import MissionSection from "@/features/landing/components/Mission/Mission";
import TestimonialSection from "@/features/landing/components/Testimonial/Testimonials";
import DownloadSection from "@/features/landing/components/Download/Download";
import Footer from "@/shared/components/layout/Footer/Footer";

export default function Home() {
    return (
        <>
            <HeroSection />
            <MissionSection />
            <TestimonialSection />

            <div className="download-footer-unified">
                <DownloadSection />
                <Footer />
            </div>
        </>
    );
}

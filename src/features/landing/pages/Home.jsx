import "./Home.css";

import HeroSection from "@/features/landing/components/Hero/Hero";
import MissionSection from "@/features/landing/components/Mission/Mission";
import TestimonialSection from "@/features/landing/components/Testimonial/Testimonials";
import DownloadSection from "@/features/landing/components/Download/Download";

export default function Home() {
    return (
        <>
            <HeroSection />
            <MissionSection />
            <TestimonialSection />

            <div className="download-section-background">
                <DownloadSection />
            </div>
        </>
    );
}

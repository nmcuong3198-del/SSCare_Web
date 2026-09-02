import { useEffect } from "react";

import DownloadSection from "@/features/landing/components/Download/Download";

import "./DownloadPage.css";

export default function DownloadPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div className="download-page">
      <DownloadSection />
    </div>
  );
}

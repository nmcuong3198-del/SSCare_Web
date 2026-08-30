import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import AppDownloadModal from "@/features/landing/components/AppDownloadModal/AppDownloadModal";
import Home from "@/features/landing/pages/Home";

export default function DownloadPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const closeModal = useCallback(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  return (
    <>
      <Home showFooter={false} />
      <AppDownloadModal onClose={closeModal} />
    </>
  );
}

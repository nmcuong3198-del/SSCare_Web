import { useCallback, useEffect, useState } from "react";

import legalService from "@/features/legal/services/legalService";

const documentKeyByType = {
  TERMS_OF_USE: "termsOfUse",
  PRIVACY_POLICY: "privacyPolicy",
};

export default function useLegalDocument(documentType) {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await legalService.getCurrentDocuments();
      const key = documentKeyByType[documentType];
      const nextDocument = key ? response?.[key] : null;

      if (!nextDocument) {
        setDocument(null);
        setError("Không thể tải nội dung. Vui lòng thử lại.");
        return null;
      }

      setDocument(nextDocument);
      return nextDocument;
    } catch {
      setDocument(null);
      setError("Không thể tải nội dung. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, [documentType]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [load]);

  return {
    document,
    loading,
    error,
    reload: load,
  };
}

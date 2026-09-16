import LegalDocumentPage from "@/features/legal/components/LegalDocumentPage";
import useLegalDocument from "@/features/legal/hooks/useLegalDocument";

export default function PrivacyPolicy() {
  const { document, loading, error, reload } = useLegalDocument("PRIVACY_POLICY");

  return (
    <LegalDocumentPage
      title={document?.title || "CHÍNH SÁCH BẢO MẬT"}
      introNote={document?.introNote}
      blocks={document?.blocks || []}
      version={document?.version}
      effectiveAt={document?.effectiveAt}
      loading={loading}
      error={error}
      onRetry={reload}
    />
  );
}

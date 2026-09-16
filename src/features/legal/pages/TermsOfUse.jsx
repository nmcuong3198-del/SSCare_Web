import LegalDocumentPage from "@/features/legal/components/LegalDocumentPage";
import useLegalDocument from "@/features/legal/hooks/useLegalDocument";

export default function TermsOfUse() {
  const { document, loading, error, reload } = useLegalDocument("TERMS_OF_USE");

  return (
    <LegalDocumentPage
      title={document?.title || "ĐIỀU KIỆN GIAO DỊCH CHUNG/ĐIỀU KHOẢN DỊCH VỤ"}
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

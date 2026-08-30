import { useEffect, useState } from "react";
import { resolveArticleImageUrl } from "./articleImageUrl";

export default function useArticleImagePreview(imageSource) {
  const [filePreview, setFilePreview] = useState(
      /** @type {{ source: Blob | null, url: string | null }} */ ({
        source: null,
        url: null,
      })
  );

  useEffect(() => {
    if (!(imageSource instanceof Blob)) {
      return undefined;
    }

    let cancelled = false;
    const reader = new FileReader();

    reader.onload = () => {
      if (!cancelled && typeof reader.result === "string") {
        setFilePreview({
          source: imageSource,
          url: reader.result,
        });
      }
    };

    reader.onerror = () => {
      if (!cancelled) {
        setFilePreview({
          source: imageSource,
          url: null,
        });
      }
    };

    reader.readAsDataURL(imageSource);

    return () => {
      cancelled = true;

      if (reader.readyState === FileReader.LOADING) {
        reader.abort();
      }
    };
  }, [imageSource]);

  // Ảnh đã được lưu trên server
  if (typeof imageSource === "string") {
    return resolveArticleImageUrl(imageSource);
  }

  // Chưa chọn ảnh
  if (!(imageSource instanceof Blob)) {
    return null;
  }

  // File mới vừa được chọn
  return filePreview.source === imageSource
      ? filePreview.url
      : null;
}
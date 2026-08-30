import { useEffect, useMemo, useRef } from "react";

import { resolveArticleImageUrl } from "@/features/posts/utils/articleImageUrl";

import "./UploadCover.css";

const MAX_SIZE = 5 * 1024 * 1024;
const VALID_TYPES = ["image/jpeg", "image/jpg", "image/png"];
export default function UploadCover({
                                      imageFile,
                                      setImageFile,
                                      readOnly,
                                      loading = false,
                                    }) {
  const fileInputRef = useRef(null);

  const previewUrl = useMemo(() => {
    if (!imageFile) return null;
    if (typeof imageFile === "string") return resolveArticleImageUrl(imageFile);
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const validateFile = (file) => {
    if (!file) return false;

    if (!VALID_TYPES.includes(file.type)) {
      window.alert("Chỉ hỗ trợ JPG hoặc PNG.");
      return false;
    }

    if (file.size > MAX_SIZE) {
      window.alert("Dung lượng tối đa là 5MB.");
      return false;
    }

    return true;
  };

  const processFile = (file) => {
    if (validateFile(file)) {
      setImageFile(file);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    processFile(file);
    event.target.value = "";
  };

  const handleChooseImage = () => {
    if (!readOnly) fileInputRef.current?.click();
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (readOnly || loading) return;

    const file = event.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleRemoveImage = (event) => {
    event.stopPropagation();
    if (readOnly) return;

    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleChangeImage = (event) => {
    event.stopPropagation();
    if (!readOnly) fileInputRef.current?.click();
  };

  return (
      <>
        <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileChange}
            disabled={loading || readOnly}
            hidden
        />

        <div
            className="upload-box"
            onClick={loading || readOnly ? undefined : handleChooseImage}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
          {imageFile && previewUrl ? (
              <div className="preview-container">
                <img src={previewUrl} alt="Ảnh bìa" className="cover-preview" />

                <div className="file-info">
                  {typeof imageFile === "string" ? (
                      <strong>Ảnh hiện tại</strong>
                  ) : (
                      <>
                        <strong>{imageFile.name}</strong>
                        <p>{(imageFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </>
                  )}
                </div>

                {!readOnly && (
                    <div className="preview-actions">
                      <button type="button" onClick={handleChangeImage}>
                        Đổi ảnh
                      </button>
                      <button type="button" onClick={handleRemoveImage}>
                        Xóa ảnh
                      </button>
                    </div>
                )}
              </div>
          ) : (
              <div className="upload-content">
                <div className="upload-icon">📷</div>
                <h3>Nhấn hoặc kéo ảnh vào đây</h3>
                <p>JPG, PNG - Tối đa 5MB</p>
              </div>
          )}
        </div>
      </>
  );
}

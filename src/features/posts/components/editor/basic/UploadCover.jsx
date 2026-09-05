import { useRef, useState } from "react";

import useArticleImagePreview from "@/features/posts/utils/useArticleImagePreview";

import "./UploadCover.css";

const MAX_SIZE = 5 * 1024 * 1024;
const VALID_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const VALID_EXTENSIONS = ["jpg", "jpeg", "png"];
export default function UploadCover({
                                      imageFile,
                                      setImageFile,
                                      readOnly,
                                      loading = false,
                                    }) {
  const fileInputRef = useRef(null);

  const previewUrl = useArticleImagePreview(imageFile);
  const [previewError, setPreviewError] = useState(false);

  const validateFile = (file) => {
    if (!file) return false;

    const mimeType = String(file.type || "").toLowerCase();
    const extension = String(file.name || "").split(".").pop()?.toLowerCase();
    const validMime = VALID_TYPES.includes(mimeType);
    const validExtension = VALID_EXTENSIONS.includes(extension);

    // Some browsers/OS combinations leave File.type empty for a valid PNG/JPG.
    // The backend still validates the real file signature, so accepting by extension here is safe.
    if (!validMime && !validExtension) {
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
      setPreviewError(false);
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

    setPreviewError(false);
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
                {!previewError ? (
                    <img
                        src={previewUrl}
                        alt="Ảnh bìa"
                        className="cover-preview"
                        onLoad={() => setPreviewError(false)}
                        onError={() => setPreviewError(true)}
                    />
                ) : (
                    <div className="cover-preview-error">
                      Không thể hiển thị ảnh này. Vui lòng chọn lại ảnh JPG hoặc PNG hợp lệ.
                    </div>
                )}

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

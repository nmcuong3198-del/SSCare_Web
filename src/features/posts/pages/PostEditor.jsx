import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import authService from "@/features/auth/services/authService";
import ArticleBasicInfo from "@/features/posts/components/editor/basic/ArticleBasicInfo";
import ContentEditor from "@/features/posts/components/editor/content/ContentEditor";
import BottomActionBar from "@/features/posts/components/editor/footer/BottomBar";
import ApproveSuccessModal from "@/features/posts/components/editor/popup/ApproveSuccessModal";
import ArticlePreviewModal from "@/features/posts/components/editor/preview/ArticlePreviewModal";
import RejectSuccessModal from "@/features/posts/components/editor/popup/RejectSuccessModal";
import SubmitSuccessModal from "@/features/posts/components/editor/popup/SubmitSuccessModal";
import Sidebar from "@/features/posts/components/editor/sidebar/Sidebar";
import { createEmptyArticle } from "@/features/posts/model/articleDefault";
import articleService from "@/features/posts/services/articleService";
import { createArticleFormData } from "@/features/posts/utils/articlePayload";
import { canEditArticle } from "@/features/posts/utils/articlePermissions";
import { validateArticle } from "@/features/posts/utils/articleValidator";

import "./PostEditor.css";

export default function PostEditor() {
  const { code } = useParams();
  const isExisting = Boolean(code);

  const [article, setArticle] = useState(createEmptyArticle);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(Boolean(code));
  const [revision, setRevision] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const requestInFlightRef = useRef(false);
  const submittedRef = useRef(false);
  const loadedRef = useRef(null);

  useEffect(() => {
    if (!code) return undefined;

    let cancelled = false;

    articleService
      .getDetail(code)
      .then((data) => {
        if (cancelled) return;

        loadedRef.current = { article: data, imageFile: data.imageUrl ?? null };
        setArticle(data);
        setImageFile(data.imageUrl ?? null);
      })
      .catch((error) => {
        if (!cancelled) {
          console.error("Không thể tải chi tiết bài viết:", error);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [code]);

  const markAsChanged = useCallback(() => {
    setRevision((currentRevision) => currentRevision + 1);
  }, []);

  const canEdit = isExisting && canEditArticle(article.status);
  const readOnly = isExisting && !isEditing;

  const handleArticleChange = useCallback(
    (updater) => {
      setArticle((previousArticle) => {
        const nextArticle =
          typeof updater === "function" ? updater(previousArticle) : updater;

        return {
          ...nextArticle,
          qualityChecked: false,
        };
      });
      markAsChanged();
    },
    [markAsChanged],
  );

  const handleImageChange = useCallback(
    (updater) => {
      setImageFile((previousImage) =>
        typeof updater === "function" ? updater(previousImage) : updater,
      );
      setArticle((previousArticle) => ({
        ...previousArticle,
        qualityChecked: false,
      }));
      markAsChanged();
    },
    [markAsChanged],
  );

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (loadedRef.current) {
      setArticle(loadedRef.current.article);
      setImageFile(loadedRef.current.imageFile);
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!validateArticle(article, imageFile) || requestInFlightRef.current) {
      return;
    }

    // Readers keep their place by contentVersion, which the server bumps when published
    // content changes, so this is not a silent edit.
    if (
      article.status === "published" &&
      !window.confirm(
        "Bài viết đang hiển thị trên ứng dụng. Lưu thay đổi sẽ đặt lại tiến độ đọc của người dùng. Tiếp tục?",
      )
    ) {
      return;
    }

    try {
      requestInFlightRef.current = true;
      setLoading(true);

      const formData = createArticleFormData(article, imageFile, {
        status: article.status,
        createdBy: article.createdBy,
      });

      const updated = await articleService.update(code, formData);

      loadedRef.current = {
        article: updated,
        imageFile: updated.imageUrl ?? null,
      };
      setArticle(updated);
      setImageFile(updated.imageUrl ?? null);
      setIsEditing(false);
      toast.success("Đã lưu thay đổi.");
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "Không thể lưu thay đổi bài viết.",
      );
    } finally {
      requestInFlightRef.current = false;
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateArticle(article, imageFile) || requestInFlightRef.current) {
      return;
    }

    try {
      requestInFlightRef.current = true;
      setLoading(true);

      const currentUsername = authService.getCurrentUser()?.username ?? "";
      const formData = createArticleFormData(article, imageFile, {
        status: "pending",
        createdBy: currentUsername,
      });

      await articleService.create(formData);
      submittedRef.current = true;
      setShowSubmitModal(true);
    } catch (error) {
      const message =
        error.response?.data?.message || "Không thể tạo bài viết.";
      window.alert(message);
    } finally {
      requestInFlightRef.current = false;
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);
      await articleService.updateStatus({
        code: article.code,
        status: "rejected",
      });
      setShowRejectModal(true);
    } catch (error) {
      console.error(error);
      window.alert(error.response?.data?.message || "Không thể từ chối bài viết.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setLoading(true);
      await articleService.updateStatus({
        code: article.code,
        status: "published",
      });
      setShowApproveModal(true);
    } catch (error) {
      console.error(error);
      window.alert(error.response?.data?.message || "Không thể duyệt bài viết.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editor-page">
      <div className="editor-header">
        <h1>
          {code
            ? `${isEditing ? "Chỉnh sửa" : "Chi tiết"} bài viết ${code}`
            : "Tạo bài viết mới"}
        </h1>
      </div>

      <div className="editor-layout">
        <div className="editor-left">
          <ArticleBasicInfo
            article={article}
            setArticle={handleArticleChange}
            imageFile={imageFile}
            setImageFile={handleImageChange}
            readOnly={readOnly}
            loading={loading}
          />

          <ContentEditor
            article={article}
            setArticle={handleArticleChange}
            readOnly={readOnly}
          />
        </div>

        <div className="editor-right">
          <Sidebar
            article={article}
            imageFile={imageFile}
            revision={revision}
            setArticle={handleArticleChange}
            setQualityChecked={setArticle}
            readOnly={readOnly}
          />
        </div>
      </div>

      <BottomActionBar
        loading={loading}
        onPreview={handlePreview}
        onSubmit={handleSubmit}
        onReject={handleReject}
        onApprove={handleApprove}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancelEdit={handleCancelEdit}
        canEdit={canEdit}
        isEditing={isEditing}
        isExisting={isExisting}
        readOnly={readOnly}
      />

      <ArticlePreviewModal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        article={article}
        imageFile={imageFile}
      />

      <SubmitSuccessModal
        open={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
      />
      <RejectSuccessModal
        open={showRejectModal}
        onClose={() => setShowRejectModal(false)}
      />
      <ApproveSuccessModal
        open={showApproveModal}
        onClose={() => setShowApproveModal(false)}
      />
    </div>
  );
}

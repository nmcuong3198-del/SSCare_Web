import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

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
import {
  getQualityTextSignature,
  validateArticle,
} from "@/features/posts/utils/articleValidator";

import "./PostEditor.css";

export default function PostEditor() {
  const { code } = useParams();
  const navigate = useNavigate();
  const isExisting = Boolean(code);

  const [article, setArticle] = useState(createEmptyArticle);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(Boolean(code));
  const [qualityRevision, setQualityRevision] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const requestInFlightRef = useRef(false);
  const loadedRef = useRef(null);
  const articleRef = useRef(article);

  useEffect(() => {
    articleRef.current = article;
  }, [article]);

  useEffect(() => {
    if (!code) return undefined;

    let cancelled = false;

    articleService
      .getDetail(code)
      .then((data) => {
        if (cancelled) return;

        const normalized = {
          ...data,
          anonymousAuthor: data.anonymousAuthor === true,
        };
        loadedRef.current = {
          article: normalized,
          imageFile: data.imageUrl ?? null,
        };
        setArticle(normalized);
        setImageFile(data.imageUrl ?? null);
      })
      .catch((error) => {
        if (!cancelled) {
          console.error("Không thể tải chi tiết bài viết:", error);
          toast.error(error.response?.data?.detail || "Không thể tải bài viết.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [code]);

  const canEdit = isExisting && canEditArticle(article.status);
  const readOnly = isExisting && !isEditing;

  const handleArticleChange = useCallback((updater) => {
    const previousArticle = articleRef.current;
    const nextArticle =
      typeof updater === "function" ? updater(previousArticle) : updater;

    const textChanged =
      getQualityTextSignature(previousArticle) !==
      getQualityTextSignature(nextArticle);

    const normalized = {
      ...nextArticle,
      qualityChecked: textChanged
        ? false
        : Boolean(nextArticle.qualityChecked),
    };

    articleRef.current = normalized;
    setArticle(normalized);
    if (textChanged) {
      setQualityRevision((current) => current + 1);
    }
  }, []);

  const handleQualityStateChange = useCallback((updater) => {
    const previousArticle = articleRef.current;
    const nextArticle =
      typeof updater === "function" ? updater(previousArticle) : updater;
    articleRef.current = nextArticle;
    setArticle(nextArticle);
  }, []);

  const handleImageChange = useCallback((updater) => {
    setImageFile((previousImage) =>
      typeof updater === "function" ? updater(previousImage) : updater,
    );
  }, []);

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
      setQualityRevision((current) => current + 1);
    }
    setIsEditing(false);
  };

  const persistArticle = async (status, { requireQuality, successMessage } = {}) => {
    if (
      !validateArticle(article, imageFile, { requireQuality }) ||
      requestInFlightRef.current
    ) {
      return null;
    }

    try {
      requestInFlightRef.current = true;
      setLoading(true);

      const formData = createArticleFormData(article, imageFile, { status });

      if (isExisting) {
        const updated = await articleService.update(code, formData);
        const normalized = {
          ...updated,
          anonymousAuthor: updated.anonymousAuthor === true,
        };
        loadedRef.current = {
          article: normalized,
          imageFile: updated.imageUrl ?? imageFile,
        };
        setArticle(normalized);
        setImageFile(updated.imageUrl ?? imageFile);
        setIsEditing(false);
        if (successMessage) toast.success(successMessage);
        return normalized;
      }

      const created = await articleService.create(formData);
      if (successMessage) toast.success(successMessage);
      return created;
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Không thể lưu bài viết.",
      );
      return null;
    } finally {
      requestInFlightRef.current = false;
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    const saved = await persistArticle("draft", {
      requireQuality: false,
      successMessage: "Đã lưu bài viết ở trạng thái bản nháp.",
    });

    if (saved && !isExisting) {
      navigate(`/posts/${saved.code}`);
    }
  };

  const handleSave = async () => {
    const status = article.status === "rejected" ? "draft" : article.status;
    await persistArticle(status || "draft", {
      requireQuality: status === "pending",
      successMessage: "Đã lưu thay đổi.",
    });
  };

  const handleSubmit = async () => {
    const saved = await persistArticle("pending", {
      requireQuality: true,
    });

    if (saved) {
      setShowSubmitModal(true);
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
      window.alert(error.response?.data?.detail || "Không thể từ chối bài viết.");
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
      window.alert(error.response?.data?.detail || "Không thể duyệt bài viết.");
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
            qualityRevision={qualityRevision}
            setArticle={handleArticleChange}
            setQualityChecked={handleQualityStateChange}
            readOnly={readOnly}
          />
        </div>
      </div>

      <BottomActionBar
        loading={loading}
        onPreview={handlePreview}
        onSubmit={handleSubmit}
        onSaveDraft={handleSaveDraft}
        onReject={handleReject}
        onApprove={handleApprove}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancelEdit={handleCancelEdit}
        canEdit={canEdit}
        isEditing={isEditing}
        isExisting={isExisting}
        readOnly={readOnly}
        articleStatus={article.status}
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

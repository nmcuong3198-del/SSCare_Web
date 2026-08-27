import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

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
import { validateArticle } from "@/features/posts/utils/articleValidator";

import "./PostEditor.css";

export default function PostEditor() {
  const { code } = useParams();
  const isViewMode = Boolean(code);

  const [article, setArticle] = useState(createEmptyArticle);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(Boolean(code));
  const [revision, setRevision] = useState(0);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const requestInFlightRef = useRef(false);
  const submittedRef = useRef(false);

  useEffect(() => {
    if (!code) return undefined;

    let cancelled = false;

    articleService
      .getDetail(code)
      .then((data) => {
        if (cancelled) return;

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
        <h1>{code ? `Chi tiết bài viết ${code}` : "Tạo bài viết mới"}</h1>
      </div>

      <div className="editor-layout">
        <div className="editor-left">
          <ArticleBasicInfo
            article={article}
            setArticle={handleArticleChange}
            imageFile={imageFile}
            setImageFile={handleImageChange}
            readOnly={isViewMode}
            loading={loading}
          />

          <ContentEditor
            article={article}
            setArticle={handleArticleChange}
            readOnly={isViewMode}
          />
        </div>

        <div className="editor-right">
          <Sidebar
            article={article}
            imageFile={imageFile}
            revision={revision}
            setArticle={handleArticleChange}
            setQualityChecked={setArticle}
            readOnly={isViewMode}
          />
        </div>
      </div>

      <BottomActionBar
        loading={loading}
        onPreview={handlePreview}
        onSubmit={handleSubmit}
        onReject={handleReject}
        onApprove={handleApprove}
        readOnly={isViewMode}
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

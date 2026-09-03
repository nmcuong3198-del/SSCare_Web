import { useEffect, useRef, useState } from "react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Palette,
  Quote,
  Redo2,
  Underline,
  Undo2,
} from "lucide-react";

import articleService from "@/features/posts/services/articleService";
import {
  clipboardHtmlToEditorHtml,
  closestEditableBlock,
  editorElementToMarkdown,
  markdownPlainTextLength,
  markdownToHtml,
} from "@/features/posts/utils/markdownEditor";

import "./RichTextMarkdownEditor.css";

function escapeEditorHtml(value) {
  return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
}

function execute(command, value = null) {
  if (typeof document === "undefined") return;
  // noinspection JSDeprecatedSymbols
  document.execCommand(command, false, value);
}

function ToolbarButton({ title, label, icon, disabled, onClick }) {
  return (
      <button
          type="button"
          title={title}
          aria-label={label}
          disabled={disabled}
          onMouseDown={(event) => event.preventDefault()}
          onClick={onClick}
      >
        {icon}
      </button>
  );
}

export default function RichTextMarkdownEditor({
                                                 value = "",
                                                 onChange,
                                                 readOnly = false,
                                                 disabled = false,
                                                 placeholder = "Nhập nội dung...",
                                                 minHeight = 140,
                                                 maxLength,
                                                 ariaLabel = "Nội dung bài viết",
                                               }) {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const lastEmittedValueRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    if (lastEmittedValueRef.current === value) {
      lastEmittedValueRef.current = null;
      return;
    }
    const nextHtml = markdownToHtml(value);
    if (editor.innerHTML !== nextHtml) editor.innerHTML = nextHtml;
  }, [value]);

  const emitMarkdown = () => {
    const editor = editorRef.current;
    if (!editor) return;
    const markdown = editorElementToMarkdown(editor);
    if (typeof maxLength === "number" && markdownPlainTextLength(markdown) > maxLength) {
      editor.innerHTML = markdownToHtml(value);
      setLimitReached(true);
      return;
    }
    setLimitReached(false);
    lastEmittedValueRef.current = markdown;
    onChange?.(markdown);
  };

  const runCommand = (command, commandValue = null) => {
    if (readOnly || disabled) return;
    editorRef.current?.focus();
    execute(command, commandValue);
    emitMarkdown();
  };

  const setBlockFormat = (tag) => {
    if (readOnly || disabled) return;
    editorRef.current?.focus();
    execute("formatBlock", tag);
    emitMarkdown();
  };

  const setAlignment = (alignment) => {
    if (readOnly || disabled) return;
    editorRef.current?.focus();
    const command = {
      left: "justifyLeft",
      center: "justifyCenter",
      right: "justifyRight",
      justify: "justifyFull",
    }[alignment];
    execute(command);
    emitMarkdown();
  };

  const toggleQuote = () => {
    if (readOnly || disabled) return;
    const editor = editorRef.current;
    editor?.focus();
    const currentBlock = closestEditableBlock(editor);
    execute("formatBlock", currentBlock?.tagName === "BLOCKQUOTE" ? "p" : "blockquote");
    emitMarkdown();
  };

  const addLink = () => {
    if (readOnly || disabled) return;
    editorRef.current?.focus();
    const selection = window.getSelection?.();
    const selectedText = selection?.toString()?.trim();
    if (!selectedText) {
      alert("Hãy bôi đen đoạn chữ cần gắn liên kết trước.");
      return;
    }
    const href = window.prompt("Nhập liên kết (https://...):", "https://");
    if (!href) return;
    if (!/^https:\/\//i.test(href.trim())) {
      alert("Liên kết phải bắt đầu bằng https://");
      return;
    }
    execute("createLink", href.trim());
    emitMarkdown();
  };

  const setTextColor = (event) => {
    if (readOnly || disabled) return;
    editorRef.current?.focus();
    execute("foreColor", event.target.value);
    emitMarkdown();
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || readOnly || disabled) return;
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn tệp ảnh.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      alert("Ảnh nội dung tối đa 8 MB.");
      return;
    }

    const alt = window.prompt("Mô tả ảnh (dùng cho khả năng truy cập):", file.name.replace(/\.[^.]+$/, ""))?.trim();
    if (!alt) return;

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append("image", file);
      formData.append("alt", alt);
      const response = await articleService.uploadContentImage(formData);
      const image = response?.data ?? response;
      if (!image?.url) {
        alert("API không trả về URL ảnh");
        return;
      }

      editorRef.current?.focus();
      const payload = JSON.stringify({
        assetId: image.assetId ?? null,
        url: image.url,
        width: image.width,
        height: image.height,
        alt: image.alt || alt,
        caption: image.caption ?? null,
        credit: image.credit ?? null,
      }).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
      execute(
          "insertHTML",
          `<figure class="sscare-inline-image" contenteditable="false" data-sscare-image="${payload}"><img src="${escapeEditorHtml(image.url)}" alt="${escapeEditorHtml(alt)}"><figcaption>${escapeEditorHtml(alt)}</figcaption></figure><p><br></p>`,
      );
      emitMarkdown();
    } catch (error) {
      alert(error?.response?.data?.message || error?.message || "Không upload được ảnh nội dung.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePaste = (event) => {
    if (readOnly || disabled) return;
    event.preventDefault();
    const clipboard = event.clipboardData;
    const plainText = (clipboard?.getData("text/plain") ?? "").replace(/\r\n?/g, "\n");
    const richHtml = clipboardHtmlToEditorHtml(clipboard?.getData("text/html") ?? "");
    if (!plainText && !richHtml) return;

    let selectedLength = 0;
    if (typeof maxLength === "number") {
      const selection = window.getSelection?.();
      const editor = editorRef.current;
      if (selection && selection.rangeCount > 0 && editor) {
        const range = selection.getRangeAt(0);
        if (editor.contains(range.startContainer) && editor.contains(range.endContainer)) selectedLength = selection.toString().length;
      }
      const currentLength = markdownPlainTextLength(value);
      const remaining = Math.max(0, maxLength - currentLength + selectedLength);
      if (remaining === 0) { setLimitReached(true); return; }
      if (plainText.length > remaining) {
        execute("insertText", plainText.slice(0, remaining));
        setLimitReached(true);
        emitMarkdown();
        return;
      }
    }
    setLimitReached(false);
    execute(richHtml ? "insertHTML" : "insertText", richHtml || plainText);
    emitMarkdown();
  };

  const handleKeyDown = (event) => {
    if (readOnly || disabled) return;
    if (event.key === "Tab") {
      event.preventDefault();
      execute("insertText", "  ");
      emitMarkdown();
    }
  };

  const showPlaceholder = !String(value ?? "").trim() && !isFocused;
  const visibleLength = markdownPlainTextLength(value);
  const toolbarDisabled = disabled || uploadingImage;
  const openImagePicker = () => {
    if (readOnly || disabled || uploadingImage) return;
    fileInputRef.current?.click();
  };

  return (
      <div className={`rich-markdown-editor${isFocused ? " rich-markdown-editor--focused" : ""}${readOnly ? " rich-markdown-editor--readonly" : ""}${disabled ? " rich-markdown-editor--disabled" : ""}`}>
        {!readOnly && (
            <div className="rich-markdown-editor__toolbar" role="toolbar" aria-label="Định dạng nội dung">
              <div className="rich-markdown-editor__toolbar-group">
                <ToolbarButton title="Tiêu đề lớn" label="Tiêu đề H1" icon={<Heading1 size={17} />} disabled={toolbarDisabled} onClick={() => setBlockFormat("h1")} />
                <ToolbarButton title="Tiêu đề vừa" label="Tiêu đề H2" icon={<Heading2 size={17} />} disabled={toolbarDisabled} onClick={() => setBlockFormat("h2")} />
                <ToolbarButton title="Tiêu đề nhỏ" label="Tiêu đề H3" icon={<Heading3 size={17} />} disabled={toolbarDisabled} onClick={() => setBlockFormat("h3")} />
              </div>
              <span className="rich-markdown-editor__divider" />
              <div className="rich-markdown-editor__toolbar-group">
                <ToolbarButton title="In đậm (Ctrl+B)" label="In đậm" icon={<Bold size={17} />} disabled={toolbarDisabled} onClick={() => runCommand("bold")} />
                <ToolbarButton title="In nghiêng (Ctrl+I)" label="In nghiêng" icon={<Italic size={17} />} disabled={toolbarDisabled} onClick={() => runCommand("italic")} />
                <ToolbarButton title="Gạch chân (Ctrl+U)" label="Gạch chân" icon={<Underline size={17} />} disabled={toolbarDisabled} onClick={() => runCommand("underline")} />
                <label className="rich-markdown-editor__color" title="Màu chữ">
                  <Palette size={17} />
                  <input type="color" defaultValue="#163C92" disabled={disabled} onChange={setTextColor} aria-label="Chọn màu chữ" />
                </label>
              </div>
              <span className="rich-markdown-editor__divider" />
              <div className="rich-markdown-editor__toolbar-group">
                <ToolbarButton title="Căn trái" label="Căn trái" icon={<AlignLeft size={17} />} disabled={toolbarDisabled} onClick={() => setAlignment("left")} />
                <ToolbarButton title="Căn giữa" label="Căn giữa" icon={<AlignCenter size={17} />} disabled={toolbarDisabled} onClick={() => setAlignment("center")} />
                <ToolbarButton title="Căn phải" label="Căn phải" icon={<AlignRight size={17} />} disabled={toolbarDisabled} onClick={() => setAlignment("right")} />
                <ToolbarButton title="Căn đều" label="Căn đều" icon={<AlignJustify size={17} />} disabled={toolbarDisabled} onClick={() => setAlignment("justify")} />
              </div>
              <span className="rich-markdown-editor__divider" />
              <div className="rich-markdown-editor__toolbar-group">
                <ToolbarButton title="Trích dẫn" label="Trích dẫn" icon={<Quote size={17} />} disabled={toolbarDisabled} onClick={toggleQuote} />
                <ToolbarButton title="Danh sách dấu chấm" label="Danh sách dấu chấm" icon={<List size={18} />} disabled={toolbarDisabled} onClick={() => runCommand("insertUnorderedList")} />
                <ToolbarButton title="Danh sách đánh số" label="Danh sách đánh số" icon={<ListOrdered size={18} />} disabled={toolbarDisabled} onClick={() => runCommand("insertOrderedList")} />
                <ToolbarButton title="Gắn liên kết" label="Gắn liên kết" icon={<Link2 size={17} />} disabled={toolbarDisabled} onClick={addLink} />
                <ToolbarButton title={uploadingImage ? "Đang tải ảnh..." : "Chèn ảnh vào nội dung"} label="Chèn ảnh" icon={<ImagePlus size={18} />} disabled={toolbarDisabled} onClick={openImagePicker} />
                <input ref={fileInputRef} className="rich-markdown-editor__file-input" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImageUpload} />
              </div>
              <span className="rich-markdown-editor__divider" />
              <div className="rich-markdown-editor__toolbar-group">
                <ToolbarButton title="Hoàn tác (Ctrl+Z)" label="Hoàn tác" icon={<Undo2 size={17} />} disabled={toolbarDisabled} onClick={() => runCommand("undo")} />
                <ToolbarButton title="Làm lại" label="Làm lại" icon={<Redo2 size={17} />} disabled={toolbarDisabled} onClick={() => runCommand("redo")} />
              </div>
            </div>
        )}

        <div className="rich-markdown-editor__surface">
          {showPlaceholder && <div className="rich-markdown-editor__placeholder" aria-hidden="true">{placeholder}</div>}
          <div
              ref={editorRef}
              className="rich-markdown-editor__content"
              style={{ minHeight }}
              contentEditable={!readOnly && !disabled}
              suppressContentEditableWarning
              role="textbox"
              aria-label={ariaLabel}
              aria-multiline="true"
              aria-readonly={readOnly || disabled}
              onInput={emitMarkdown}
              onBlur={() => setIsFocused(false)}
              onFocus={() => setIsFocused(true)}
              onPaste={handlePaste}
              onKeyDown={handleKeyDown}
          />
        </div>

        {!readOnly && typeof maxLength === "number" && (
            <div className="rich-markdown-editor__footer">
              <span className={limitReached ? "rich-markdown-editor__counter--error" : ""}>{visibleLength}/{maxLength}</span>
            </div>
        )}
      </div>
  );
}

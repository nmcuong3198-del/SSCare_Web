import { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Undo2,
} from "lucide-react";

import {
  clipboardHtmlToEditorHtml,
  closestEditableBlock,
  editorElementToMarkdown,
  markdownPlainTextLength,
  markdownToHtml,
} from "@/features/posts/utils/markdownEditor";

import "./RichTextMarkdownEditor.css";

function execute(command, value = null) {
  if (typeof document === "undefined") return;
  document.execCommand(command, false, value);
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
  const lastEmittedValueRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    if (lastEmittedValueRef.current === value) {
      lastEmittedValueRef.current = null;
      return;
    }

    const nextHtml = markdownToHtml(value);
    if (editor.innerHTML !== nextHtml) {
      editor.innerHTML = nextHtml;
    }
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

  const toggleQuote = () => {
    if (readOnly || disabled) return;
    const editor = editorRef.current;
    editor?.focus();
    const currentBlock = closestEditableBlock(editor);
    const isQuote = currentBlock?.tagName === "BLOCKQUOTE";
    execute("formatBlock", isQuote ? "p" : "blockquote");
    emitMarkdown();
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
      const selection = typeof window !== "undefined" ? window.getSelection?.() : null;
      const editor = editorRef.current;
      if (selection && selection.rangeCount > 0 && editor) {
        const range = selection.getRangeAt(0);
        if (editor.contains(range.startContainer) && editor.contains(range.endContainer)) {
          selectedLength = selection.toString().length;
        }
      }

      const currentLength = markdownPlainTextLength(value);
      const remaining = Math.max(0, maxLength - currentLength + selectedLength);
      if (remaining === 0) {
        setLimitReached(true);
        return;
      }

      // Preserve rich formatting when the whole copied fragment fits the field limit.
      // If it does not fit, insert the allowed text prefix rather than losing the whole paste.
      if (plainText.length > remaining) {
        execute("insertText", plainText.slice(0, remaining));
        setLimitReached(true);
        emitMarkdown();
        return;
      }
    }

    setLimitReached(false);
    if (richHtml) {
      execute("insertHTML", richHtml);
    } else {
      execute("insertText", plainText);
    }
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

  return (
    <div
      className={`rich-markdown-editor${isFocused ? " rich-markdown-editor--focused" : ""}${
        readOnly ? " rich-markdown-editor--readonly" : ""
      }${disabled ? " rich-markdown-editor--disabled" : ""}`}
    >
      {!readOnly && (
        <div className="rich-markdown-editor__toolbar" role="toolbar" aria-label="Định dạng nội dung">
          <button
            type="button"
            title="In đậm (Ctrl+B)"
            aria-label="In đậm"
            disabled={disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runCommand("bold")}
          >
            <Bold size={17} />
          </button>
          <button
            type="button"
            title="In nghiêng (Ctrl+I)"
            aria-label="In nghiêng"
            disabled={disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runCommand("italic")}
          >
            <Italic size={17} />
          </button>
          <span className="rich-markdown-editor__divider" aria-hidden="true" />
          <button
            type="button"
            title="Trích dẫn"
            aria-label="Trích dẫn"
            disabled={disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={toggleQuote}
          >
            <Quote size={17} />
          </button>
          <button
            type="button"
            title="Danh sách dấu chấm"
            aria-label="Danh sách dấu chấm"
            disabled={disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runCommand("insertUnorderedList")}
          >
            <List size={18} />
          </button>
          <button
            type="button"
            title="Danh sách đánh số"
            aria-label="Danh sách đánh số"
            disabled={disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runCommand("insertOrderedList")}
          >
            <ListOrdered size={18} />
          </button>
          <span className="rich-markdown-editor__divider" aria-hidden="true" />
          <button
            type="button"
            title="Hoàn tác (Ctrl+Z)"
            aria-label="Hoàn tác"
            disabled={disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runCommand("undo")}
          >
            <Undo2 size={17} />
          </button>
          <button
            type="button"
            title="Làm lại"
            aria-label="Làm lại"
            disabled={disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runCommand("redo")}
          >
            <Redo2 size={17} />
          </button>
        </div>
      )}

      <div className="rich-markdown-editor__surface">
        {showPlaceholder && (
          <div className="rich-markdown-editor__placeholder" aria-hidden="true">
            {placeholder}
          </div>
        )}
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
          <span className={limitReached ? "rich-markdown-editor__counter--error" : ""}>
            {visibleLength}/{maxLength}
          </span>
        </div>
      )}
    </div>
  );
}

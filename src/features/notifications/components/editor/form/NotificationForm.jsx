import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import EmojiPicker from "emoji-picker-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useEffect, useRef, useState } from "react";

import NotificationTypeSelect from "@/features/notifications/components/editor/basic/NotificationTypeSelect";
import NotificationFooter from "@/features/notifications/components/editor/footer/NotificationBottomBar";
import ReceiverSelect from "@/features/notifications/components/editor/receiver/ReceiverSelect";

import "./NotificationForm.css";

const MAX_LENGTH = 1000;
const SEND_NOW_VALUE = "NOW";
const HOUR_OPTIONS = Array.from({ length: 24 }, (_, hour) => hour);

const startOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

const getNextOccurrenceForHour = (hour) => {
  const now = new Date();
  const date = new Date(now);
  date.setHours(hour, 0, 0, 0);
  if (date.getTime() <= now.getTime()) {
    date.setDate(date.getDate() + 1);
  }
  return date;
};

const formatLocalDateTime = (date) => {
  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const HH = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");

  return `${yyyy}-${MM}-${dd}T${HH}:${mm}`;
};

const parseScheduleDate = (scheduleTime) => {
  if (!scheduleTime) return null;
  const parsed = new Date(scheduleTime);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export default function NotificationForm({
  notification,
  setNotification,
  onCreate,
  onUpdate,
  onSend,
  isCreated = false,
  notificationSent = false,
}) {
  const [showEmoji, setShowEmoji] = useState(false);
  const emojiRef = useRef(null);

  const scheduledDate = parseScheduleDate(notification.scheduleTime);
  const isSendNow = !scheduledDate;
  const currentScheduleDate = scheduledDate || new Date();
  const selectedHour = scheduledDate
    ? String(scheduledDate.getHours())
    : SEND_NOW_VALUE;

  const editor = useEditor({
    extensions: [StarterKit],
    content: notification.content,

    onUpdate: ({ editor: currentEditor }) => {
      const text = currentEditor.getText();
      if (text.length > MAX_LENGTH) {
        const limited = text.slice(0, MAX_LENGTH);
        currentEditor.commands.setContent(limited, { emitUpdate: false });
        setNotification((prev) => ({ ...prev, content: limited }));
        return;
      }
      setNotification((prev) => ({
        ...prev,
        content: text,
      }));
    },
  });

  useEffect(() => {
    if (!editor) return;

    const nextContent = notification.content || "";
    if (editor.getText() !== nextContent) {
      editor.commands.setContent(nextContent, { emitUpdate: false });
    }
  }, [editor, notification.content]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmoji(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEmojiClick = (emojiData) => {
    editor?.chain().focus().insertContent(emojiData.emoji).run();
    setShowEmoji(false);
  };

  const handleTitleChange = (event) => {
    setNotification((prev) => ({
      ...prev,
      title: event.target.value,
    }));
  };

  const updateScheduleTime = (newDate) => {
    setNotification((prev) => ({
      ...prev,
      scheduleTime: newDate ? formatLocalDateTime(newDate) : "",
    }));
  };

  const handleHourChange = (event) => {
    const value = event.target.value;

    if (value === SEND_NOW_VALUE) {
      updateScheduleTime(null);
      return;
    }

    const hour = Number(value);
    if (!Number.isInteger(hour) || hour < 0 || hour > 23) return;

    if (!scheduledDate) {
      updateScheduleTime(getNextOccurrenceForHour(hour));
      return;
    }

    const next = new Date(scheduledDate);
    next.setHours(hour, 0, 0, 0);
    updateScheduleTime(next);
  };

  const handleDateChange = (date) => {
    if (!date || isSendNow) return;

    const next = new Date(currentScheduleDate);
    next.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    next.setSeconds(0, 0);
    updateScheduleTime(next);
  };

  return (
    <div className="notification-form-card">
      <div className="card-header" />

      <div className="card-body">
        <div className="title-section">
          <label htmlFor="notification-title">Tiêu đề thông báo</label>
          <input
            id="notification-title"
            type="text"
            className="notification-title-input"
            placeholder="Nhập tiêu đề thông báo..."
            value={notification.title || ""}
            maxLength={100}
            onChange={handleTitleChange}
          />
        </div>

        <div className="editor-section">
          <label>Nội dung thông báo</label>

          <div className="notification-editor">
            <div className="noti-editor-header">
              <button
                type="button"
                className="emoji-button"
                onClick={() => setShowEmoji(!showEmoji)}
              >
                😊
              </button>

              {showEmoji && (
                <div className="emoji-picker-wrapper" ref={emojiRef}>
                  <EmojiPicker
                    width={320}
                    height={380}
                    onEmojiClick={handleEmojiClick}
                  />
                </div>
              )}
            </div>

            <EditorContent editor={editor} />

            <div className="editor-bottom">
              <span>{editor?.getText().length || 0}/{MAX_LENGTH}</span>
            </div>
          </div>

          <div className="select-row">
            <NotificationTypeSelect
              notification={notification}
              setNotification={setNotification}
            />

            <ReceiverSelect
              notification={notification}
              setNotification={setNotification}
            />
          </div>
        </div>

        <div className="notification-schedule">
          <div className="schedule-picker-row">
            <div className="schedule-picker">
              <label>📅 Ngày gửi thông báo</label>

              <DatePicker
                selected={currentScheduleDate}
                minDate={startOfToday()}
                dateFormat="dd/MM/yyyy"
                showMonthYearDropdown
                disabled={isSendNow || notificationSent}
                className="schedule-datepicker"
                onChange={handleDateChange}
              />
            </div>

            <div className="schedule-picker">
              <label htmlFor="schedule-hour">🕑 Vào lúc</label>

              <div className="schedule-time-select-wrapper">
                <select
                  id="schedule-hour"
                  className="schedule-time-select"
                  value={selectedHour}
                  onChange={handleHourChange}
                  disabled={notificationSent}
                  aria-label="Thời điểm gửi thông báo"
                >
                  <option value={SEND_NOW_VALUE}>Ngay bây giờ</option>
                  {HOUR_OPTIONS.map((hour) => (
                    <option key={hour} value={hour}>
                      {String(hour).padStart(2, "0")}:00
                    </option>
                  ))}
                </select>
              </div>
              <span className="schedule-hint">
                {isSendNow
                  ? "Thông báo sẽ được gửi ngay khi bạn bấm Gửi thông báo."
                  : "Chọn ngày và giờ để backend tự động gửi thông báo."}
              </span>
            </div>
          </div>
        </div>

        <NotificationFooter
          onCreate={onCreate}
          onUpdate={onUpdate}
          onSend={onSend}
          isCreated={isCreated}
          notificationSent={notificationSent}
        />
      </div>
    </div>
  );
}

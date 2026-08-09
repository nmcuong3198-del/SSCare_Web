import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import EmojiPicker from "emoji-picker-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useEffect, useRef, useState } from "react";

import NotificationTypeSelect from "@/features/notifications/components/editor/basic/NotificationTypeSelect";
import ReceiverSelect from "@/features/notifications/components/editor/receiver/ReceiverSelect";
import NotificationFooter from "@/features/notifications/components/editor/footer/NotificationBottomBar";

import "./NotificationForm.css";

const MAX_LENGTH = 1000;

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, hour) => ({
  value: hour,
  label: `${String(hour).padStart(2, "0")}:00`,
}));

const getDefaultScheduleDate = () => {
  const date = new Date();
  date.setHours(2, 0, 0, 0);

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

  const parsedScheduleDate = notification.scheduleTime
    ? new Date(notification.scheduleTime)
    : getDefaultScheduleDate();

  const currentScheduleDate = Number.isNaN(parsedScheduleDate.getTime())
    ? getDefaultScheduleDate()
    : parsedScheduleDate;

  const editor = useEditor({
    extensions: [StarterKit],
    content: notification.content,

    onUpdate: ({ editor: currentEditor }) => {
      setNotification((prev) => ({
        ...prev,
        content: currentEditor.getText(),
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
    if (!notification.scheduleTime) {
      setNotification((prev) => ({
        ...prev,
        scheduleTime: formatLocalDateTime(getDefaultScheduleDate()),
      }));

      return;
    }

    const scheduleDate = new Date(notification.scheduleTime);

    if (
      !Number.isNaN(scheduleDate.getTime()) &&
      (scheduleDate.getMinutes() !== 0 ||
        scheduleDate.getSeconds() !== 0 ||
        scheduleDate.getMilliseconds() !== 0)
    ) {
      scheduleDate.setMinutes(0, 0, 0);

      setNotification((prev) => ({
        ...prev,
        scheduleTime: formatLocalDateTime(scheduleDate),
      }));
    }
  }, [notification.scheduleTime, setNotification]);

  // Click ngoài popup thì đóng
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
      scheduleTime: formatLocalDateTime(newDate),
    }));
  };

  const handleHourChange = (event) => {
    const selectedHour = Number(event.target.value);
    const newDate = new Date(currentScheduleDate);

    newDate.setHours(selectedHour, 0, 0, 0);
    updateScheduleTime(newDate);
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
              <span>
                {editor?.getText().length || 0}/{MAX_LENGTH}
              </span>
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
                minDate={new Date()}
                dateFormat="dd/MM/yyyy"
                className="schedule-datepicker"
                onChange={(date) => {
                  if (!date) return;

                  const newDate = new Date(currentScheduleDate);

                  newDate.setFullYear(date.getFullYear());
                  newDate.setMonth(date.getMonth());
                  newDate.setDate(date.getDate());

                  updateScheduleTime(newDate);
                }}
              />
            </div>

            <div className="schedule-picker">
              <label htmlFor="schedule-hour">🕑 Vào lúc</label>

              <div className="schedule-time-select-wrapper">
                <select
                  id="schedule-hour"
                  className="schedule-time-select"
                  value={currentScheduleDate.getHours()}
                  onChange={handleHourChange}
                >
                  {HOUR_OPTIONS.map((hour) => (
                    <option key={hour.value} value={hour.value}>
                      {hour.label}
                    </option>
                  ))}
                </select>
              </div>
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
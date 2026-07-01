import NotificationBell from "../components/NotificationBell";

function Notifications() {
  return (
    <div
      className="notification-page"
      style={{
        maxWidth: "700px",
        margin: "20px auto",
        padding: "20px",
      }}
    >
      <NotificationBell pageMode={true} />
    </div>
  );
}

export default Notifications;
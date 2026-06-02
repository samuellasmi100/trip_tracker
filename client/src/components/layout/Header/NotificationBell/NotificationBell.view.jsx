import React from "react";
import { Badge, IconButton, Typography, Button, ClickAwayListener } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import CloseIcon from "@mui/icons-material/Close";
import { useStyles } from "./NotificationBell.style";

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "עכשיו";
  if (mins < 60) return `לפני ${mins} דקות`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `לפני ${hrs} שעות`;
  const days = Math.floor(hrs / 24);
  return `לפני ${days} ימים`;
};

function NotificationBellView({ unreadCount, notifications, isOpen, handleBellClick, handleMarkAllRead, handleDismiss, handleClearAll, handleClickAway }) {
  const classes = useStyles();

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div style={{ position: "relative" }}>
        <Badge
          badgeContent={unreadCount}
          className={classes.badge}
          invisible={unreadCount === 0}
        >
          <IconButton className={classes.bellButton} onClick={handleBellClick}>
            {unreadCount > 0 ? (
              <NotificationsIcon className={`${classes.bellIcon} ${classes.bellIconActive}`} />
            ) : (
              <NotificationsNoneIcon className={classes.bellIcon} />
            )}
          </IconButton>
        </Badge>

        {isOpen && (
          <div className={classes.dropdown}>
            <div className={classes.dropdownHeader}>
              <Typography className={classes.dropdownTitle}>
                התראות {unreadCount > 0 && `(${unreadCount} חדשות)`}
              </Typography>
              {unreadCount > 0 && (
                <Button className={classes.markReadBtn} onClick={handleMarkAllRead}>
                  סמן הכל כנקרא
                </Button>
              )}
            </div>

            <div className={classes.list}>
              {notifications.length === 0 ? (
                <Typography className={classes.emptyState}>אין התראות</Typography>
              ) : (
                notifications.map((n) => {
                  // Subtle start-edge accent for lead notifications: green for a
                  // new lead, red for a returning one. Other types stay neutral.
                  const accent =
                    n.type === "new_lead"
                      ? "#22c55e"
                      : n.type === "returning_lead"
                        ? "#ef4444"
                        : null;
                  return (
                  <div
                    key={n.id}
                    className={`${classes.notifItem} ${!n.is_read ? classes.notifItemUnread : ""}`}
                    style={accent ? { borderInlineStart: `3px solid ${accent}` } : undefined}
                  >
                    <div className={classes.notifTop}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                        {!n.is_read && <div className={classes.unreadDot} />}
                        <Typography className={classes.notifTitle}>{n.title}</Typography>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "2px", flexShrink: 0 }}>
                        <Typography className={classes.notifTime}>{timeAgo(n.created_at)}</Typography>
                        <IconButton
                          className={classes.dismissBtn}
                          onClick={() => handleDismiss(n.id)}
                          aria-label="הסר התראה"
                        >
                          <CloseIcon className={classes.dismissIcon} />
                        </IconButton>
                      </div>
                    </div>
                    {n.message && (
                      <Typography className={classes.notifMessage}>{n.message}</Typography>
                    )}
                    {n.vacation_name && (
                      <Typography className={classes.notifVacation}>{n.vacation_name}</Typography>
                    )}
                  </div>
                  );
                })
              )}
            </div>

            {notifications.length > 0 && (
              <div className={classes.dropdownFooter}>
                <Button className={classes.clearAllBtn} onClick={handleClearAll}>
                  נקה הכל
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
}

export default NotificationBellView;

"use client";
import { useState } from "react";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: "John Doe",
    email: "user@pizza.com",
    phone: "+91 9876543210",
    address: "123 Main Street, Mumbai, Maharashtra",
  });

  const [formData, setFormData] = useState({ ...user });

  const handleSave = () => {
    setUser(formData);
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={avatarContainerStyle}>
            <div style={avatarStyle}>👤</div>
            <div style={avatarRing}></div>
          </div>
          <h1 style={titleStyle}>My Profile</h1>
          <p style={subtitleStyle}>Manage your personal information</p>
        </div>

        {/* Profile Card */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <h2 style={cardTitleStyle}>Personal Information</h2>
            <button
              style={editButtonStyle(isEditing)}
              onClick={() => {
                if (isEditing) {
                  setFormData({ ...user });
                }
                setIsEditing(!isEditing);
              }}
            >
              {isEditing ? "✕ Cancel" : "✎ Edit Profile"}
            </button>
          </div>

          <div style={infoGridStyle}>
            {/* Name */}
            <div style={infoItemStyle}>
              <label style={labelStyle}>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  style={inputStyle}
                />
              ) : (
                <div style={valueContainerStyle}>
                  <span style={iconStyle}>👤</span>
                  <span style={valueStyle}>{user.name}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div style={infoItemStyle}>
              <label style={labelStyle}>Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  style={inputStyle}
                />
              ) : (
                <div style={valueContainerStyle}>
                  <span style={iconStyle}>📧</span>
                  <span style={valueStyle}>{user.email}</span>
                </div>
              )}
            </div>

            {/* Phone */}
            <div style={infoItemStyle}>
              <label style={labelStyle}>Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  style={inputStyle}
                />
              ) : (
                <div style={valueContainerStyle}>
                  <span style={iconStyle}>📱</span>
                  <span style={valueStyle}>{user.phone}</span>
                </div>
              )}
            </div>

            {/* Address */}
            <div style={infoItemStyle}>
              <label style={labelStyle}>Delivery Address</label>
              {isEditing ? (
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  style={textareaStyle}
                  rows={3}
                />
              ) : (
                <div style={valueContainerStyle}>
                  <span style={iconStyle}>📍</span>
                  <span style={valueStyle}>{user.address}</span>
                </div>
              )}
            </div>
          </div>

          {isEditing && (
            <div style={buttonGroupStyle}>
              <button style={saveButtonStyle} onClick={handleSave}>
                ✓ Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={actionsContainerStyle}>
          <h3 style={actionsTitleStyle}>Quick Actions</h3>
          <div style={actionsGridStyle}>
            <a href="/orders" style={actionCardStyle}>
              <span style={actionIconStyle}>📦</span>
              <span style={actionLabelStyle}>My Orders</span>
              <span style={actionArrowStyle}>→</span>
            </a>
            <a href="/cart" style={actionCardStyle}>
              <span style={actionIconStyle}>🛒</span>
              <span style={actionLabelStyle}>Shopping Cart</span>
              <span style={actionArrowStyle}>→</span>
            </a>
            <a href="/menu" style={actionCardStyle}>
              <span style={actionIconStyle}>🍕</span>
              <span style={actionLabelStyle}>Browse Menu</span>
              <span style={actionArrowStyle}>→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===============================
   STYLES
================================ */
const pageStyle = {
  minHeight: "100vh",
  background: "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
  padding: "40px 20px",
  fontFamily: "'Segoe UI', system-ui, sans-serif",
};

const containerStyle = {
  maxWidth: "700px",
  margin: "0 auto",
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "32px",
};

const avatarContainerStyle = {
  position: "relative",
  display: "inline-block",
  marginBottom: "16px",
};

const avatarStyle = {
  width: "100px",
  height: "100px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "45px",
  color: "#fff",
  boxShadow: "0 10px 30px rgba(102, 126, 234, 0.4)",
};

const avatarRing = {
  position: "absolute",
  top: "-5px",
  left: "-5px",
  right: "-5px",
  bottom: "-5px",
  borderRadius: "50%",
  border: "3px solid #667eea",
  borderStyle: "dashed",
  animation: "spin 10s linear infinite",
};

const titleStyle = {
  fontSize: "32px",
  fontWeight: "800",
  color: "#1e293b",
  margin: "0 0 8px 0",
};

const subtitleStyle = {
  fontSize: "16px",
  color: "#64748b",
  margin: 0,
};

const cardStyle = {
  background: "#fff",
  borderRadius: "24px",
  padding: "32px",
  boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
  marginBottom: "24px",
};

const cardHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "28px",
  paddingBottom: "16px",
  borderBottom: "1px solid #e2e8f0",
};

const cardTitleStyle = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#1e293b",
  margin: 0,
};

const editButtonStyle = (isEditing) => ({
  padding: "10px 18px",
  borderRadius: "12px",
  border: "none",
  background: isEditing
    ? "#ef4444"
    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "#fff",
  fontWeight: "600",
  fontSize: "14px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: isEditing ? "none" : "0 4px 15px rgba(102, 126, 234, 0.4)",
});

const infoGridStyle = {
  display: "grid",
  gap: "20px",
};

const infoItemStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const labelStyle = {
  fontSize: "13px",
  fontWeight: "600",
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const valueContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "14px 18px",
  background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
  borderRadius: "14px",
  border: "1px solid #e2e8f0",
};

const iconStyle = {
  fontSize: "20px",
};

const valueStyle = {
  fontSize: "16px",
  fontWeight: "500",
  color: "#1e293b",
};

const inputStyle = {
  padding: "14px 18px",
  fontSize: "16px",
  fontWeight: "500",
  color: "#1e293b",
  border: "2px solid #667eea",
  borderRadius: "14px",
  outline: "none",
  background: "#fff",
  transition: "all 0.3s ease",
};

const textareaStyle = {
  padding: "14px 18px",
  fontSize: "16px",
  fontWeight: "500",
  color: "#1e293b",
  border: "2px solid #667eea",
  borderRadius: "14px",
  outline: "none",
  background: "#fff",
  resize: "vertical",
  fontFamily: "inherit",
  transition: "all 0.3s ease",
};

const buttonGroupStyle = {
  marginTop: "28px",
  display: "flex",
  justifyContent: "flex-end",
};

const saveButtonStyle = {
  padding: "14px 32px",
  borderRadius: "14px",
  border: "none",
  background: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
  color: "#fff",
  fontWeight: "700",
  fontSize: "16px",
  cursor: "pointer",
  boxShadow: "0 4px 15px rgba(22, 163, 74, 0.4)",
  transition: "all 0.3s ease",
};

const actionsContainerStyle = {
  marginTop: "24px",
};

const actionsTitleStyle = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#1e293b",
  marginBottom: "16px",
};

const actionsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "16px",
};

const actionCardStyle = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  padding: "20px",
  background: "#fff",
  borderRadius: "16px",
  textDecoration: "none",
  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
  transition: "all 0.3s ease",
  border: "1px solid #e2e8f0",
};

const actionIconStyle = {
  fontSize: "28px",
};

const actionLabelStyle = {
  flex: 1,
  fontSize: "15px",
  fontWeight: "600",
  color: "#1e293b",
};

const actionArrowStyle = {
  fontSize: "18px",
  color: "#94a3b8",
  transition: "transform 0.3s ease",
};

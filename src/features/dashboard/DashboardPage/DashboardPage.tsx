export default function DashboardPage() {
  const cardStyle = {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  } as const;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {/* ===== Stats Section ===== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        {[
          { label: "Active Users", value: 354 },
          { label: "Products", value: 354 },
          { label: "Active Users", value: 354 },
          { label: "Total Video", value: 55 },
        ].map((item, index) => (
          <div
            key={index}
            style={{
              background: "#e5e7eb",
              padding: "24px",
              borderRadius: "12px",
            }}
          >
            <p style={{ margin: 0, fontSize: "14px" }}>{item.label}</p>
            <h2 style={{ marginTop: "12px", fontSize: "28px" }}>
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* ===== Main Grid ===== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "20px",
        }}
      >
        {/* ===== LEFT SIDE ===== */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Recent Assessments */}
          <div
            style={{
              ...cardStyle,
              height: "250px",
            }}
          >
            <h4 style={{ margin: 0 }}>Recent Assessments</h4>
          </div>

          {/* Top Sales */}
          <div>
            <h4 style={{ marginBottom: "12px" }}>
              Top Sale's Product
            </h4>

            <div style={{ display: "flex", gap: "16px" }}>
              {[1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  style={{
                    ...cardStyle,
                    padding: "16px",
                  }}
                >
                  <img
                    src="https://via.placeholder.com/100x150"
                    alt="product"
                    style={{ display: "block" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== RIGHT SIDE ===== */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Video Section */}
          <div style={cardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h4 style={{ margin: 0 }}>
                Proper Facial Products Application Video Tutorial
              </h4>

              <button
                style={{
                  background: "#e91e63",
                  color: "#fff",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                + Add New
              </button>
            </div>

            {[1, 2].map((_, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "12px",
                  marginTop: "16px",
                }}
              >
                <img
                  src="https://via.placeholder.com/120x80"
                  alt="video"
                  style={{ borderRadius: "8px" }}
                />
                <div>
                  <h5 style={{ margin: 0 }}>
                    4-Step Skincare
                  </h5>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      color: "#555",
                    }}
                  >
                    The FASTEST skincare routine for busy
                    people
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Logs */}
          <div style={cardStyle}>
            <h4 style={{ margin: 0 }}>Recent Logs</h4>

            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginTop: "16px",
                }}
              >
                <img
                  src="https://via.placeholder.com/40"
                  alt="avatar"
                  style={{ borderRadius: "50%" }}
                />

                <div>
                  <strong style={{ fontSize: "14px" }}>
                    John Doe Labador Jr.
                  </strong>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "12px",
                      color: "#777",
                    }}
                  >
                    johndoe@gmail.com
                  </p>
                </div>

                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "12px",
                    color: "#777",
                  }}
                >
                  {i + 1} min ago
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive Fix */}
      <style>
        {`
          @media (max-width: 1024px) {
            .main-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
}
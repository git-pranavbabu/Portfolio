import { ImageResponse } from "next/og";

export const alt = "Pranav Babu — AI Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          background: "#fafafa",
          padding: 80,
          color: "#111111",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 28,
            fontWeight: 600,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "#2563eb",
              color: "white",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            PB
          </div>
          <div style={{ display: "flex" }}>pranavbabu.xyz</div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 84,
              fontWeight: 700,
              lineHeight: 1.05,
            }}
          >
            Pranav Babu
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 38,
              color: "#6b7280",
              lineHeight: 1.3,
              maxWidth: 1000,
            }}
          >
            AI Engineer · Agentic systems, RAG pipelines, and production AI
            tools.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 24,
            color: "#2563eb",
            fontWeight: 500,
          }}
        >
          <div style={{ display: "flex" }}>
            Currently at Hykon India Limited
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

export function BackgroundBlobs() {
  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden
    >
      <div
        className="clay-blob clay-blob-violet clay-float"
        style={{
          width: "55vw",
          height: "55vw",
          top: "-15%",
          left: "-10%",
          opacity: 0.5,
        }}
      />
      <div
        className="clay-blob clay-blob-pink clay-float-delayed"
        style={{
          width: "50vw",
          height: "50vw",
          top: "20%",
          right: "-15%",
          opacity: 0.4,
        }}
      />
      <div
        className="clay-blob clay-blob-blue clay-float-slow"
        style={{
          width: "45vw",
          height: "45vw",
          bottom: "-10%",
          left: "20%",
          opacity: 0.35,
        }}
      />
      <div
        className="clay-blob clay-blob-amber clay-float"
        style={{
          width: "35vw",
          height: "35vw",
          top: "60%",
          right: "10%",
          opacity: 0.25,
        }}
      />
    </div>
  );
}

export default function FlashOverlay({ show }) {
  return (
    <div
      className={[
        "pointer-events-none fixed inset-0 transition-opacity duration-300",
        show ? "opacity-100" : "opacity-0",
      ].join(" ")}
      style={{
        background:
          "radial-gradient(circle at center, rgba(255,255,255,0.55) 0%, rgba(255,215,0,0.18) 35%, rgba(0,0,0,0.0) 70%)",
      }}
    />
  );
}

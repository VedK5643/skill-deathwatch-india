export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid #E8E4DC", backgroundColor: "#FFFFFE" }}>
      <div className="flex items-center justify-between h-12 px-6">
        <span style={{ fontSize: "12px", color: "#A8A29E" }}>Powered by Adzuna Jobs API</span>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "12px",
            color: "#A8A29E",
            textDecoration: "none",
            transition: "color 200ms",
          }}
          className="hover:text-foreground"
        >
          Open source on GitHub
        </a>
      </div>
    </footer>
  );
}

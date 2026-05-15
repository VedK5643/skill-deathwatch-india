import { useState, useEffect } from "react";
import { Link } from "wouter";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState("12 May");
  const [isRecent, setIsRecent] = useState(true);

  useEffect(() => {
    // In production, this would fetch from Supabase
    // For now, we'll use a placeholder date
    const today = new Date();
    const daysAgo = Math.floor(Math.random() * 10);
    setIsRecent(daysAgo < 7);
    
    if (daysAgo === 0) {
      setLastUpdate("Today");
    } else if (daysAgo === 1) {
      setLastUpdate("Yesterday");
    } else {
      const date = new Date(today);
      date.setDate(date.getDate() - daysAgo);
      setLastUpdate(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
  }, []);

  const navLinks = [
    { label: "Dashboard", href: "/" },
    { label: "Compare", href: "/compare" },
    { label: "Weekly", href: "/weekly" },
    { label: "About", href: "/about" },
  ];

  return (
    <nav style={{ borderBottom: "1px solid #E8E4DC", backgroundColor: "#FFFFFE" }}>
      <div className="flex items-center justify-between h-12 px-6">
        {/* Left: Logo */}
        <Link href="/">
          <a className="flex items-center gap-2 no-underline">
            {/* Amber rounded square with chart icon */}
            <div
              style={{
                width: "22px",
                height: "22px",
                backgroundColor: "#D97706",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polyline
                  points="1,10 4,6 8,8 11,2"
                  stroke="white"
                  strokeWidth="1.2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#1C1917" }}>
              Skill Deathwatch India
            </span>
          </a>
        </Link>

        {/* Center: Nav Links (Desktop) */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <a
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#78716C",
                  textDecoration: "none",
                  transition: "color 200ms",
                }}
                className="hover:text-foreground"
              >
                {link.label}
              </a>
            </Link>
          ))}
        </div>

        {/* Right: Update Status + Mobile Menu */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: isRecent ? "#16A34A" : "#F59E0B",
              }}
            ></div>
            <span style={{ fontSize: "11px", color: "#A8A29E" }}>Updated {lastUpdate}</span>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col gap-1 p-1"
            aria-label="Toggle menu"
            style={{ backgroundColor: "transparent", border: "none" }}
          >
            <div style={{ width: "20px", height: "2px", backgroundColor: "#1C1917" }}></div>
            <div style={{ width: "20px", height: "2px", backgroundColor: "#1C1917" }}></div>
            <div style={{ width: "20px", height: "2px", backgroundColor: "#1C1917" }}></div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div style={{ borderTop: "1px solid #E8E4DC", backgroundColor: "#F5F3EE" }}>
          <div className="flex flex-col p-4 gap-3">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#78716C",
                    textDecoration: "none",
                    display: "block",
                  }}
                  className="hover:text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default function About() {
  return (
    <div style={{ backgroundColor: "#FAFAF8", color: "#1C1917", minHeight: "100vh" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 600, color: "#1C1917", marginBottom: "32px", margin: 0 }}>
          About
        </h1>

        {/* What This Is */}
        <section style={{ marginBottom: "32px" }}>
          <h2
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#A8A29E",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "12px",
              margin: 0,
            }}
          >
            What this is
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "#78716C",
              lineHeight: "1.7",
              marginBottom: "16px",
              margin: 0,
            }}
          >
            Skill Deathwatch India tracks the weekly demand for 40 critical tech skills across
            India's job market. We measure demand by counting job listings on Adzuna, updated
            every Monday morning.
          </p>
          <p
            style={{
              fontSize: "15px",
              color: "#78716C",
              lineHeight: "1.7",
              margin: 0,
            }}
          >
            This is a real-time indicator of which skills are hiring, which are cooling, and
            which are experiencing unexpected shifts.
          </p>
        </section>

        {/* How Data Is Collected */}
        <section style={{ marginBottom: "32px" }}>
          <h2
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#A8A29E",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "12px",
              margin: 0,
            }}
          >
            How the data is collected
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "#78716C",
              lineHeight: "1.7",
              margin: 0,
            }}
          >
            Every Monday at 6 AM IST, a GitHub Actions cron job queries the Adzuna Jobs API for
            each of the 40 tracked skills. The job count for each skill is recorded and stored in
            Supabase. This automated pipeline has been running continuously since the project
            launch, creating a historical record of skill demand over time.
          </p>
        </section>

        {/* What The Numbers Mean */}
        <section style={{ marginBottom: "32px" }}>
          <h2
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#A8A29E",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "12px",
              margin: 0,
            }}
          >
            What the numbers mean
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "#78716C",
              lineHeight: "1.7",
              margin: 0,
            }}
          >
            Each number represents the count of active job listings on Adzuna for that skill in
            India. It's a relative indicator of demand, not an absolute headcount of hiring. A
            skill with 2,500 listings is in higher demand than one with 500 listings, but the
            exact number depends on how broadly Adzuna indexes the market and how job postings
            use skill keywords.
          </p>
        </section>

        {/* Update Schedule */}
        <section style={{ marginBottom: "32px" }}>
          <h2
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#A8A29E",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "12px",
              margin: 0,
            }}
          >
            Update schedule
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "#78716C",
              lineHeight: "1.7",
              margin: 0,
            }}
          >
            Data is updated automatically every Monday at 6 AM IST. This creates a consistent
            weekly snapshot that filters out day-to-day noise and captures meaningful trends in
            hiring demand.
          </p>
        </section>

        {/* Why Trends Matter */}
        <section style={{ marginBottom: "32px" }}>
          <h2
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#A8A29E",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "12px",
              margin: 0,
            }}
          >
            Why trends matter more than exact numbers
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "#78716C",
              lineHeight: "1.7",
              margin: 0,
            }}
          >
            The absolute job count for any skill fluctuates based on seasonal hiring, economic
            conditions, and how job postings are indexed. What matters is the direction and
            velocity of change. A skill growing 15% week-over-week is a stronger signal than its
            absolute count. Trends reveal whether a skill is becoming more or less valuable in
            the market. A declining trend, even from a high baseline, suggests cooling demand. A
            rising trend from a small baseline suggests emerging opportunity. By tracking trends
            over 12 weeks, we can distinguish real shifts from noise.
          </p>
        </section>

        {/* Data Source Credit */}
        <section>
          <h2
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#A8A29E",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "12px",
              margin: 0,
            }}
          >
            Data source credit
          </h2>
          <p style={{ fontSize: "15px", color: "#78716C", lineHeight: "1.7", margin: 0 }}>
            Powered by{" "}
            <a
              href="https://www.adzuna.com/api"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#D97706",
                textDecoration: "none",
                fontWeight: 600,
                transition: "opacity 200ms",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLAnchorElement).style.opacity = "0.8";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLAnchorElement).style.opacity = "1";
              }}
            >
              Adzuna Jobs API
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}

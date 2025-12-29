import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

export default function Portfolio() {
  return (
    <>
      <Navbar />

      <header style={{ padding: "160px 40px" }}>
        <h1>Selected Works</h1>
        <p>Brand transformations & creative projects</p>
      </header>

      <section style={{ padding: "80px 40px" }}>
        <div className="portfolio-grid">
          <div>Project One</div>
          <div>Project Two</div>
          <div>Project Three</div>
        </div>
      </section>

      <Footer />
    </>
  );
}

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <header style={{ padding: "160px 40px" }}>
        <h1>
          <span style={{ fontStyle: "italic" }}>Blooming</span> the Brand
        </h1>
        <p>Strategic storytelling & digital experiences.</p>
      </header>

      <section style={{ padding: "80px 40px" }}>
        <h2>Services</h2>
        <p>Brand Strategy · Content · Motion · Digital</p>
      </section>

      <section style={{ padding: "80px 40px" }}>
        <h2>Selected Works</h2>
        <p>Portfolio preview goes here</p>
      </section>

      <section style={{ padding: "80px 40px" }}>
        <h2>Our Journey</h2>
        <p>Years · Clients · Projects</p>
      </section>

      <section style={{ padding: "80px 40px" }}>
        <h2>Client Testimonials</h2>
      </section>

      <Footer />
    </>
  );
}


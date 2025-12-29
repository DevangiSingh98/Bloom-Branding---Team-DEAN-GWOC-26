import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

export default function Services() {
  return (
    <>
      <Navbar />

      <header style={{ padding: "160px 40px" }}>
        <h1>Holistic Growth Services</h1>
      </header>

      <section style={{ padding: "80px 40px" }}>
        <h2>Brand Strategy</h2>
        <p>Market positioning, identity, voice.</p>
      </section>

      <section style={{ padding: "80px 40px" }}>
        <h2>Content Creation</h2>
        <p>Photography, video, motion graphics.</p>
      </section>

      <section style={{ padding: "80px 40px" }}>
        <h2>Digital Experiences</h2>
        <p>Frontend-focused interactive websites.</p>
      </section>

      <Footer />
    </>
  );
}

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

export default function Contact() {
  return (
    <>
      <Navbar />

      <header style={{ padding: "160px 40px" }}>
        <h1>Let’s Bloom Together</h1>
      </header>

      <section style={{ padding: "80px 40px" }}>
        <form style={{ maxWidth: "500px" }}>
          <input placeholder="Name" />
          <input placeholder="Email" />
          <textarea placeholder="Project details" />
          <button className="cta-btn">Send Enquiry</button>
        </form>
      </section>

      <Footer />
    </>
  );
}

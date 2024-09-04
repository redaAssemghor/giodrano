import React, { useEffect, useState } from "react";
import Footer from "../../Components/LATIN/Footer";
import Navbar from "../../Components/LATIN/Navbar";
import LoadingScreen from "../../Components/LoadingScreen";
import { axiosInstance } from "../../Helpers/HTTP_CLIENT";

// export default function Contact() {
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   return (
//     <div><Navbar /><Footer /></div>
//   )
// }

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!(name && email && subject && number && message)) {
        alert("one or fields are empty");
        return;
      }
      setIsSending(true);
      const data = await axiosInstance.post("/api/v1/email-form", {
        name,
        email,
        subject,
        number,
        message,
      });

      setIsSending(false);
      setName("");
      setEmail("");
      setNumber("");
      setSubject("");
      setMessage("");
    } catch (err) {
      setIsSending(false);
    }
  };

  return (
    <div>
      {isSending && <LoadingScreen />}
      <Navbar />
      <div
        className="fit-container fx-centered fx-start-v box-marg box-pad-v fx-wrap box-marg-full"
        style={{ columnGap: "64px", rowGap: "64px" }}
      >
        <form
          className="fx-centered fx-wrap box-pad-h"
          style={{ width: "min(100%, 400px)" }}
          onSubmit={onSubmit}
        >
          <h3>Contact</h3>
          <input
            type="text"
            className="if ifs-full"
            placeholder="Nom et prénom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            className="if ifs-full"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            className="if ifs-full"
            placeholder="Numéro"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
          />
          <input
            type="text"
            className="if ifs-full"
            placeholder="Sujet"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          <textarea
            type="text"
            className="txt-area if ifs-full"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <button
            className="btn btn-normal btn-full"
            disabled={isSending}
            style={{ backgroundColor: isSending ? "var(--orange-main)" : "" }}
          >
            {isSending ? "En cours..." : "Envoyer"}
          </button>
        </form>
        <div className="fx-centered fx-col fx-start-v">
          <p>Contactez-nous par email ou réseaux sociaux</p>
          <div
            className="fx-centered fx-col fx-start-v box-pad-v"
            style={{ rowGap: "24px" }}
          >
            <div className="fx-centered fx-start-h">
              <div className="mobile"></div>
              <p>(+213) 549 757 874</p>
            </div>
            <div className="fx-centered fx-start-h">
              <div className="map"></div>
              <p>City Center Mall, Les bananiers, Mohammadia, Algérie</p>
            </div>
            <a href="https://web.facebook.com/Giordano.dz?mibextid=LQQJ4d&_rdc=1&_rdr" target={"_blank"}>
              <div className="fx-centered fx-start-h">
                <div className="facebook"></div>
                <p>Facebook</p>
              </div>
            </a>
            <a href="https://www.instagram.com/giordano_dz/?igshid=OGQ5ZDc2ODk2ZA%3D%3D" target={"_blank"}>
              <div className="fx-centered fx-start-h">
                <div className="instagram"></div>
                <p>Instagram</p>
              </div>
            </a>
          </div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3197.7120605058344!2d3.1783405000000005!3d36.729476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128e51f813fe8793%3A0xe1622f606cd2309c!2sCity%20Center%20Mall!5e0!3m2!1sen!2sfr!4v1690714378290!5m2!1sen!2sfr"
            // width="600"
            // height="450"
            style={{ border: 0, width: "min(100%, 400px)", aspectRatio: "16/9"}}
            className="sc-s-18"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      <Footer />
    </div>
  );
}

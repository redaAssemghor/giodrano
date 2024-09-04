import React, { useContext, useState } from "react";
import hero from "../../images/images/login-admin-hero.jpeg";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../Context/Context";
import { axiosInstance } from "../../Helpers/HTTP_CLIENT";
import LoadingScreen from "../../Components/LoadingScreen";

export default function Login() {
  const { admin, adminLoaded, setAdmin, setToast } = useContext(Context);
  const navigateTo = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const [passwordReset, setPasswordreset] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (email && password) {
      try {
        setIsLoading(true);
        const data = await axiosInstance.post("/api/v1/_admin_/admin-signin", {
          email,
          password,
        });
        setAdmin(data.data);
        navigateTo("/backoffice/articles");
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
        setToast({
          type: 2,
          desc: "Mot de passe ou email est incorrecte!",
        });
      }
    }
  };
  
  if(!adminLoaded) return <LoadingScreen />
  if(admin) return navigateTo("/backoffice/articles")
  return (
    <>
      {isLoading && <LoadingScreen />}
      <div
        className="fixed-container box-pad-h fx-col"
        style={{ position: "relative" }}
      >
        <div
          className="bg-img cover-bg"
          style={{
            backgroundImage: `url(${hero})`,
            width: "100vw",
            height: "100vh",
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: -1,
            opacity: ".3",
          }}
        ></div>

        <Link className="box-pad-v" to={"/"}>
          <div className="logo"></div>
        </Link>
        <section
          className="box-pad-h box-pad-v sc-s fx-centered fx-col"
          style={{ width: "min(100%,500px)" }}
        >
          {!passwordReset &&
            <>
              <h3 className="box-marg-s">Administration</h3>
              <form
                className="fx-centered fx-wrap fit-container"
                onSubmit={onSubmit}
              >
                <input
                  type="email"
                  className="if ifs-full"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  className="if ifs-full"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button className="btn btn-normal btn-full">
                  Se connecter
                </button>
                <div className="pointer" onClick={() => setPasswordreset(true)}>
                  <p className="btn-text-gray">Mot de passe oublié?</p>
                </div>
              </form>
            </>
          }
          {
            passwordReset && <PasswordReset switchScreen={() => setPasswordreset(false)} setIsLoading={setIsLoading}/>
          }
        </section>
      </div>
    </>
  );
}

const PasswordReset = ({ switchScreen, setIsLoading }) => {
  const { setToast } = useContext(Context);
  const [email, setEmail] = useState();
  const [screen, setScreen] = useState(0);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const submitStepOne = async (e) => {
    e.preventDefault();
    if (email) {
      try {
        setIsLoading(true);
        const data = await axiosInstance.post("/api/v1/_admin_/password-reset/step-1", {
          email,
        });
        setToast({
          type: 3,
          desc: "Un code de vérification a été envoyé à cette adresse email, verifier votre boite ou spambox.",
        });
        setCode(data.data.code);
        setScreen(1);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
        setToast({
          type: 2,
          desc: "Utilisateur n'existe pas",
        });
      }
    }
  };
  const submitStepTwo = async (e) => {
    e.preventDefault();
    if (code) {
      try {
        setIsLoading(true);
        const data = await axiosInstance.post("/api/v1/_admin_/password-reset/step-2", {
          code,
        });

        setScreen(2);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
        setToast({
          type: 2,
          desc: "Le code est incorrect",
        });
      }
    }
  };
  const submitStepThree = async (e) => {
    e.preventDefault();
    if (password && password === passwordConfirm) {
      try {
        setIsLoading(true);
        const data = await axiosInstance.post("/api/v1/_admin_/password-reset/step-3", {
          password,
        });
        setToast({
          type: 1,
          desc: "Le mot de passe a été changé avec succès!",
        });
        setScreen(0);
        switchScreen("login");
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
        setToast({
          type: 2,
          desc: "Erreur lors de serveur",
        });
      }
    } else {
      setToast({
        type: 2,
        desc: "Le mot de passe ne correspond pas",
      });
    }
  };

  return (
    <div className="fx-centered fx-col fit-container">
      <h3>Réinitialiser mot de passe</h3>
      {screen === 0 && (
        <>
          <p className="p-centered gray-c box-pad-h">
            Veuillez entrer votre identifiant pour vérifier votre identité, une
            fois vérifié, nous vous enverrons un code dans votre e-mailMerci de
            saisir votre identifiant
          </p>
          <input
            type="email"
            placeholder="Email"
            className="if ifs-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="btn btn-normal btn-full" onClick={submitStepOne}>
            Envoyer le code
          </button>
          <div className="fit-container box-pad-h-m fx-centered">
            <div className="pointer" onClick={switchScreen}>
              <p style={{ textDecoration: "underline" }}>Se connecter</p>
            </div>
          </div>
        </>
      )}
      {screen === 1 && (
        <>
          <p className="p-centered gray-c box-pad-h">
            Veuillez entrer votre identifiant pour vérifier votre identité, une
            fois vérifié, nous vous enverrons un code dans votre e-mailMerci de
            saisir votre identifiant
          </p>
          <input
            type="text"
            placeholder="Code de confirmation"
            className="if ifs-full"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <button className="btn btn-normal btn-full" onClick={submitStepTwo}>
            Verifier code
          </button>
          <div className="fit-container box-pad-h-m fx-centered">
            <div
              className="pointer fx-centered"
              onClick={() => {
                setScreen(0);
              }}
            >
              <div
                className="arrow"
                style={{ transform: "rotate(90deg)" }}
              ></div>
              <p style={{ textDecoration: "underline" }}>retour</p>
            </div>
          </div>
        </>
      )}
      {screen === 2 && (
        <>
          <p className="p-centered gray-c box-pad-h">
            Vous pouvez maintenant changer votre mot de passe
          </p>
          <input
            type="password"
            placeholder="Mot de passe"
            className="if ifs-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirmation de mot de passe"
            className="if ifs-full"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
          />
          <button className="btn btn-normal btn-full" onClick={submitStepThree}>
            Mettre à jour mon mot de passe
          </button>
          <div className="fit-container box-pad-h-m fx-centered">
            <div
              className="pointer fx-centered"
              onClick={() => {
                setScreen(1);
              }}
            >
              <div
                className="arrow"
                style={{ transform: "rotate(90deg)" }}
              ></div>
              <p style={{ textDecoration: "underline" }}>retour</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

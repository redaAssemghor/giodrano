import React, { useContext, useState } from "react";
import { wilayas } from "../../Content/main_content";
import { Context } from "../../Context/Context";
import { axiosInstance } from "../../Helpers/HTTP_CLIENT";
import LoadingScreen from "../LoadingScreen";

export default function Login({ exit }) {
  const [screen, setScreen] = useState("login");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {isLoading && <LoadingScreen />}
      <div
        className="fixed-container"
        onClick={(e) => {
          e.stopPropagation();
          exit();
        }}
      >
        <section
          className="box-pad-h box-pad-v sc-s fx-centered fx-col"
          style={{ width: "min(100%, 500px)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="close" onClick={exit}>
            <div></div>
          </div>
          <div className="user"></div>
          {screen === "login" && (
            <LoginScreen
              exit={exit}
              setIsLoading={setIsLoading}
              switchScreen={setScreen}
            />
          )}
          {screen === "signup" && (
            <SignUpScreen
              exit={exit}
              setIsLoading={setIsLoading}
              switchScreen={setScreen}
            />
          )}
          {screen === "p-reset" && (
            <PasswordReset
              exit={exit}
              setIsLoading={setIsLoading}
              switchScreen={setScreen}
            />
          )}
        </section>
      </div>
    </>
  );
}

const LoginScreen = ({ switchScreen, exit, setIsLoading }) => {
  const { setUser, setToast } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (email && password) {
      try {
        setIsLoading(true);
        const data = await axiosInstance.post("/api/v1/user-signin", {
          email,
          password,
        });
        setUser(data.data);
        setIsLoading(false);
        exit();
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
  return (
    <>
      <div className="fx-centered fx-col">
        <h3>Se connecter</h3>
        <p className="p-centered gray-c box-pad-h">
          connectez-vous à votre compte pour passer des commandes et suivre
          votre colis.
        </p>
        <form className="fit-container fx-wrap fx-centered" onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Email"
            className="if ifs-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="if ifs-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="btn btn-normal btn-full">Se connecter</button>
        </form>
        <div className="fit-container box-pad-h-m fx-scattered">
          <div className="pointer" onClick={() => switchScreen("signup")}>
            <p style={{ textDecoration: "underline" }}>S'inscrire</p>
          </div>
          <div className="pointer" onClick={() => switchScreen("p-reset")}>
            <p className="btn-text-gray">Mot de passe oublié?</p>
          </div>
        </div>
      </div>
    </>
  );
};
const SignUpScreen = ({ switchScreen, exit, setIsLoading }) => {
  const { setUser } = useContext(Context);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [number, setNumber] = useState("");
  const [prov, setProv] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (
      email &&
      password &&
      firstName &&
      lastName &&
      number &&
      prov &&
      city &&
      address &&
      postalCode
    ) {
      try {
        setIsLoading(true);
        const data = await axiosInstance.post("/api/v1/user-signup", {
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          number,
          address_prov: prov,
          address_city: city,
          address,
          address_postal_code: postalCode,
        });
        setUser(data.data);
        setIsLoading(false);
        exit();
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    }
  };
  const compareNames = (wilaya1, wilaya2) => {
    let name2 = wilaya1.prov.toLowerCase();
    let name1 = wilaya2.prov.toLowerCase();

    if (name1 > name2) return -1;
    if (name1 < name2) return 1;
    return 0;
  };
  return (
    <div className="fx-centered fx-col">
      <h3>S'inscrire</h3>
      <p className="p-centered gray-c box-pad-h">
        Créer votre compte maintenant pour commander et suivre votre colis
      </p>
      <form className="fit-container fx-wrap fx-scattered" onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Nom"
          className="if ifs-small"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Prénom"
          className="if ifs-small"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="if ifs-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Numéro"
          className="if ifs-full"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          required
        />
        <select
          className="if ifs-tiny"
          required
          onChange={(e) => setProv(e.target.value)}
          value={prov}
        >
          <option value={""}>-- Wilaya --</option>
          {wilayas.fr.sort(compareNames).map((wilaya) => {
            return (
              <option value={wilaya.prov.toLowerCase()} key={wilaya.prov}>
                {wilaya.prov}
              </option>
            );
          })}
        </select>
        {/* <input
          type="text"
          placeholder="Wilaya"
          className="if ifs-tiny"
          value={prov}
          onChange={(e) => setProv(e.target.value)}
          required
        /> */}
        <input
          type="text"
          placeholder="Ville"
          className="if ifs-tiny"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Code postale"
          className="if ifs-tiny"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Adresse"
          className="if ifs-full"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="if ifs-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn btn-normal btn-full">S'inscrire</button>
      </form>
      <div className="fit-container box-pad-h-m fx-centered">
        <div className="pointer" onClick={() => switchScreen("login")}>
          <p style={{ textDecoration: "underline" }}>Se connecter</p>
        </div>
      </div>
    </div>
  );
};

const PasswordReset = ({ switchScreen, exit, setIsLoading }) => {
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
        const data = await axiosInstance.post("/api/v1/password-reset/step-1", {
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
        const data = await axiosInstance.post("/api/v1/password-reset/step-2", {
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
        const data = await axiosInstance.post("/api/v1/password-reset/step-3", {
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
            fois vérifié, nous vous enverrons un code dans votre e-mail. Merci de
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
            <div className="pointer" onClick={() => switchScreen("login")}>
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

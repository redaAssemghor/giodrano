import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/ADMIN/Navbar";
import LoadingScreen from "../../Components/LoadingScreen";
import Date_ from "../../Components/Date_";
import { Context } from "../../Context/Context";
import { axiosInstance } from "../../Helpers/HTTP_CLIENT";

export default function AdminSettings() {
  const { admin, adminLoaded, setAdmin } = useContext(Context);
  const navigateTo = useNavigate();
  const [showUploader, setShowUploader] = useState(false);
  const [toggleSettings, setToggleSettings] = useState(false);
  const [email, setEmail] = useState(admin?.email || "");
  const [isLoading, setIsLoading] = useState(false);
  const [oldPW, setOldPW] = useState("");
  const [newPW, setNewPW] = useState("");
  const [newPWConfirm, setPWConfirm] = useState("");
  const [togglePW, setTogglePW] = useState(false);

  const updateInfo = async () => {
    if (!email) return;
    try {
      setIsLoading(true);
      const data = await axiosInstance.put("/api/v1/_admin_/admin", {
        email,
      });
      setToggleSettings(false);
      setAdmin(data.data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const updatePassword = async () => {
    if (!(oldPW && newPW && newPW === newPWConfirm)) return;
    try {
      setIsLoading(true);
      const data = await axiosInstance.post("/api/v1/_admin_/password-reset", {
        old_password: oldPW,
        new_password: newPW,
      });
      setTogglePW(false);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  if (!adminLoaded) return <LoadingScreen />;
  if (!admin) return navigateTo("/backoffice");
  return (
    <div>
      {showUploader && <UploadCover exit={() => setShowUploader(false)} />}
      {isLoading && <LoadingScreen />}
      <Navbar />
      <div className="fit-container fx-centered">
        <div className="container box-pad-h-m box-marg-full fx-centered fx-start-h">
          <div style={{ width: "min(100%, 800px)" }}>
            <div className="fit-container fx-scattered box-marg-s">
              <h3>Gestion</h3>
            </div>
            <div className="fit-container fx-scattered box-pad-h box-pad-v sc-s box-marg">
              <div className="fx-centered">
                <div
                  className="bg-img cover-bg sc-s-18 fx-centered"
                  style={{
                    backgroundImage: `url(${admin.cover})`,
                    aspectRatio: "16/9",
                    height: "100px",
                    backgroundColor: "var(--dim-gray)",
                  }}
                ></div>
                <div className="box-pad-h">
                  <p className="gray-c p-medium">Modifiée le</p>
                  <p>
                    <Date_ toConvert={admin.cover_updated} />
                  </p>
                </div>
              </div>
              <label
                className="fx-centered btn btn-normal"
                onClick={() => setShowUploader(true)}
              >
                Modifier
              </label>
            </div>
            <div className="fit-container fx-scattered box-marg-s">
              <h3>Données</h3>
            </div>
            <div className="fit-container fx-centered fx-col">
              <div className="box-pad-h box-pad-v sc-s fit-container fx-scattered fx-col">
                <div className="fit-container fx-scattered">
                  <div>
                    <p className="gray-c">Email</p>
                    <p>{admin.email}</p>
                  </div>
                  <div className="fx-centered">
                    {toggleSettings && (
                      <button
                        className="btn btn-normal"
                        onClick={updateInfo}
                      >
                        Mettre à jour
                      </button>
                    )}
                    <button
                      className={`btn ${
                        toggleSettings ? "btn-gst-red" : "btn-normal"
                      }`}
                      onClick={() => setToggleSettings(!toggleSettings)}
                    >
                      {toggleSettings ? "Annuler" : "Modifier"}
                    </button>
                  </div>
                </div>
                {toggleSettings && <hr />}
                {toggleSettings && (
                  <input
                    type={"text"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="if ifs-full"
                    placeholder="Nom"
                  />
                )}
              </div>
              <div className="box-pad-h box-pad-v sc-s fit-container fx-scattered fx-col">
                <div className="fit-container fx-scattered">
                  <div>
                    <p>Mot de passe</p>
                  </div>
                  <div className="fx-centered">
                    {togglePW && (
                      <button
                        className="btn btn-normal"
                        onClick={updatePassword}
                      >
                        Mettre à jour
                      </button>
                    )}
                    <button
                      className={`btn ${
                        togglePW ? "btn-gst-red" : "btn-normal"
                      }`}
                      onClick={() => setTogglePW(!togglePW)}
                    >
                      {togglePW ? "Annuler" : "Modifier"}
                    </button>
                  </div>
                </div>

                {togglePW && (
                  <div className="fit-container fx-centered fx-wrap">
                    <input
                      type={"password"}
                      value={oldPW}
                      onChange={(e) => setOldPW(e.target.value)}
                      className="if ifs-full"
                      placeholder="Mot de passe actuel"
                    />
                    <input
                      type={"password"}
                      value={newPW}
                      onChange={(e) => setNewPW(e.target.value)}
                      className="if ifs-full"
                      placeholder="Nouveau mot de passe"
                    />
                    <input
                      type={"password"}
                      value={newPWConfirm}
                      onChange={(e) => setPWConfirm(e.target.value)}
                      className="if ifs-full"
                      placeholder="Confirmation de nouveau mot de passe"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const UploadCover = ({ exit }) => {
  const { setAdmin, admin } = useContext(Context);
  const [cover, setCover] = useState("");
  const [coverPrev, setCoverPrev] = useState("");
  const [isLoading, setIsLoading] = useState("");

  const handleUpload = (e) => {
    let file = e.target.files[0];
    if (!file) return;
    setCover(file);
    setCoverPrev(URL.createObjectURL(file));
  };

  const submit = async () => {
    if (!coverPrev) return;

    try {
      setIsLoading(true);
      let fd = new FormData();
      fd.append("file", cover);
      const data = await axiosInstance.post("/api/v1/_admin_/settings", fd, {
        headers: {
          "Content-Type": "Multipart/form-data",
        },
      });
      let temp_admin = {
        ...admin,
      };
      temp_admin.cover = data.data.cover;
      temp_admin.cover_updated = data.data.cover_updated;
      setAdmin(temp_admin);
      exit();
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed-container">
      {isLoading && <LoadingScreen />}
      <section
        className="box-pad-h box-pad-v sc-s fx-centered fx-col"
        style={{ position: "relative", width: "min(100%, 600px)" }}
      >
        <div className="close" onClick={exit}>
          <div></div>
        </div>
        <label
          className="bg-img cover-bg sc-s-18 fx-centered fit-container pointer"
          style={{
            backgroundImage: `url(${coverPrev})`,
            aspectRatio: "16/9",
            backgroundColor: "var(--dim-gray)",
            position: "relative",
          }}
          htmlFor="img-uploader"
        >
          <input
            type="file"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              opacity: 0,
              width: "100%",
              height: "100%",
            }}
            id="img-uploader"
            className="pointer"
            onChange={handleUpload}
          />
          {!coverPrev && <p className="gray-c">Uploader une couverture</p>}
          {coverPrev && (
            <div
              style={{
                position: "absolute",
                right: "16px",
                top: "16px",
                borderRadius: "var(--border-r-50)",
                backgroundColor: "var(--dim-gray)",
                width: "48px",
                aspectRatio: "1/1",
              }}
              className="fx-centered"
              onClick={() => {
                setCover("");
                setCoverPrev("");
              }}
            >
              <div className="trash"></div>
            </div>
          )}
        </label>
        <button
          className={`btn ${
            coverPrev ? "btn-normal" : "btn-disabled"
          } btn-full`}
          disabled={!coverPrev}
          onClick={submit}
        >
          Uploader
        </button>
      </section>
    </div>
  );
};

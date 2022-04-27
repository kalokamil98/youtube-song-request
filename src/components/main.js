import { useState, useEffect } from "react";
import ekonom from "./../img/ekonom.jpg";
const Main = () => {
  const [tytul, setTytul] = useState("");
  const [nexttytul, setNext] = useState("");
  const [counter, setCounter] = useState("");
  const [opis, setOpsi] = useState("Podaj tytuł lub link do piosenki");
  const [opisstyle, setOpisstyle] = useState({ color: "black" });
  const [okladka, setOkladka] = useState("");
  function getData() {
    fetch("/api/get")
      .then((res) => res.json())
      .then((res) => {
        setTytul(res.tittle);
        setNext(res.next);
        setCounter(res.counter);
        setOkladka(res.img);
      })
      .catch((err) => {
        setOpsi("nie można połączyć się z serverem");
        setOpisstyle({ color: "red" });
        setOkladka(ekonom);
      });
  }
  const postData = async (data) => {
    await fetch("/api/send", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        {
          if (res.err == "Utwór ma za mało wyświetleń lub jest za długi") {
            setOpisstyle({ color: "red" });
            setOpsi(
              "Utwór ma za mało wyświetleń lub jest za długi MAX 6 min Spróbuj jeszcze raz"
            );
            return;
          }
          console.log("wysłałem", res);
          setOpsi(`Wysłano.  ${res.tytul} Teraz oczekuje na akceptacje`);
          setOkladka(res.img);
          setSend(true);
          setOpisstyle({ color: "green" });
        }
      })
      .catch((err) => {
        setOpsi("Blad servera");
        setOpisstyle({ color: "red" });
      });
  };

  useEffect(() => {
    getData();
  }, []);
  const [send, setSend] = useState(false);
  return (
    <div className="Main">
      <h1 style={{ textAlign: "center" }}> Odtwarzanie</h1>
      <img src={okladka}></img>
      <br></br>
      <p className="tytul">{tytul}</p>
      <p style={{ margin: 0 }}>Aktualna liczba utworów w kolejce : {counter}</p>
      <p>Następny Utwór: {nexttytul}</p>
      <div className="player-link">
        <label style={opisstyle}>{opis}</label>
        <br></br>
        <br></br>
        <input name="songName" type="text" className="name" id="in"></input>
        <button
          onClick={() => {
            if (send === false) {
              let getLink = document.getElementById("in").value;
              if (!getLink || getLink.length < 6) {
                setOpsi("Nie poprawny link");
                setOpisstyle({ color: "red" });
              } else {
                let link = {
                  link: getLink,
                };
                postData(link);
              }
            } else {
              setOpsi("Już podałeś utwór");
            }
          }}
        >
          Wyślij
        </button>
      </div>
    </div>
  );
};

export default Main;

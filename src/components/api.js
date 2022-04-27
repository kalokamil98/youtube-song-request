const express = require("express");
const app = express();
const PORT = 8080;
const yts = require("yt-search");

var database = [];

app.use(express.json({ limit: "1mb" }));

app.listen(PORT, () =>
  console.log(`hejka to mój adres http://localhost:${PORT}`)
);

app.get("/api/get", (req, res) => {
  if (database.length == 0) {
    res.status(500).send({
      tittle: "kolejka jest narazie pusta elo",
      img: "https://c.tenor.com/5aF7np_zPEgAAAAM/pepe-why-pepe-the-frog.gif",
      counter: 0,
    });
    return;
  }

  let next;
  if (typeof database[1] !== "undefined") next = database[1].title;
  else next = "Nic";

  let getdata = {
    tittle: database[0].title,
    img: database[0].img,
    counter: database.length,
    next: next,
  };

  res.send(getdata);
});

app.post("/api/send", async (req, res) => {
  const { link } = req.body;

  if (!link) {
    res.status(418).send({ message: "Błędne dane !" });
  }
  const r = await yts(link);

  const videos = r.videos.slice(0, 1);
  videos.forEach(function (v) {
    const views = String(v.views).padStart(10, " ");
    const time = v.timestamp.replace(/:/g, "");
    console.log(time);
    if (views < 5000 || time > 600) {
      res
        .status(410)
        .send({ err: "Utwór ma za mało wyświetleń lub jest za długi" });
    } else {
      res.status(200).send({
        tytul: v.title + " (" + v.timestamp + ")",
        link: v.url,
        img: v.image,
      });

      let value = {
        link: v.url,
        title: v.title,
        time: v.timestamp,
        img: v.image,
      };

      database.push(value);
      console.log(database);
      res.end();
    }
  });
});

app.get("/api/delete", async (req, res) => {
  database.shift();

  res.send("Deletes sucss");
});

app.get("/api/music", async (req, res) => {
  if (database.length == 0) {
    res.status(500).send({ err: "Kolejka jest narazie to dno" });
    return;
  } else if (database.length == 1) {
    let links = [{ link: database[0].link, title: database[0].title }];
    res.status(200).send(links);
  } else {
    let links = [
      { link: database[0].link, title: database[0].title },
      { link: database[1].link, title: database[1].title },
    ];
    res.status(200).send(links);
  }
});

const express = require("express");
//const { response } = require("express");
const app = express();
const PORT = 8080;
//const ytdl = require("ytdl-core");
const yts = require("yt-search");
const mysql = require("mysql");

/* const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "zaq1@WSX",
  database: "songs",
}); */

/* db.connect((err) => {
  if (err) {
    console.log("erro");
    throw Error;
  }
  console.log("My sql connected");
}); */

var database = [];

app.use(express.json({ limit: "1mb" }));

app.listen(PORT, () =>
  console.log(`hejka to mój adres http://localhost:${PORT}`)
);

app.get("/api/get", (req, res) => {
  /* const sqlget =
    "SELECT img as img, song_name as tittle from songs where id = (Select min(id) from songs)";
  db.query(sqlget, (error, results, fields) => {
    if (error) throw Error;

    let getdata = {
      tittle: results[0].tittle,
      img: results[0].img,
       counter: results[0].counter,
    };

  }); */
  res.send(getdata);
});

/* async function get_count() {
  const result = new Promise((resolve, reject) => {
    db.query("SELECT max(id) as count from songs", (err, result, fields) => {
      if (err) throw err;
      result = JSON.parse(JSON.stringify(result));
      resolve(result[0].count);
    });
  });
  const finall = await result;

  return finall;
} */

app.post("/api/send", async (req, res) => {
  const { link } = req.body;
  //const sql = "INSERT INTO songs (id,link,song_name,time,img) VALUES (?)";

  if (!link) {
    res.status(418).send({ message: "Błędne dane !" });
  }
  const r = await yts(link);
  // const counter = await get_count();
  console.log(counter);
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
      //  let value = [counter + 1, v.url, v.title, v.timestamp, v.image];
      /*  db.query(sql, [value], (err, result) => {
        if (err) console.log("Błąd");
      }); */
      res.end();
    }
  });
});

app.get("/api/delete", async (req, res) => {
  /*  const sql = " update songs set id=id-1;";
  const sql2 = "DELETE FROM songs ORDER BY id LIMIT 1; ";
  db.query(sql, (err, result, fields) => {
    if (err) throw err;
  }); */

  /*  db.query(sql2, (err, result, fields) => {
    if (err) throw err;
  }); */
  res.send("Deletes sucss");
});

app.get("/api/linki", async (req, res) => {
  //const sql = "SELECT link as linki FROM songs ORDER BY id LIMIT 2;";

  /* db.query(sql, (err, result, fields) => {
    if (err) throw err;

    let links = [result[0].linki, result[1].linki];

  }); */
  res.send(links);
});

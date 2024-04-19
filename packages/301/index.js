const express = require("express");
var app = express();

app.get("/*", function (req, res) {
  res.set("location", "https://www.joshgretz.com");
  res.status(301).send();
});

app.listen(process.env.PORT);

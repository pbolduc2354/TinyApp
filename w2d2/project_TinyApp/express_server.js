var express = require("express");
var app = express();
var PORT = 8080;

app.set("view engine", "ejs")

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xk": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.end("hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>/n");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  let longURL = urlDatabase[shortURL];
  let templateVars = { shortURL : shortURL,
    longURL: longURL
   }
  res.render("urls_show", templateVars);
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

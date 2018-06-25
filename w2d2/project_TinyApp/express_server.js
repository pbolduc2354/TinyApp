var express = require("express");
var cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');

var app = express();
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}));


var PORT = 8080;



function generateRandomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

  function userEmailVerificator(req) {
    var resultat = false;

    for (let user in users) {
      if (users[user].email == req.body.email){
        resultat = true;
      }
    } return resultat
  };

    function userPasswordVerificator(req) {
    var resultat = false;

    for (let user in users) {
      if (users[user].password == req.body.password){
        resultat = true;
      }
    } return resultat
  };

  function urlsForUser(user) {
    let returnObj = {};

    for (const shortURL in urlDatabase) {
      if (user === urlDatabase[shortURL].userID){
        returnObj[shortURL] = urlDatabase[shortURL]
      }
    } return returnObj;
  }


app.set("view engine", "ejs")

var urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    shortURL: "9sm5xk",
    userID: ""
  },
  "9sm5xk": {
    longURL:"http://www.google.com",
    shortURL: "9sm5xk" ,
    userID:"user3RandomID"
  }
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("chat", 10)
  } ,
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("chien", 10),
  } ,
  user3RandomID: {
    id: "user3RandomID",
    email: "user3@example.com",
    password: bcrypt.hashSync("chu", 10),
  }
}

app.get("/", (req, res) => {
  res.end("hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>/n");
});

//LOGIN end point
app.get("/login", (req, res) => {
  let templateVars = { user: req.cookies["user_id"] };
  res.render("urls_login", templateVars)
})

// Cookie set-up
app.post("/login", (req, res) => {
  let id = generateRandomString()
  if (userEmailVerificator(req) && userPasswordVerificator(req)) {
    for (let el in users){
      console.log(users[el].email);
      console.log(req.body.password);
      if (users[el].email == req.body.email && (bcrypt.compareSync(req.body.password, users[el].password)) ) {
        res.cookie("user_id", users[el].id);
        res.redirect("/urls")
        return;
      }
    }
    res.sendStatus(400)
  } else {
    res.sendStatus(400);
  }
});

//logout
app.post("/logout", (req, res) => {
 res.clearCookie("user_id");
 res.redirect("/urls")
});

//register page
app.get("/register", (req, res) => {

  res.render("urls_register");
});

//creating a new user with register page
app.post("/register", (req, res) => {
  let id = generateRandomString()
  if(!req.body.email || !req.body.password) {
      res.send(400);
  } else if ( userEmailVerificator(req) ) {
      res.send(400);
    } else {
        users[id] = {
        id: id,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        }
      }


  res.cookie("user_id", id)
  res.redirect("/urls")
});

//Main page urls
app.get("/urls", (req, res) => {
  let user_id = req.cookies.user_id

  let templateVars = { urls: urlsForUser(user_id), user: req.cookies["user_id"] };
  res.render("urls_index", templateVars);
});


app.post("/urls", (req, res) => {

  let shortURL = generateRandomString()
  let longURL = req.body.longURL;
  urlDatabase[shortURL] = {
    longURL : longURL,
    userID: req.cookies["user_id"]
  };
    // console.log(urlDatabase)
  res.redirect('/urls')

});

app.get("/urls/new", (req, res) => {
  let user_id = req.cookies.user_id
  console.log(req.cookies.user_id)
    let templateVars = { urls: urlsForUser(user_id), user: req.cookies["user_id"] };
  if (req.cookies["user_id"]) {

    res.render("urls_new", templateVars);
  } else {
    res.render("urls_login" , templateVars)
  }

});

// pages for each id
app.get("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  let longURL = urlDatabase[shortURL];
  let templateVars = {
    shortURL : shortURL,
    longURL: longURL.longURL,
    user: req.cookies["user_id"]
   }
  res.render("urls_show", templateVars);
})

// update existing URL
app.post("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  let longURL = req.body.box;
  urlDatabase[shortURL] = {
    longURL : longURL,
    userID: req.cookies["user_id"]

  };
  res.redirect("/urls");
})

// Delete existing URL
app.post("/urls/:id/delete", (req, res) =>{

  let shortURL = req.params.id;

  if(req.cookies.user_id == urlDatabase[shortURL].userID) {
    delete urlDatabase[shortURL];
  }


  res.redirect("/urls");
})

// url redirector
app.get('/u/:shortURL', (req, res) => {
  let shortURL  = req.params.id;
  let longURL   = urlDatabase[req.params.shortURL].longURL;
  let redirect;
  if (longURL.includes('http')) {
    redirect = longURL;
  } else {
    redirect = 'http://' + longURL;
  };
  res.redirect(redirect)
});

app.listen(PORT, () => {
  // console.log(`Example app listening on port ${PORT}!`);
});


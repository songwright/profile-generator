// Required

const generator = require("./generateHTML.js")
const inquirer = require("inquirer");
const axios = require("axios");
const fs = require("fs");

// Variables and constants

let gitUsername = '';
let colorTheme = '';
let imageLink = '';
let fullName ='';
let company = '';
let location = '';
let profileLink = '';
let blogLink = '';
let bioLink = '';
let repos = 0;
let followers = 0;
let starsTotal = 0;
let following = 0;
let userData = [];
const questions = [
  {
    type: "input",
    message: "Enter your GitHub username",
    name: "username"
  },
  {
    type: "list",
    message:  "Which color theme would you like?",
    name: "color",
    choices: ['green', 'blue', 'pink','red']
  }
];

function writeToFile(fileName, data) {

  let html = `
<body>
  <div class="wrapper">
    <div class="links-nav"></div>
    <!-- Profile picture -->
    <header class="photo-header">
      <img src="${imageLink}" alt="${fullName}">
      <h1>Hi!</h1>
      <h3>My name is ${fullName}!</h3>
      <h5>Currently @ ${company}</h5>
      <h6><a href="${location}">${location}</a> <a href="${profileLink}">GitHub</a> <a href="${blogLink}">Blog</a></h6>
    </header>
    <main>
      <div class="container">
        <div class="col">
          <!-- Profile bio -->
          <h4>${bioLink}</h4>
          <div class="row">
            <div class="col">
              <div class="card">
                <h5>Public Repositories</h5>
                <h6>${repos}</h6>
              </div>
            </div>
            <div class="col">
              <div class="card">
                <h5>Followers</h5>
                <h6>${followers}</h6>
              </div>
            </div>
          </div> <!-- End of row -->
          <div class="row">
            <div class="col">
              <div class="card">
                <h5>GitHub Stars</h5>
                <h6>Number</h6>
              </div>
            </div>
            <div class="col">
              <div class="card">
                <h5>Following</h5>
                <h6>${following}</h6>
              </div>
            </div>
          </div><!-- End of row -->
        </div>
      </div>
    </main>
  </div>
</body>
  `;

  pageData = generator.generateHTML(colorTheme) + html;

  fs.writeFile("index.html", pageData, function(err) {
    if (err) {
      return console.log(err);
    }

    console.log("Success!");

  });
}

function init() {
  inquirer
    .prompt(questions)
    .then(answers => {
      gitUsername = answers.username;
      console.log(gitUsername);
      colorTheme = answers.color;
      console.log(colorTheme);
    })
    .then(function(){
      const queryUrl = `https://api.github.com/users/${gitUsername}`;
      axios.get(queryUrl)
      .then(function(res) {
        imageLink = res.data.avatar_url;
        fullName = res.data.name;
        company = res.data.company;
        location = res.data.location;
        profileLink = res.data.html_url;
        blogLink = res.data.blog;
        bioLink = res.data.bio;
        repos = res.data.public_repos;
        followers = res.data.followers;
        following = res.data.following;
        console.log(fullName);
        writeToFile();
      })
      .catch(function(error) {
        console.log(error);
      })
    })
}

init();

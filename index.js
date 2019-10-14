// Required

const generator = require("./generateHTML.js")
const inquirer = require("inquirer");
const axios = require("axios");
const fs = require("fs");
var convertFactory = require('electron-html-to');
var conversion = convertFactory({
  converterPath: convertFactory.converters.PDF
});

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
      <h2>My name is ${fullName}!</h2>
      <h5>Currently @ ${company}</h5>
      <h6><a href="https://www.google.com/maps/place/${location}" target="_blank"><i class="fas fa-location-arrow"></i> ${location}</a>
        <span>blank</span><a href="${profileLink}" target="_blank"><i class="fab fa-github-alt"></i> GitHub</a>
        <span>black</span><a href="${blogLink}" target="_blank"><i class="fas fa-rss"></i> Blog</a></h6>
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
                <h6>${starsTotal}</h6>
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

  conversion({ html: pageData }, function(err, result) {
    if (err) {
      return console.error(err);
    }

    console.log(result.numberOfPages);
    console.log(result.logs);
    result.stream.pipe(fs.createWriteStream('./profile.pdf'));
    conversion.kill(); // necessary if you use the electron-server strategy, see bellow for details
  });

  fs.writeFile("index.html", pageData, function(err) {
    if (err) {
      return console.log(err);
    }
    console.log("Success!");
  });
}

function githubStars() {
  // Get the user's GitHub stars
  const queryUrl = `https://api.github.com/users/${gitUsername}/repos?per_page=100`;
    axios.get(queryUrl)
    .then(response => {
      response.data.reduce((total, curr) => {
        total += curr.stargazers_count;
        return starsTotal = total;
      }, 0)
    })
    .then(function() {
      // Put the GitHub stars number into the page and render it.
      writeToFile();

    })
    .catch(function(error) {
      console.log(error);
    });
}

function init() {
  inquirer
    .prompt(questions)
    .then(answers => {
      gitUsername = answers.username;
      colorTheme = answers.color;
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
        githubStars();
      })
      .catch(function(error) {
        console.log(error);
      })
    })
}

init();

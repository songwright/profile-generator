// Required

var generator = require("./generateHTML.js")
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
  fs.writeFile("index.html", data, function(err) {
    if (err) {
      return console.log(err);
    }

    console.log("Success!");

  });
}

function init() {

init();

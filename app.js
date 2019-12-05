const TeamPrompt = require("./lib/TeamPrompt");
// const inquirer = require("inquirer"); 



//prompt user for...
const app = new TeamPrompt();
app.start();
// app.generateHTML();


//email, id, and specific information based on their role with the company. 
//For instance, an intern may provide their school, whereas an engineer may provide their GitHub username.

//output file to team.html
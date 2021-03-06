//required Classes
const Engineer = require('./Engineer');
const Intern = require('./Intern');
const Manager = require('./Manager');
//Node Modules
const fs = require('fs');
//NPM Modules
const inquirer = require('inquirer'); 
const chalkAnimation = require('chalk-animation');

class TeamPrompt {
    constructor() {
        //init empty employees array
        this.employees = [];
    }
    //start prompt sequence
    start() {  
        console.log('Enter the manager\'s data first.');
        this.currentEmployee = new Manager;
        this.askManagerInfo();
    }
    //end prompt sequence, start generateHTML
    end() {
        this.generateHTML();
    }
    nextEmployee() {
        //prompt choice to add another new employee
        inquirer
        .prompt([{
            type: 'list',
            name: 'addNewEmployee',
            message: 'Add another employee to the team?',
            choices: ['Yes', 'No'],
        }])
        .then(answer => {
            if (answer.addNewEmployee === 'Yes') {
                this.askEmployeeType();
            } else {
                this.end(); 
            }
        })
    }
    askEmployeeType() {
        inquirer
        //ask for Employee type
        .prompt([{
            type: 'list',
            name: 'employeeType',
            message: 'Which type of employee would you like to add?',
            choices: ['Engineer', 'Intern'],
        }])
        .then(answer => { 
        //set currentEmployee to new Employee subclass and select next prompt based on employeeType
            switch(answer.employeeType) {
                case 'Engineer':
                    this.currentEmployee = new Engineer;
                    this.askEngineerInfo();
                    break;
                case 'Intern':
                    this.currentEmployee = new Intern;
                    this.askInternInfo();
                    break;
            }
        });
    }
    askManagerInfo() {
        inquirer
        //ask for Manager details
        .prompt([{
            name: 'employeeName', 
            message: 'Manager name: '
            },
            {
            name: 'employeeID', 
            message: 'Manager ID: '
            },
            {
            name: 'employeeEmail', 
            message: 'Manager Email: '
            },
            {
            name: 'employeeOfficeNumber', 
            message: 'Manager Office #: '
            }])
        .then(answers => {
            //set currentEmployee properties to user's answers
            this.currentEmployee.name = answers.employeeName;
            this.currentEmployee.id = answers.employeeID;
            this.currentEmployee.email = answers.employeeEmail;
            this.currentEmployee.officeNumber = answers.employeeOfficeNumber;
            //add currentEmployee to employees array
            this.employees.push(this.currentEmployee);
            //ask for next employee
            this.nextEmployee();
        });

    }
    askEngineerInfo() {
        inquirer
        //ask for Engineer details
        .prompt([{
            name: 'employeeName', 
            message: 'Engineer name: '
            },
            {
            name: 'employeeID', 
            message: 'Engineer ID: '
            },
            {
            name: 'employeeEmail', 
            message: 'Engineer Email: '
            },
            {
            name: 'employeeGithub', 
            message: 'Engineer GitHub Username: '
            }])
        .then(answers => {
            //set currentEmployee properties to user's answers
            this.currentEmployee.name = answers.employeeName;
            this.currentEmployee.id = answers.employeeID;
            this.currentEmployee.email = answers.employeeEmail;
            this.currentEmployee.github = answers.employeeGithub;
            //add currentEmployee to employees array
            this.employees.push(this.currentEmployee);
            //ask for next employee
            this.nextEmployee();
        });
    }
    askInternInfo() {
        inquirer
        //ask for Intern details
        .prompt([{
            name: 'employeeName', 
            message: 'Intern name: '
            },
            {
            name: 'employeeID', 
            message: 'Intern ID: '
            },
            {
            name: 'employeeEmail', 
            message: 'Intern Email: '
            },
            {
            name: 'employeeSchool', 
            message: 'Intern School: '
            }])
        .then(answers => {
            //set currentEmployee properties to user's answers
            this.currentEmployee.name = answers.employeeName;
            this.currentEmployee.id = answers.employeeID;
            this.currentEmployee.email = answers.employeeEmail;
            this.currentEmployee.school = answers.employeeSchool;
            //add currentEmployee to employees array
            this.employees.push(this.currentEmployee);
            //ask for next employee
            this.nextEmployee();
        });
    }
    generateHTML() {
        // console.log('Generating HTML');
        this.consoleMessageHTML = chalkAnimation.karaoke('Generating HTML...', 2);
        this.consoleMessageHTML.start();

        //get role templates from html files. should possibly be refactored to be async
        try {
            var managerTemplate = fs.readFileSync('templates/manager.html', 'utf8');
            var engineerTemplate = fs.readFileSync('templates/engineer.html', 'utf8');
            var internTemplate = fs.readFileSync('templates/intern.html', 'utf8');
          } catch (err) {
            console.error(err)
          }

        //init HTML body
        let htmlBody = '';
        //loop over employees array and append appropriate html for the given employee role
        for (let i=0; i<this.employees.length; i++){
            htmlBody += `
            <div class="card" style="margin: 1em; width:25%;">
                <div class="card-body">
            `;
            switch(this.employees[i].role) {
                case "Manager":
                    htmlBody += eval('`'+managerTemplate+'`');
                    break;
                case "Engineer":
                    htmlBody += eval('`'+engineerTemplate+'`');
                    break;
                case "Intern":
                    htmlBody += eval('`'+internTemplate+'`');
                    break;
            }
            htmlBody += `
                </div>
            </div>`;
        }
        //read template from disk
        fs.readFile('templates/main.html', 'utf8', (err, htmlTemplate) => {
            //handle error or saveHTML
            if (err){
                console.log('Error reading HTML template from disk.')
            } else {
                let outputHTML = eval('`'+htmlTemplate+'`'); // `htmlTemplate`
                setTimeout(() =>  {
                    this.consoleMessageHTML.stop();
                    this.saveHTML(outputHTML);
                }, 400);
            }
        });
    }
    saveHTML(html) {
        //create output folder
        fs.mkdir('output', { recursive: true }, (err) => {
            if (err) throw err;
          });
        //save html file to disk
        fs.writeFile('output/output.html', html, (err) => {
            if (err) {
                console.log("Error writing HTML to disk.", err);
            } else {
                //create and start console animation
                this.consoleMessageSaving = chalkAnimation.karaoke('Saving HTML file...', 2);
                this.consoleMessageSaving.start();
                //stop console animation after 400ms
                setTimeout(() => {
                    this.consoleMessageSaving.stop();
                }, 400);
                //create, start, and stop neon console message
                setTimeout(() => {
                    this.consoleMessageSaved = chalkAnimation.neon('File Saved.');
                    this.consoleMessageSaved.start();
                    this.consoleMessageSaved.stop();
                }, 1000);
                
            }
        });
    }
}

module.exports = TeamPrompt;

const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const Employee = require("./lib/Employee");


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```

const questions = [
    {
        type: "list",
        name: "role",
        default: 'Manager',
        choices: ['Manager', 'Engineer', 'Intern', new inquirer.Separator(), 'Done'],
        message: "Choose a role to add to your team.",

    },
    {
        type: "input",
        name: "name",
        default: "Test Name",
        message: "What is their name?"
    },
    {
        type: "input",
        name: "id",
        default: 1,
        message: "What is their ID?"
    },
    {
        type: "input",
        name: "email",
        default: "test@test.com",
        message: "What is their email?"
    },
    {
        type: 'input',
        name: 'officeNumber',
        default: 100,
        message: 'Enter Office Number',
        when: (answers) => answers.role === 'Manager'
    },
    {
      type: 'input',
      name: 'github',
      default: 'rginsberg549',
      message: 'What is your github username?',
      when: (answers) => answers.role === 'Engineer'
  },
  {
    type: 'input',
    name: 'school',
    default: 'agoura',
    message: 'What school did you go to?',
    when: (answers) => answers.role === 'Intern'
}

]

function promptUser() {
  inquirer.registerPrompt('recursive', require('inquirer-recursive'));
  
  return inquirer.prompt({
    type: 'recursive',
    message: "Would you like to add another team member?",
    prompts: questions
  });
}

function employeeFactory(answers) {
  if(answers.role === 'Manager')
    return new Manager(answers.name, answers.id, answers.email, answers.officeNumber);

  if(answers.role === 'Engineer')
    return new Engineer(answers.name, answers.id, answers.email, answers.github);

  if(answers.role === 'Intern');
    return new Intern(answers.name, answers.id, answers.email, answers.school)
};

function build_team(employees) {
  if (!fs.existsSync(OUTPUT_DIR)) {
    console.log(OUTPUT_DIR)
    fs.mkdirSync(OUTPUT_DIR);
  }
  fs.writeFile(outputPath, render(employees),function(err, result) {
    console.log(outputPath)
    if(err) {
      console.log('error', err)
    };
  })};

promptUser()
  .then(function(data) {
    const employees = data.undefined.map((element)=> employeeFactory(element))
    return build_team(employees);
  })
  .catch(function(err) {
    console.log(err);
  });


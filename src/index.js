const inquirer = require('inquirer');
const axios = require('axios');

const hygie = 'http://URL/webhook';

const choice = async () => {
  return await inquirer
    .prompt([
      {
        type: 'list',
        name: 'git',
        message: 'Git?',
        choices: ['Github', 'Gitlab'],
        filter: function(val) {
          return val.toLowerCase();
        },
      },
      {
        type: 'list',
        name: 'event',
        message: 'Event?',
        choices: [
          'Push',
          'NewBranch',
          'NewIssue',
          'NewPR',
          'IssueComment',
          'PRComment',
        ],
        filter: function(val) {
          return val.toLowerCase();
        },
      },
    ])
    .then(async answers => {
      const data = await require('./events/' + answers.event)(answers.git);
      axios
        .post(hygie, data, {
          headers: {
            'Content-Type': 'application/json',
            'X-Gitlab-Token': 'CfgwQp7KDaDAtVT91i1V',
          },
        })
        .then(async () => {
          await choice();
        })
        .catch(err => {
          console.error(err);
        });
    });
};

choice();

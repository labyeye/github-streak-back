const jsonfile = require('jsonfile');
const moment = require('moment');
const simpleGit = require('simple-git');

const FILE_PATH = './data.json';

// Specify the date for which you want to make multiple contributions
const date = '2024-09-22T12:00:00Z';
const formattedDate = moment(date).format('YYYY-MM-DDTHH:mm:ssZ'); // ISO format

// Number of contributions you want to make for the specified date
const numContributions = 1; // Example: 5 contributions

// Initialize git
const git = simpleGit();

// Function to perform the write, commit, and push operation
function makeContribution(contributionNumber, callback) {
    const data = { 
        date: formattedDate, 
        contribution: `Contribution #${contributionNumber}` // Unique content to make each commit different
    };

    // Write to JSON file
    jsonfile.writeFile(FILE_PATH, data, { spaces: 2 }, (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return callback(err);
        }

        // Add, commit with specific date, and push
        git.add([FILE_PATH])
            .commit(`Update date to ${formattedDate} - Contribution #${contributionNumber}`, { '--date': formattedDate }, (commitErr) => {
                if (commitErr) {
                    console.error('Error committing:', commitErr);
                    return callback(commitErr);
                }

                git.push((pushErr) => {
                    if (pushErr) {
                        console.error('Error pushing:', pushErr);
                        return callback(pushErr);
                    }

                    console.log(`Contribution #${contributionNumber} committed and pushed successfully for date ${formattedDate}!`);
                    callback(null); // Proceed to the next contribution
                });
            });
    });
}

// Function to loop through the number of contributions and make them sequentially
function makeMultipleContributions(numContributions) {
    let count = 0;

    function next() {
        if (count < numContributions) {
            makeContribution(count + 1, (err) => {
                if (!err) {
                    count++;
                    next(); // Move to the next contribution
                }
            });
        } else {
            console.log('All contributions completed for the specified date!');
        }
    }

    next(); // Start the process
}

// Start making multiple contributions for the specified date
makeMultipleContributions(numContributions);

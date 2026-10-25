// Lab 4 storage: issues kept in backend/data/issues.json (local machine only).
// Used automatically while DATABASE_URL is empty (Parts 1 to 8 of Lab 5).
const fs = require('fs/promises');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'issues.json');

async function readIssues() {
  // read the WHOLE file every time
  const text = await fs.readFile(DATA_FILE, 'utf8');
  return JSON.parse(text);
}

async function writeIssues(issues) {
  // rewrite the WHOLE file every time
  await fs.writeFile(DATA_FILE, JSON.stringify(issues, null, 2) + '\n');
}

async function createIssue({ title, description, priority }) {
  const issues = await readIssues();
  const issue = {
    id: `ISS-${Date.now()}`,               // our code invents the id
    title: title.trim(),
    description: description.trim(),
    priority,
    status: 'Open',                        // our code sets the default
    createdAt: new Date().toISOString()    // our code sets the time
  };
  issues.push(issue);
  await writeIssues(issues);
  return issue;
}

async function updateIssueStatus(id, status) {
  const issues = await readIssues();
  const issue = issues.find((item) => item.id === id);
  if (!issue) {
    return null;                           // controller answers 404
  }
  issue.status = status;
  await writeIssues(issues);
  return issue;
}

module.exports = { readIssues, createIssue, updateIssueStatus };

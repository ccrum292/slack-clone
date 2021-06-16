const fs = require('fs')
const exec = require('child_process').exec
const path = require('path');
const async = require('async') // npm install async 

const scriptsFolder = path.join(__dirname, "./all") // add your scripts to folder named scripts

const files = fs.readdirSync(scriptsFolder) // reading files from folders
const funcs = files.map(function(file) {
  return exec.bind(null, `node ${path.join(scriptsFolder, file)}`) // execute node command
})

function getResults(err, data) {
  if (err) {
    return console.log(err)
  }
  const results = data.map(function(lines){
    return lines.join('') // joining each script lines
  })
  console.log(results)
}

// to run your scipts in parallel use
async.parallel(funcs, getResults)

// to run your scipts in series use
// async.series(funcs, getResults)
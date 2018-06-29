sharinPixImport = require '../sharinpix-import.js'
fs = require 'fs'

module.exports = ->
  [ Bright, FgRed ] = [ "\x1b[1m", "\x1b[31m" ]

  if process.argv.length is 5
    filePath = process.argv[2]
    successFilePath = process.argv[3]
    errorFilePath = process.argv[4]

    if fs.existsSync(filePath)
      sharinPixImport filePath, successFilePath, errorFilePath
    else
      console.log Bright, FgRed, "Error: Could not find file #{ filePath }."
  else
    console.log Bright, FgRed, 'Error: Insufficient number of arguments.'
    
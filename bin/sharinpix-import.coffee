sharinPixImport = require '../sharinpix-import.js'
fs = require 'fs'

module.exports = ->
  [ Bright, FgRed ] = [ "\x1b[1m", "\x1b[31m" ]

  unless process.argv.length is 5
    console.log Bright, FgRed, 'Error: Insufficient number of arguments.'
  else
    filePath = process.argv[2]
    successFilePath = process.argv[3]
    errorFilePath = process.argv[4]
    
    unless fs.existsSync(filePath)
      console.log Bright, FgRed, "Error: Could not find file #{ filePath }."
    else
      sharinPixImport filePath, successFilePath, errorFilePath
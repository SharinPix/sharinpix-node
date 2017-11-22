`import $ from 'jquery';`
`import css from './demo.sass';`
`export default {};`
$ ->
  $('#sharinpixurl').change (e)->
    window.sharinpix.configure($('#sharinpixurl').val())
  $('#upload').change (e)->
    for file in this.files
      window.sharinpix.upload file, 'super_test', externalId: 'just a test'
        .then (image)->
          console.log image
  $('#import').change (e)->
    for file in this.files
      console.log file
      reader = new FileReader()
      reader.onload = (e)->
        window.sharinpix.multiupload e.target.result, 'super_test', (done)->
          console.log 'Import done !'
      reader.readAsText(file)

`import $ from 'jquery';`
`import css from './demo.sass';`
`export default {};`
$ ->
  $('input#files').change (e)->
    window.sharinpix.configure($('#sharinpixurl').val())
    console.log $('#sharinpixurl').val()
    for file in this.files
      window.sharinpix.upload(file, 'super_test').then (image)->
        console.log image

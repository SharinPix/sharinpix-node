`import $ from 'jquery';`
`import _ from 'lodash';`
`import css from './demo.sass';`
`export default {};`
$ ->
  Sharinpix = window.sharinpix
  client = new Sharinpix(
    '',
    ''
  )
  $('input').change (e)->
    for file in this.files
      client.upload(file, 'super_test')

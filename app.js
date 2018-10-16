document.addEventListener('DOMContentLoaded', function () {

  const EDITOR = document.getElementById('editor')
  const CONSOLE = document.getElementById('console')
  const PREVIEW = document.getElementById('preview')
  const consoleLog = console.log // save the original logging for debugging
  let state = [] // state is the string inside of EDITOR

  // mimic the log function for the user
  console.log = function (message) {
    if (typeof message == 'object') {
      return (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />'
    } else {
      return message + '<br />'
    }
  }

  EDITOR.addEventListener('keydown', function (e) {
    // try for auto-complete of last line only
    setTimeout(function() {
      state = EDITOR.value.trim().split('\n')
      try {
        PREVIEW.innerHTML = eval(state[state.length - 1])
      } catch (e) {} // we ignore the error, since it's just a preview of the last line
    }, 0)

    if (e.keyCode === 13) {  // checks whether the pressed key is "Enter"

      // we save the preview to append if the full evaluation errors
      // otherwise, we don't want to append the same thing twice
      let previewLineNode = document.createElement('li')
      previewLineNode.innerHTML = PREVIEW.innerHTML
      PREVIEW.innerHTML = ''

      setTimeout(function() {
        try {

          let fullInputEvaluationNode = document.createElement('li')
          fullInputEvaluationNode.setAttribute('class', 'console-line')
          fullInputEvaluationNode.innerHTML = eval(EDITOR.value)
          CONSOLE.appendChild(fullInputEvaluationNode)
          PREVIEW.innerHTML = ''

        } catch (e) {

          CONSOLE.appendChild(previewLineNode)
          let errorNode = document.createElement('li')
          errorNode.setAttribute('class', 'console-error')
          errorNode.innerHTML = e.message
          CONSOLE.appendChild(errorNode)
        }
      }, 0)
    }
  })
})

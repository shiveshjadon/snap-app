const {PythonShell} = require('python-shell')
const pyshell = new PythonShell('spacy-listen.py')


let message = "There's no way it's not better than 2021, right? Right? Hi, what's up? MKBHD here. We made it to 2022, all right? So, there was tech happening still in the past year. In 2021, we had some truly great new computers. We had plenty of interesting and unique smartphones. The mirrorless camera world took a step up. There were good EVs and a bunch of even better EV promises. The PS5 is a whole year old and still impossible to get. But now, it's time to look forward. This is a little tradition I've started, at sort of the beginning of each new year, where I look forward at the next year in tech.";

console.log(message)
pyshell.send(message)

pyshell.on('message', (message) => {
  console.log(message)
})

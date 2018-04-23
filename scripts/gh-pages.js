const ghpages = require('gh-pages')

ghpages.publish('samples/web', {
  repo: 'seerline.github.com:seerline/clchart.git'
}, (err) => {
  if (!err) {
    return console.log('deploy success')
  }
  console.log(`deploy error ${err}`)
})

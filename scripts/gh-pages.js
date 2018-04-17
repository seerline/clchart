const ghpages = require('gh-pages')

ghpages.publish('samples', (err) => {
  console.log(err)
})

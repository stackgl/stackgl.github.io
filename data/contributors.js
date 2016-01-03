const request = require('request')
const path = require('path')
const fs = require('fs')

const dest = path.join(__dirname, '..', 'build', 'contributors.json')

contributors(function (err, list) {
  if (err) throw err
  fs.writeFileSync(dest, JSON.stringify(list))
})

function contributors (done) {
  request('http://stack.gl/packages/index.json', {
    json: true
  }, function (err, res, body) {
    if (err) return done(err)

    const repos = Object.keys(body.repos).reduce(function (repos, category) {
      return repos.concat(body.repos[category])
    }, [])

    const contributors = body.contributors

    repos.forEach(function (repo) {
      repo.contrib.forEach(function (idx) {
        contributors[idx].count = contributors[idx].count || 0
        contributors[idx].count++
      })
    })

    done(null, contributors.sort(function (a, b) {
      return b.count - a.count
    }))
  })
}

var
express = require('express'),
mongodb = require('mongodb'),
formidable = require('formidable'),
app = express(),
form = formidable({uploadDir: '/home/rikyperdana/Github/autoForm/uploads'})

app.post('/upload', (req, res, next) =>
  form.parse(req, (err, fields, files) =>
    err ? console.log(err) : res.json({fields, files})
  )
)

app.use(express.static('public')).listen(3000)
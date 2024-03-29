var
fs = require('fs'),
uploadDir = '/home/rikyperdana/Github/autoForm/uploads',
express = require('express'),
mongodb = require('mongodb'),
formidable = require('formidable'),
form = formidable({uploadDir}),

app = express()
.use(express.json())
.post('/upload', (req, res) => // #1
  form.parse(req, (err, fields, files) =>
    res.json(files)
  )
)
.post('/unload', (req, res) => fs.unlink(
  './uploads/' + req.body.id,
  err => !err && res.json({status: true})
))
.use(express.static('public'))
.use('/uploads', express.static('uploads')) // #2
.listen(3000)

// #1 & #2 only required if your form needs file upload

var
uploadDir = '/home/rikyperdana/Github/autoForm/uploads'
express = require('express'),
mongodb = require('mongodb'),
formidable = require('formidable'),
form = formidable({uploadDir}),

app = express()
.use(express.json())
.post('/upload', (req, res) =>
  form.parse(req, (err, fields, files) =>
    res.json(files)
  )
)
.use(express.static('public'))
.use('/uploads', express.static('uploads'))
.listen(3000)
var
express = require('express'),
mongodb = require('mongodb'),
formidable = require('formidable'),
fileServer = formidable({uploadDir: '/home/rikyperdana/Github/autoForm/uploads'}),
app = express()

app.post('/api/upload', (req, res, next) =>
  fileServer.parse(req, (err, fields, files) =>
    res.json({fields, files})
  )
)

app.use(express.static('public')).listen(3000)
var
express = require('express'),
mongodb = require('mongodb'),

app = express().use(express.static('public')).listen(3000)
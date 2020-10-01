var samples = [
  {
    short: 'cv', full: 'Curriculum Vitae',
    schema: {
      personal: {type: Object},
      'personal.name': {type: String, label: 'Full Name'},
      'personal.dob': {type: Date, label: 'Date of birth'},
      'personal.address': {type: String, label: 'Home address', optional: true},
      'personal.phone': {type: Number, label: 'Phone number', optional: true},
      'personal.gender': {type: Number, label: 'Gender', optional: true},
      'personal.nationality': {type: String, label: 'Nationality', optional: true},
      education: {type: Array},
      'education.$': {type: Object},
      'education.$.institution': {type: String},
      'education.$.entry': {type: Date, label: 'Entry year'},
      'education.$.complete': {type: Date, label: 'Year completed'}
    }
  }
]

_.assign(comp, {samples: () => m('.content',
  m('h1', 'Sample forms'),
  m('ul', samples.map(i => m('a',
    {onclick: state = {
      route: 'dashboard', doc: {
        schema: _.map(i.schema, (val, key) => ({
          [key]: _.assign(val, {type: val.type.name})
        })).reduce((acc, inc) => _.merge(acc, inc), {}),
        arangement: i.arangement
      }
    }},
    m('li', i.full)
  )))
)})

var samples = [
  {
    short: 'calc', full: 'BMI Calculator',
    schema: {
      height: {type: Number},
      weight: {type: Number, autoRedraw: true},
      bmi: {
        type: Number, label: 'BMI Index',
        autoform: {type: 'readonly'},
        autoValue: (name, doc) => doc && Math.floor(
          +doc.weight / (Math.pow(+doc.height, 2)) * 1e6
        ) / 100
      }
    },
    arangement: {top: [['height', 'weight', 'bmi']]}
  },
  {
    short: 'cv', full: 'Curriculum Vitae',
    schema: {
      personal: {type: Object},
      'personal.name': {type: String, label: 'Full Name'},
      'personal.dob': {type: Date, label: 'Date of birth'},
      'personal.address': {type: String, label: 'Home address', optional: true},
      'personal.phone': {type: Number, label: 'Phone number', optional: true},
      'personal.gender': {type: Number, label: 'Gender', optional: true, autoform: {
        type: 'select', options: () => ['male', 'female'].map((val, key) => ({
          value: key, label: _.startCase(val)
        }))
      }},
      'personal.nationality': {type: String, label: 'Nationality', optional: true},
      educations: {type: Array},
      'educations.$': {type: Object},
      'educations.$.institution': {type: String},
      'educations.$.entry': {type: Date, label: 'Entry year'},
      'educations.$.complete': {type: Date, label: 'Year completed'},
      skills: {type: Array},
      'skills.$': {type: String},
      works: {type: Array},
      'works.$': {type: Object},
      'works.$.place': {type: String},
      'works.$.from': {type: Date},
      'works.$.to': {type: Date},
      achievements: {type: Array},
      'achievements.$': {type: String}
    },
    arangement: {
      top: [
        ['personal'],
        ['educations', 'skills'],
        ['works', 'achievements']
      ],
      personal: [
        ['name', 'gender', 'dob'],
        ['address', 'phone', 'nationality']
      ]
    }
  }
]

_.assign(comp, {samples: () => m('.content',
  m('h1', 'Sample forms'),
  m('ul', samples.map(i => m('a',
    {onclick: () => [state = {
      route: 'dashboard', doc: {
        schema: _.map(i.schema, (val, key) => ({
          [key]: _.assign(val, {type: val.type.name})
        })).reduce((acc, inc) => _.merge(acc, inc), {}),
        arangement: i.arangement
      }
    }, m.redraw()]},
    m('li', i.full)
  ))),
  m('p.help', 'Note: Every sample source code are stored in ./samples.js')
)})

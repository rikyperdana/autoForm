var samples = [
  {
    title: 'Seconds Counter',
    schema: {
      start: {type: Date, autoform: {type: 'datetime-local'}},
      end: {type: Date, autoform: {type: 'datetime-local'}, autoRedraw: true},
      difference: {
        type: Number, label: 'Difference in seconds',
        autoform: {type: 'readonly'},
        autoValue: (name, doc) =>
          doc && (doc.start && doc.end) &&
          (+(new Date(doc.end)) - +(new Date(doc.start))) / 1000
      }
    },
    layout: {top: [['start', 'end', 'difference']]}
  },
  {
    title: 'Animal Species',
    schema: {
      animal: {type: Array},
      'animal.$': {type: Object},
      'animal.$.class': {
        type: String, autoRedraw: true, autoform: {
          type: 'select', options: () => _.keys(animals).map(
            i => ({value: i, label: _.startCase(i)})
          )
        }
      },
      'animal.$.family': {type: String, autoform: {
        type: 'select', options: (name, doc) =>
          (animals[_.get(
            doc, 'animal.'+name.split('.')[1]+'.class'
          )] || [])
          .map(i => ({value: i, label: _.startCase(i)}))
      }},
      'animal.$.species': {type: String}
    },
    layout: {
      'animal.$': [['class', 'family', 'species']]
    }
  },
  {
    title: 'Sign Up',
    schema: {
      fullName: {type: String},
      username: {type: String},
      password: {
        type: String, regExp: ".{8,}",
        autoform: {type: 'password', help: 'Note: 8 characters minimum'}
      },
      email: {
        type: String, regExp: "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
      }
    },
    layout: {top: [['fullName', 'email'], ['username', 'password']]}
  },
  {
    title: 'BMI Calculator',
    schema: {
      height: {type: Number},
      weight: {type: Number, autoRedraw: true},
      bmi: {
        type: Number, label: 'BMI Index',
        autoform: {type: 'readonly'}, exclude: true,
        autoValue: (name, doc) => doc && Math.floor(
          +doc.weight / (Math.pow(+doc.height, 2)) * 1e6
        ) / 100
      }
    },
    layout: {top: [['height', 'weight', 'bmi']]}
  },
  {
    title: 'Curriculum Vitae',
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
    layout: {
      top: [
        ['personal'],
        ['educations', 'skills'],
        ['works', 'achievements']
      ],
      personal: [
        ['name', 'gender', 'dob'],
        ['address', 'phone', 'nationality']
      ],
      'educations.$': [
        ['institution'],
        ['entry', 'complete']
      ],
      'works.$': [['place'], ['from', 'to']]
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
        layout: i.layout
      }
    }, m.redraw()]},
    m('li', i.title)
  ))),
  m('p.help', 'Note: Every sample source code are stored in ./samples.js')
)})

// list of animals for Animal Species form
var animals = {
  mammal: ['dog', 'cat', 'monkey'],
  birds: ['duck', 'chicken', 'pigeon']
}

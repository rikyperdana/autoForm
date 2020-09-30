var m, _, autoForm

m.mount(document.body, {view: () =>
  m('.container', m(autoForm({
    id: 'insertContact',
    action: console.log,
    schema: {
      name: {type: String, label: 'Full Name'},
      age: {type: Number, minMax: () => [18, 65]},
      birth: {type: Date, autoform: {type: 'datetime-local'}},
      family: {type: Object},
      'family.father': {type: String},
      'family.mother': {type: String},
      siblings: {type: Array},
      'siblings.$': {type: String}
    },
    submit: {value: 'Save', class: 'is-info'},
    autoReset: true,
    confirmMessage: 'Are you sure to submit it?',
    arangement: {
      top: [
        ['name', 'age', 'birth'],
        ['family', 'siblings']
      ],
      family: [['father', 'mother']]
    }
  })))
})

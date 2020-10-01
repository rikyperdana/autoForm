var m, _, autoForm, state = {}, comp = {}

_.assign(comp, {
  navbar: () => m('nav.navbar.is-primary.is-fixed-top',
    m('.navbar-brand',
      m('a.navbar-item',
        {href: "https://github.com/rikyperdana/autoform"},
        'AutoForm'
      ),
      m('.navbar-burger',
        {
          role: 'button', class: state.burgerMenu && 'is-active',
          onclick: () => state.burgerMenu = !state.burgerMenu
        },
        _.range(3).map(i => m('span'))
      )
    ),
    m('.navbar-menu',
      m('.navbar-start',
        ['demo', 'samples'].map(i =>
          m('a.navbar-item',
            {onclick: () => _.assign(state, {
              route: i, burgerMenu: null
            })},
            m('span', _.startCase(i))
          )
        )
      ),
      m('.navbar-end')
    )
  ),

  dashboard: () => m('.content',
    state.schema && [
      m('label.label', m('span', 'Generated form')),
      m('.box', m(autoForm({
        id: 'renderedForm',
        schema: state.schema,
        arangement: state.arangement,
        action: doc => state.formResult = doc,
        submit: {class: 'is-success'}
      })))
    ],
    m('.columns',
      state.schema && m('.column', m('form',
        m('label.label', m('span', 'Submited result')),
        m('textarea.textarea', {
          rows: 16,
          value: JSON.stringify(
            state.formResult || {},
            null, 4
          )
        })
      )),
      m('.column', m(autoForm({
        id: 'demo',
        schema: {
          schema: {
            type: String, autoform: {
              type: 'textarea', rows: 16
            }
          },
          arangement: {
            type: String, optional: true,
            label: 'Arangement (optional)',
            autoform: {type: 'textarea', rows: 16}
          }
        },
        arangement: {top: [['schema', 'arangement']]},
        submit: {value: 'Render'},
        doc: {
          schema: JSON.stringify({
            name: {type: 'String'},
            dob: {type: 'Date', label: 'Date of birth'},
            phone: {type: 'Number', optional: true},
            address: {type: 'String', optional: true}
          }, null, 4),
          arangement: JSON.stringify({
            top: [['name', 'dob', 'phone'], ['address']]
          }, null, 4)
        },
        action: doc => _.assign(state, {
          schema: _.map(JSON.parse(doc.schema), (val, key) =>
            ({[key]: _.assign(val, {type: eval(val.type)})})
          ).reduce((acc, inc) => _.merge(acc, inc), {}),
          arangement: JSON.parse(doc.arangement)
        })
      })))
    )
  )
})

m.mount(document.body, {view: () => m('div',
  {class: 'has-background-light'},
  comp.navbar(),
  m('section.section', m('.container',
    {style: 'min-height:100vh'},
    m('br'), m('br'),
    comp[state.route || 'dashboard']()
  ))
)})

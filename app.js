var m, _, autoForm, state = {}, comp = {},
ors = array => array.find(Boolean)

_.assign(comp, {
  navbar: () => m('nav.navbar.is-primary.is-fixed-top',
    m('.navbar-brand',
      m('a.navbar-item', {
        onclick: () => state.route = 'dashboard'
      }, 'AutoForm'),
      m('.navbar-burger',
        {
          role: 'button', class: state.burgerMenu && 'is-active',
          onclick: () => state.burgerMenu = !state.burgerMenu
        },
        _.range(3).map(i => m('span'))
      )
    ),
    m('.navbar-menu',
      {class: state.burgerMenu && 'is-active'},
      m('.navbar-start',
        ['samples'].map(i =>
          m('a.navbar-item',
            {onclick: () => [
              _.assign(state, {
                route: i, burgerMenu: null
              }), m.redraw()
            ]},
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
          rows: 17,
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
              type: 'textarea', rows: 17
            }
          },
          arangement: {
            type: String, optional: true,
            label: 'Arangement (optional)',
            autoform: {type: 'textarea', rows: 17}
          }
        },
        arangement: {top: [['schema', 'arangement']]},
        submit: {value: 'Render'},
        // allow doc to contain selected samples
        doc: {
          schema: state.doc ?
          JSON.stringify(
            state.doc.schema,
            (key, val) => typeof(val) === 'function' ? val+'' : val
            , 4
          )
          : JSON.stringify({
            name: {type: 'String'},
            dob: {type: 'Date', label: 'Date of birth'},
            phone: {type: 'Number', optional: true},
            address: {type: 'String', optional: true}
          }, null, 4),
          arangement: state.doc ?
          JSON.stringify(state.doc.arangement, null, 4)
          : JSON.stringify({
            top: [['name', 'dob', 'phone'], ['address']]
          }, null, 4)
        },
        action: doc => _.assign(state, {
          schema: JSON.parse(
            doc.schema,
            (key, val) => ors([
              key === 'options' && eval(val),
              key === 'autoValue' && eval(val),
              val === 'String' && String,
              val === 'Number' && Number,
              val === 'Date' && Date,
              val === 'Object' && Object,
              val === 'Array' && Array
            ]) || val
          ),
          arangement: doc.arangement && JSON.parse(doc.arangement)
        })
      })), m('p.help', "Notice: If you're going to copy the schema into your project, then make sure that you follow the formating in the repository Readme page. Because only copy/paste isn't going to work."))
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

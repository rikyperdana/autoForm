var m, _, afState = {arrLen: {}, form: {}}, {stringify, parse} = JSON,

autoForm = opts => ({view: () => {
  var normal = name => name.replace(/\d/g, '$'),
  withThis = (obj, cb) => cb(obj),
  ifit = (obj, cb) => obj && cb(obj),
  ors = array => array.find(Boolean),
  ands = array => array.reduce((a, b) => a && b, true),
  findKey = (val, obj) => Object.keys(obj).find(key => obj[key] === val),
  fileData = (key, val) => {form = new FormData(); form.append(key, val); return form}
  dateValue = (timestamp, hour) => {
    var date = new Date(timestamp),
    zeros = num => num < 10 ? '0' + num : '' + num,
    dateStamp = [
      date.getFullYear(),
      zeros(date.getMonth() + 1),
      zeros(date.getDate())
    ].join('-'),
    hourStamp = 'T' + zeros(date.getHours()) + ':' + zeros(date.getMinutes())
    return !hour ? dateStamp : dateStamp + hourStamp
  },

  linearize = obj => {
    var recurse = doc => withThis(
      doc[_.keys(doc)[0]],
      value => typeof(value) === 'object' ?
      _.map(value, (val, key) => recurse(
        {[_.keys(doc)[0] + '.' + key]: val}
      )) : doc
    )
    return _.fromPairs(
      _.flattenDeep(recurse({doc: obj})).map(
        i => [_.keys(i)[0].substr(4), _.values(i)[0]]
      )
    )
  }

  afState.form[opts.id] = opts.doc ?
    linearize(opts.doc) : afState.form[opts.id]

  var attr = {
    form: {
      id: opts.id,
      oncreate: opts.oncreate,
      onchange: e => [
        e.redraw = false,
        afState.form[opts.id] = afState.form[opts.id] || {},
        afState.form[opts.id][e.target.name] = e.target.value
      ],
      onsubmit: e => {
        e.preventDefault()
        afState.form[opts.id] = opts.autoReset && null
        var submit = () => opts.action(
          _.filter(e.target, i => i.name && i.value)
          .map(obj => withThis(
            opts.schema[normal(obj.name)].type,
            type => _.reduceRight(
              obj.name.split('.'),
              (res, inc) => ({[inc]: res}),
              obj.value && ors([ // value conversion
                ((type === String) && obj.value),
                ((type === Number) && +(obj.value)),
                ((type === Date) && (new Date(obj.value)).getTime())
              ])
            )
          )).reduce((res, inc) => {
            var recursive = data => ors([
              typeof(data) === 'object' && withThis(
                {key: _.keys(data)[0], val: _.values(data)[0]},
                ({key, val}) => ors([
                  +key + 1 && _.range(+key + 1).map(
                    i => i === +key ? recursive(val) : undefined
                  ),
                  {[key]: recursive(val)}
                ])
              ),
              data
            ])
            return _.merge(res, recursive(inc))
          }, {})
        )
        !opts.confirmMessage ? submit()
        : confirm(opts.confirmMessage) && submit()
      }
    },
    arrLen: (name, type) => ({onclick: () => {
      afState.arrLen[name] = _.get(afState.arrLen, name) || 0
      var dec = afState.arrLen[name] > 0 ? -1 : 0
      afState.arrLen[name] += ({inc: 1, dec})[type]
    }}),
    label: (name, schema) => m('label.label',
      m('span', schema.label || _.startCase(
       name.split('.').map(i => +i + 1 ? +i + 1 : i).join('.')
      )),
      m('span', m('b.has-text-danger', !schema.optional && ' *'))
    )
  },

  inputTypes = (name, schema) => ({

    file: () => m('.field', attr.label(name, schema), withThis(
      _.get(afState.form, [opts.id, name]), thisFile =>
        thisFile ? m('.field.has-addons', [
          m('input.input', {
            readonly: true, disabled: true,
            value: '100% ' + parse(thisFile).ori
          }),
          m('.control', m('.button.is-danger', {
            onclick: () => fetch('/unload', {
              headers: {'Content-Type': 'application/json'},
              method: 'post', body: thisFile
            }).then(res => res.json()).then(
              res => res.status === true &&
              (delete afState.form[opts.id][name]) &&
              m.redraw()
            )
          }, '-'))
        ]) : [
          m('input.button', {
            type: 'file',
            accept: withThis(
              _.get(schema, 'autoform.accept'),
              extList => !extList ? '*' :
                extList.map(i => '.' + i).join(',')
            ),
            onchange: e => ands([
              (_.get(schema, 'autoform.limit') || 1e10)
                > e.target.files[0].size,
              withThis(
                _.get(schema, 'autoform.accept'),
                extList => extList ? extList.includes(
                  e.target.files[0].name.split('.').slice(-1)[0]
                ) : true
              )
            ]) && fetch('/upload', {
              method: 'post', body: fileData(name, e.target.files[0])
            }).then(res => res.json()).then(res => _.assign(
              afState.form[opts.id], {[name]: stringify({
                id: res[name].newFilename,
                ori: res[name].originalFilename,
                size: res[name].size,
                ext: res[name].mimetype.split('/')[1]
              })}
            ) && m.redraw())
          }),
          m('p.help', _.get(schema, 'autoform.help'))
        ]
    ), m('input.input', {
      type: 'hidden', name: !schema.exclude ? name : '',
      value: _.get(afState.form, [opts.id, name])
    })),

    hidden: () => m('input.input', {
      type: 'hidden', name: !schema.exclude ? name : '',
      value: schema.autoValue &&
        schema.autoValue(name, afState.form[opts.id], opts)
    }),

    readonly: () => m('.field',
      attr.label(name, schema),
      m('input.input', {
        readonly: true, name: !schema.exclude ? name : '', disabled: true,
        value: schema.autoValue(name, afState.form[opts.id], opts)
      }),
      m('p.help', _.get(schema, 'autoform.help'))
    ),

    "datetime-local": () => m('.field',
      attr.label(name, schema),
      m('.control', m('input.input', {
        type: 'datetime-local',
        name: !schema.exclude ? name: '',
        required: !schema.optional,
        value: dateValue(_.get(afState.form, [opts.id, name]), true),
        onchange: schema.autoRedraw && function(){}
      })),
      m('p.help', _.get(schema, 'autoform.help'))
    ),

    textarea: () => m('.field',
      attr.label(name, schema),
      m('textarea.textarea', {
        name: !schema.exclude ? name : '',
        required: !schema.optional,
        value: _.get(afState.form, [opts.id, name]),
        placeholder: _.get(schema, 'autoform.placeholder'),
        rows: _.get(schema, 'autoform.rows') || 6,
        onchange: schema.autoRedraw && function(){}
      }),
      m('p.help', _.get(schema, 'autoform.help'))
    ),

    password: () => m('.field',
      attr.label(name, schema), m('input.input', {
        name: !schema.exclude ? name : '', pattern: schema.regExp,
        required: !schema.optional, type: 'password',
        placeholder: _.get(schema, 'autoform.placeholder'),
        onchange: schema.autoRedraw && function(){}
      }),
      m('p.help', _.get(schema, 'autoform.help'))
    ),

    select: () => m('.field.is-expanded',
      attr.label(name, schema),
      m('.select.is-fullwidth', m('select',
        {
          name: !schema.exclude ? name : '',
          required: !schema.optional,
          value: _.get(afState.form, [opts.id, name]),
          onchange: schema.autoRedraw && function(){}
        },
        m('option', {value: ''}, '-'),
        schema.autoform.options(name, afState.form[opts.id])
        .map(i => m('option', {
          value: i.value,
          selected: !!_.get(afState.form, [opts.id, name])
        }, i.label))
      )),
      m('p.help', _.get(schema, 'autoform.help'))
    ),

    standard: () => ors([
      schema.type === Object && m('.box',
        attr.label(name, schema),
        withThis(
          _.map(opts.schema, (val, key) =>
            _.merge(val, {name: key})
          ).filter(i => withThis(
            str => _.size(_.split(str, '.')),
            getLen => _.every([
              _.includes(i.name, normal(name) + '.'),
              getLen(name) + 1 === getLen(i.name)
            ])
          )).map(i => withThis(
            {
              childSchema: opts.schema[normal(i.name)],
              fieldName: name + '.' + _.last(i.name.split('.'))
            },
            ({childSchema, fieldName}) => ({[fieldName]: () =>
              inputTypes(fieldName, childSchema)
              [_.get(childSchema, 'autoform.type') || 'standard']()
            })
          )),
          fields =>
            _.get(opts.layout, normal(name)) ?
            opts.layout[normal(name)].map(i => m('.columns',
              i.map(j => m('.column', fields.find(
                k => k[name + '.' + j]
              )[name + '.' + j]()))
            )) : fields.map(i => _.values(i)[0]())
        ),
        m('p.help', _.get(schema, 'autoform.help'))
      ),

      schema.type === Array && m('.box',
        attr.label(name, schema),
        !schema.fixed && m('.tags',
          m('.tag.is-success', attr.arrLen(name, 'inc'), 'Add+'),
          m('.tag.is-warning', attr.arrLen(name, 'dec'), 'Rem-'),
          m('.tag', afState.arrLen[name]),
        ),
        _.range(
          _.get(opts.doc, name) && opts.doc[name].length,
          afState.arrLen[name]
        ).map(i => withThis(
          opts.schema[normal(name) + '.$'],
          childSchema => inputTypes(name + '.' + i, childSchema)[
            _.get(childSchema, 'autoform.type') || 'standard'
          ]()
        )),
        m('p.help', _.get(schema, 'autoform.help'))
      ),

      m('.field',
        attr.label(name, schema),
        m('.control', m('input.input', {
          step: 'any', name: !schema.exclude ? name : '',
          placeholder: _.get(schema, 'autoform.placeholder'),
          value: ors([
            schema.autoValue &&
            schema.autoValue(name, afState.form[opts.id], opts),
            schema.type === Date &&
            dateValue(_.get(afState.form, [opts.id, name])),
            _.get(afState.form, [opts.id, name])
          ]),
          required: !schema.optional, pattern: schema.regExp,
          min: schema.minMax && schema.minMax(name, afState.form[opts.id])[0],
          max: schema.minMax && schema.minMax(name, afState.form[opts.id])[1],
          onchange: schema.autoRedraw && function(){},
          type: findKey(schema.type, {date: Date, text: String, number: Number})
        })),
        m('p.help', _.get(schema, 'autoform.help'))
      )
    ])
  }),

  fields = _.map(opts.schema, (val, key) =>
    !_.includes(key, '.') && {
      [key]: () => inputTypes(key, val)[
        _.get(val, 'autoform.type') || 'standard'
      ]()
    }
  ).filter(Boolean)

  return m('form', attr.form,
    _.get(opts, 'layout.top') ?
    opts.layout.top.map(i => m('.columns', i.map(
      j => m('.column', fields.find(k => k[j])[j]())
    ))) : fields.map(i => _.values(i)[0]()),
    m('.row', m('button.button',
      _.assign({type: 'submit', class: 'is-info'}, opts.submit),
      _.get(opts, 'submit.value') || 'Submit'
    ))
  )
}})
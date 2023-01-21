_.assign(comp, {upload: () => m('.content',
  m('h1', 'File Upload'),
  m(autoForm({
    id: 'uploader', action: console.log,
    schema: {
      file: {type: String, autoform: {
        type: 'file', api: '/upload'
      }}
    }
  }))
)})
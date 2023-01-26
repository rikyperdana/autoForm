_.assign(comp, {upload: () => m('.content',
  m('h1', 'File Upload'),
  m(autoForm({
    id: 'uploader', action: console.log,
    schema: {
      archive: {type: String, autoform: {
        type: 'file'
      }}
    }
  }))
)})
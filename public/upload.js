_.assign(comp, {upload: () => m('.content',
  m('h1', 'File Upload'),
  m('form', {
    action: '/api/upload',
    enctype: 'multipart/form-data',
    method: 'post'
  }, [
    m('input', {type: 'text', name: 'title'}),
    m('input', {type: 'file', name: 'file'}),
    m('input', {type: 'submit', value: 'Upload'})
  ])
)})
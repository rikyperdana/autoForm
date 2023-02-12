# AutoForm

[Demo](https://rikyperdana.github.io/autoForm/)

Submit anything and get the result in JSON

## Introduction
AutoForm is a general purpose form maker, inspired from Meteor AutoForm library that serves similiar purpose of generating a form which follow defined schemas. You may take this project as a standalone boilerplate or copy some of it's parts to be included in your project or anything you see fit.
This project is composed of functions that returns Mithril virtual DOMs, therefore understanding MithrilJS first is suggested. The `autoForm` function itself only contains of less than 300 lines of code, intededly made simple so you can freely modify this function. Express.js is not required.

## Quickstart
```
git clone https://github.com/rikyperdana/autoform
npm install
node server.js
```

## Usage Example
```javascript
m(autoForm({
  id: 'testForm',
  action: console.log,
  schema: {
    name: {type: String},
    age: {type: Number},
    dob: {type: Date, label: 'Date of birth'}
  },
  submit: {value: 'Save', class: 'is-success'}
}))
```

## APIs

### Form options

#### Required
`id` : Name of the form to be created. Ex: 'myForm'

`action` : A function which shall be called after form submission with a callback. Ex: `function(res){return res}`

`schema` : A schema-like object that shares similiarity to meteor autoform library as explained in below section.

#### Optional
`oncreate`: A function which shall be called right after the form was rendered.

`doc`: An object which shall be used to fill the rendered form for update purpose.

`submit`: An object that may contain `value` and `class` property to style the submit button.

`autoReset`: A boolean value to reset the form content after submission or not. The default is `false`.

`confirmMessage`: A prompt message which shall be displayed to confirm form submission.

`layout`: An object which contain layout of fields in columnized manner. Ex:
```
  {top: [
    ['field1', 'field2'],
    ['field3', 'field4', 'field5'],
    ['hiddenField1'] // the hidden fields has to be placed last
  ]}
```

### Schema rules
A schema-object is an object of key:value pairs where the key represents the fieldName and the value represents the schema.
The list below shall demonstrate various examples of schema you can define:
```
name: {type: String},
age: {type: Number, minMax: x => [18, 65]},
birth: {type: Date},
address: {type: String, label: 'Home Adress'},
mobile: {type: Number, optional: true},
gender: {
  type: String, autoRedraw: true,
  autoform: {type: 'select', options: x => [
    {value: 'male', label: 'Male'},
    {value: 'female', label: 'Female'}
  ]}
},
occupation: {type: Number, optional: true, autoform: {
  type: 'select',
  options: (name, doc) => ['student', 'freelance', 'professional'].map(
    (val, index) => ({value: index, label: val})
  )
}},
country_id: {type: String, regExp: '[A-Za-z]{3}'},
work_experience: {type: Object},
'work_experience.company': {type: String, label: 'Company Name'},
'work_experience.years': {type: Number, label: 'Years of experience'},
skills: {type: Array},
'skills.$': {type: String},
education: {type: Array},
'education.$': {type: Object},
'education.$.name': {type: String, label: 'School/University Name'},
'education.$.date': {type: Date, label: 'Graduation date'},
entry_time: {type: Date, autoform: {type: 'datetime-local'}},
excluded: {type: String, exclude: true},
languages: {type: Array, autoform: {
  type: 'checkbox', options: e => [{
    value: 1, label: 'English UK',
    value: 2, label: 'Indonesia'
  }]
}},
'languages.$': {type: Number},
just_info: {
  type: String,
  autoform: {type: 'readonly'},
  autoValue: (name, doc) => name
},
hidden_field: {
  type: String,
  autoform: {type: 'hidden'},
  autoValue: x => 'anything'
},
archive: {
  type: String,
  label: 'attachment',
  autoform: {
    type: 'file', accept: ['pdf', 'docx'],
    help: 'Only accept .pdf or .docx under 150Kb',
    limit: 150000
  }
}
```
### Schema Descriptions
`type`: Data type you want the field to be filled with. Supported types are `String`, `Number`, `Date`, `Object`, `Array`. The following details are:
- `String`: Accepts text value as is.
- `Number`: Accepts only integer, float, or decimal value.
- `Date`: Will return a date string generated by Date function.
- `Object`: A field group that may contain one or more sub-fields.
- `Array`: A field group with increment and decrement buttons of sub-fields.

`label`: Text you want to put as the label right above respective field.

`optional`: Make the field optional. The submission will succeed either the field has value or not. A non-optional field will be marked with red colored asterix next to the label.

`minMax`: If the type is Number or Date, you can set the minimum and maximum value for the field. Ex: `function(name, doc){return ['2019-09-30', '2020-10-01']}`

`exclude`: Accepts Boolean value that represents the field value is to be included upon submission or not.

`regExp`: A string of Regular Expression to check the field value against.

`autoform`: A property to contain form-specific options which may contain below properties.

`autoform.type`: Type of field you want the field to appear as. The variations are: `select`, `textarea`, `readonly`, `hidden`, and more in the future. The following details are:
- `select`: display a selection field with custom value and label.
- `textarea`: display a widened field for long text.
- `readonly`: display a pre-filled field with customizable value.
- `hidden`: display nothing on the page, yet retains the determined value upon submission.
- `file`: used to create single file uploader which shall store `fileId, originalName, fileExtension, fileSize`. Built with Formidable.js from npm library, thus express.js required.

`autoform.options`: If `autoform: {type: 'select'}` is used, return a function that return an array that contains `value` and `label` properties. Two callbacks are provided `(name, doc)` to help customization.

`autoform.limit`: Used to limit file size (in bytes) before uploaded to server.

`autoform.accept`: An array of file extensions allowed to be uploaded. Ex: `['png', 'jpg']`.

`autoValue`: A function that accepts `(name, doc)` as callbacks where `name` is the respective field name and `doc` are the current values of given form.

`autoRedraw`: Accepts Boolean value that determine `redraw()` behavior of MithrilJS upon respective field `onchange` lifecycle. Useful when you want to redraw the whole form DOM as information changes.

## Dependencies
- MithrilJS: Chosen for it's simplicity and versatility to build vDom based SPA over React or Vue.
- Bulma CSS: A css framework that includes no javascript.
- Lodash FP: Developers utility belt.

All dependencies for this project are served through CDNs.

## Further Development
- Coordinates on map

## Caveat & Known Issues
- Radios and Checkboxes are intetionally left unfeatured as jQuery or the likes are necessary to capture their values.
- MithrilJS `redraw()` nature is to re-render the whole page at each lifecycle. Thus, `redraw()` execution outside the form element shall affect the form as well.

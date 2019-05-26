class FieldsStore {
  constructor() {
    this.fields = {}
    this.fieldsMeta = {}
  }

  getFieldMeta(name) {
    this.fieldsMeta[name] = this.fieldsMeta[name] || {}
    return this.fieldsMeta[name]
  }

  setFieldMeta(name, meta) {
    this.fieldsMeta[name] = meta
  }

  getFieldValuePropValue(fieldMeta) {
    const field = this.getField(fieldMeta.name)
    return {
      value: 'value' in field ? field.value : fieldMeta.initialValue,
    }
  }

  getField(name) {
    return {
      ...this.fields[name],
      name,
    }
  }

  setFields(fields) {
    const nowFields = {
      ...this.fields,
      ...fields,
    }
    this.fields = nowFields
  }

  getAllFieldsName() {
    return Object.keys(this.fieldsMeta)
  }

  getFieldsValue(fieldsName = this.getAllFieldsName()) {
    const fieldsValue = {}
    fieldsName.forEach((name) => {
      const field = this.fields[name]
      fieldsValue[name] = field && field.value
    })
    return fieldsValue
  }
}

export const createFieldsStore = () => new FieldsStore()

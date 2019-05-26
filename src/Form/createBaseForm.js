import Validator from 'async-validator'
import { isEmpty, omit } from 'lodash'

import { cloneElement, getOptionProps, getValueFromEvent } from '../utils'
import { createFieldsStore } from './fields-store'

export const createBaseForm = options => {
  const { fieldMetaProp, fieldDataProp, templateContext } = options
  return WrappedComponent => {
    const Form = {
      data() {
        this.templateContext = templateContext
        this.fieldsStore = createFieldsStore()
        this.cacheBinds = {}
        return {}
      },
      methods: {
        getCacheBind(name, fn) {
          if (!this.cacheBinds[name] || this.cacheBinds[name].oriFn !== fn) {
            this.cacheBinds[name] = {
              fn: fn.bind(this, name),
              oriFn: fn,
            }
          }
          return this.cacheBinds[name].fn
        },
        onCollectCommon(name, ...args) {
          const fieldMeta = this.fieldsStore.getFieldMeta(name)
          if (fieldMeta.change) {
            fieldMeta.change(...args)
          } else if (fieldMeta.originalProps.change) {
            fieldMeta.originalProps.change(...args)
          }

          const value = getValueFromEvent(...args)
          const field = this.fieldsStore.getField(name)
          return {
            field: {
              ...field,
              value,
              touched: true,
            },
            fieldMeta,
          }
        },
        onCollect(name, ...args) {
          const { field, fieldMeta } = this.onCollectCommon(name, ...args)
          const { validate } = fieldMeta
          const newField = {
            ...field,
            dirty: !!validate.length,
          }
          this.setFields({
            [name]: newField,
          })
        },
        onCollectValidate(name, ...args) {
          const { field, fieldMeta } = this.onCollectCommon(name, ...args)
          const { validate } = fieldMeta
          const newField = {
            ...field,
            dirty: !!validate.length,
          }
          this.validateFieldsInternal([newField])
        },
        validateFieldsInternal(fields, options = {}, callback) {
          const allFields = {}
          const allRules = {}
          const allValues = {}
          fields.forEach(field => {
            const { name } = field
            const fieldMeta = this.fieldsStore.getFieldMeta(name)
            const newField = {
              ...field,
              errors: undefined,
            }
            allFields[name] = newField
            allValues[name] = newField.value
            allRules[name] = fieldMeta.validate
          })
          this.setFields(allFields)

          const validator = new Validator(allRules)

          validator.validate(allValues, options, errors => {
            const errorsGroup = {}
            errors &&
              errors.forEach(e => {
                const fieldName = e.field
                const field = errorsGroup[fieldName]
                if (typeof field !== 'object' || Array.isArray(field)) {
                  errorsGroup[fieldName] = { errors: [] }
                }
                errorsGroup[fieldName].errors.push(e)
              })
            const nowAllFields = {}
            const expired = []
            Object.keys(allValues).forEach(name => {
              const nowField = this.fieldsStore.getField(name)
              if (nowField.value !== allValues[name]) {
                expired.push(name)
              } else {
                nowField.errors = errorsGroup[name] && errorsGroup[name].errors
                nowField.validating = false
                nowField.dirty = false
                nowAllFields[name] = nowField
              }
            })
            this.setFields(nowAllFields)
            if (callback) {
              expired.forEach(name => {
                if (!errorsGroup[name]) {
                  errorsGroup[name] = {
                    errors: [],
                  }
                }
                errorsGroup[name].expired = true
                errorsGroup[name].errors.push({
                  field: name,
                  message: `${name} need to revalidate`,
                })
              })

              callback(
                isEmpty(errorsGroup) ? null : errorsGroup,
                this.fieldsStore.getFieldsValue(),
              )
            }
          })
        },
        validateFields() {},
        setFields(fields, callback) {
          this.fieldsStore.setFields(fields)
          if (templateContext) {
            templateContext.$forceUpdate()
          } else {
            this.$forceUpdate()
          }
          if (callback) {
            this.$nextTick(callback)
          }
        },
        getFieldProps(name, options) {
          const { rules = [] } = options
          const fieldOption = {
            name,
            ...options,
          }
          const fieldMeta = this.fieldsStore.getFieldMeta(name)
          if ('initialValue' in fieldOption) {
            fieldMeta.initialValue = fieldOption.initialValue
          }
          const inputProps = {
            ...this.fieldsStore.getFieldValuePropValue(fieldOption),
          }
          const inputAttrs = {}
          const inputListeners = {
            change: this.getCacheBind(name, this.onCollectValidate),
          }
          const meta = {
            ...fieldMeta,
            ...fieldOption,
            validate: rules,
          }
          this.fieldsStore.setFieldMeta(name, meta)
          if (fieldMetaProp) {
            inputAttrs[fieldMetaProp] = name
          }
          if (fieldDataProp) {
            inputAttrs[fieldDataProp] = this.fieldsStore.getField(name)
          }
          return {
            props: omit(inputProps, 'id'),
            domProps: {
              value: inputProps.value,
            },
            attrs: {
              ...inputAttrs,
              id: inputProps.id,
            },
            on: inputListeners,
          }
        },
        getFieldDecorator(fieldName, options = {}) {
          const { props, ...restProps } = this.getFieldProps(fieldName, options)
          return fieldEl => {
            const fieldMeta = this.fieldsStore.getFieldMeta(fieldName)
            const originalProps = getOptionProps(fieldEl)
            fieldMeta.originalProps = originalProps
            const newProps = {
              props: {
                ...props,
                ...this.fieldsStore.getFieldValuePropValue(fieldMeta),
              },
              ...restProps,
            }
            newProps.domProps.value = newProps.props.value
            return cloneElement(fieldEl, {
              ...originalProps,
              ...newProps,
            })
          }
        },
      },
      render(h) {
        return WrappedComponent ? <WrappedComponent /> : null
      },
    }

    if (!WrappedComponent) {
      return Form
    }
  }
}

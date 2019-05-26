const camelizeRE = /-(\w)/g
const camelize = str => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''))
}
export const parseStyleText = (cssText = '', camel) => {
  const res = {}
  const listDelimiter = /;(?![^(]*\))/g
  const propertyDelimiter = /:(.+)/
  cssText.split(listDelimiter).forEach(function(item) {
    if (item) {
      const tmp = item.split(propertyDelimiter)
      if (tmp.length > 1) {
        const k = camel ? camelize(tmp[0].trim()) : tmp[0].trim()
        res[k] = tmp[1].trim()
      }
    }
  })
  return res
}

export function isEmptyElement(c) {
  return !(c.tag || (c.text && c.text.trim() !== ''))
}

export function filterEmpty(children = []) {
  return children.filter(c => !isEmptyElement(c))
}

const filterProps = (props, propsData = {}) => {
  const res = {}
  Object.keys(props).forEach(k => {
    if (k in propsData || props[k] !== undefined) {
      res[k] = props[k]
    }
  })
  return res
}

export const getOptionProps = instance => {
  if (instance.componentOptions) {
    const componentOptions = instance.componentOptions
    const { propsData = {}, Ctor = {} } = componentOptions
    const props = (Ctor.options || {}).props || {}
    const res = {}
    for (const [k, v] of Object.entries(props)) {
      const def = v.default
      if (def !== undefined) {
        res[k] =
          typeof def === 'function' && getType(v.type) !== 'Function'
            ? def.call(instance)
            : def
      }
    }
    return { ...res, ...propsData }
  }
  const { $options = {}, $props = {} } = instance
  return filterProps($props, $options.propsData)
}

export const getSlotOptions = elm => {
  if (elm.fnOptions) {
    return elm.fnOptions
  }

  let { componentOptions } = elm
  if (elm.$vnode) {
    componentOptions = elm.$vnode.componentOptions
  }

  return (componentOptions && componentOptions.Ctor.options) || {}
}

export const getAllChildren = elm => {
  let componentOptions = elm.componentOptions || {}
  if (elm.$vnode) {
    componentOptions = elm.$vnode.componentOptions || {}
  }
  return elm.children || componentOptions.children || []
}

export const isValidElement = elm => {
  return (
    elm &&
    typeof elm === 'object' &&
    'componentOptions' in elm &&
    'context' in elm &&
    elm.tag !== undefined
  )
}

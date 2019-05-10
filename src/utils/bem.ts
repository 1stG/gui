export const classBinding = (className: string) => `class.${className}`

export const bemClassBinding = (prefix: string) => (suffix: string) =>
  classBinding(prefix + suffix)

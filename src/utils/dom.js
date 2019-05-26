export const getValueFromEvent = e => {
  if (!e || !e.target) {
    return e
  }

  return e.target.value
}

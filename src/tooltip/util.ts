export function getOriginPosition(position: string) {
  const pos = position.split(' ')
  let isXDir
  if (pos[0] === 'start' || pos[0] === 'end') {
    isXDir = true
  }
  const main = {
    originX: pos[isXDir ? 0 : 1] || 'center',
    originY: pos[isXDir ? 1 : 0] || 'center',
  }
  const { x, y } = invertPosition(main.originX, main.originY)
  const fallback = {
    originX: isXDir ? x : main.originX,
    originY: !isXDir ? y : main.originY,
  }
  return { main, fallback }
}

export function getOverlayPosition(position: string) {
  const pos = position.split(' ')
  let isXDir
  if (pos[0] === 'start' || pos[0] === 'end') {
    isXDir = true
  }
  const horizontal = pos[isXDir ? 0 : 1] || 'center'
  const vertical = pos[isXDir ? 1 : 0] || 'center'
  const main = {
    overlayX: isXDir ? invertHorizontal(horizontal) : horizontal,
    overlayY: !isXDir ? invertVertical(vertical) : vertical,
  }
  const { x, y } = invertPosition(main.overlayX, main.overlayY)
  const fallback = {
    overlayX: isXDir ? x : main.overlayX,
    overlayY: !isXDir ? y : main.overlayY,
  }
  return { main, fallback }
}

export function invertHorizontal(dir: string) {
  if (dir === 'start') {
    dir = 'end'
  } else if (dir === 'end') {
    dir = 'start'
  }
  return dir
}

export function invertVertical(dir: string) {
  if (dir === 'top') {
    dir = 'bottom'
  } else if (dir === 'bottom') {
    dir = 'top'
  }
  return dir
}

export function invertPosition(x: string, y: string) {
  return { x: invertHorizontal(x), y: invertVertical(y) }
}

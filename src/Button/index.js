export default {
  functional: true,
  render(h, ctx) {
    return (
      <button class="g-btn" {...ctx.data}>
        {ctx.children}
      </button>
    )
  },
}

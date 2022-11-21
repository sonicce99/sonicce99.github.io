export const scrollHandler = () => {
  const titleTag = document.getElementsByClassName("custom-class")

  if (!titleTag || titleTag.length <= 0) {
    return
  }

  let selected_aTag = null
  const titleTag_arr = Array.from(titleTag)

  for (let tag of titleTag_arr) {
    if (tag.getBoundingClientRect().top > -30) {
      selected_aTag = tag.getAttribute("href")
      break
    }
  }

  if (!selected_aTag) {
    selected_aTag = titleTag_arr[titleTag_arr.length - 1].getAttribute("href")
  }

  document.querySelectorAll("aside a.selected").forEach(el => {
    el.classList.remove("selected")
  })

  if (selected_aTag) {
    const toc_selected = document.querySelector(
      `aside a[href="${selected_aTag}"]`
    )
    toc_selected && toc_selected.classList.add("selected")
  }
}

/**
 * 拷贝内容到剪贴板
 * @param text
 */
export function copy2Clipboard(text: string) {
  const inputEl = document.createElement("input")
  inputEl.value = text
  inputEl.readOnly = true
  document.body.appendChild(inputEl)
  inputEl.select()
  inputEl.setSelectionRange(0, inputEl.value.length)
  document.execCommand("Copy")
  document.body.removeChild(inputEl)
}

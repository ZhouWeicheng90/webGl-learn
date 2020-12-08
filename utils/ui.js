export function appendLabel(key, value, min, max, onInputChange = () => { }) {
    const label = document.createElement('label')
    label.style = "display:block;"
    const span1 = document.createElement('span')
    span1.innerText = key
    const input = document.createElement('input')
    input.type = "range"
    input.min = min
    input.max = max
    input.value = value
    const span2 = document.createElement('span')
    span2.innerText = value
    label.appendChild(span1)
    label.appendChild(input)
    label.appendChild(span2)

    input.oninput = function () {
        span2.innerText = input.value
        onInputChange(input.value)
    }
    document.body.appendChild(label)
}

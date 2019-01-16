export default function (data, fileName) {
    let exportContent = ''
    for (let row = 0; row < data.length; row++) {
        if (row !== 0) {
            exportContent += '\n'
        }
        for (let column = 0; column < data[row].length; column++) {
            exportContent += data[row][column] + (column === (data[row].length - 1) ? '' : ',')
        }
    }
    console.log(exportContent)
    let prefix = '\uFEFF' // BOM
    return prefix + exportContent
    // let blob = new Blob([prefix + exportContent], {type: 'text/plain;charset=utf-8'})
    // saveAs(blob, fileName)
}

import React from 'react'
import * as Diff2Html from 'diff2html'
import * as difflib from 'difflib'

import 'diff2html/bundles/css/diff2html.min.css'

const StringDiffing = ({ current, base }: StringDiffingProps) => {
  const diff = compare(base, current)

  const html = Diff2Html.html(diff, {
    drawFileList: false,
    rawTemplates: {
      'line-by-line-file-diff': `<div id="{{fileHtmlId}}" class="d2h-file-wrapper" data-lang="{{file.language}}">
          <div class="d2h-file-diff">
            <div class="d2h-code-wrapper">
              <table class="d2h-diff-table">
                  <tbody class="d2h-diff-tbody">
                  {{{diffs}}}
                  </tbody>
              </table>
            </div>
          </div>
        </div>`,
      'generic-block-header': '',
    },
  })

  return <div dangerouslySetInnerHTML={{ __html: html }} />
}

export default StringDiffing

export interface StringDiffingProps {
  current: string
  base: string
}

// generate unified diff for two strings line by line
function compare(base: string, current: string) {
  const baseArr = current.split(/\r|\n|\r\n/)
  const currentArr = base.split(/\r|\n|\r\n/)
  const insertedIds: Array<Array<number>> = []

  const diffArr: Array<string> = (difflib as any).unifiedDiff(currentArr, baseArr, {
    fromfile: 'a',
    tofile: 'b',
    lineterm: '',
  })
  const diffIds = diffArr.filter(item => item.includes('@@'))

  diffIds.forEach((ids, index) => {
    const insertIndex = diffArr.findIndex(item => ids === item)
    const _ids = ids.match(/\d+/g)
    const start = Number(_ids && _ids[0]) - 1
    const length = Number(_ids && _ids[1])

    const prevIds = index !== 0 && diffIds.length > 1 ? diffIds[index - 1] : null
    const prevIdsArr = prevIds ? prevIds.match(/\d+/g) : null
    const prevEnd = prevIdsArr ? Number(prevIdsArr[0]) - 1 + Number(prevIdsArr[1]) : 0

    insertedIds.push([prevEnd, start, insertIndex])

    if (length && index === diffIds.length - 1) {
      insertedIds.push([start + length, baseArr.length, diffArr.length])
    }
  })

  insertedIds.reverse().forEach(ids => {
    const [from, to, index] = ids
    const arr = baseArr.slice(from, to)

    diffArr.splice(index, 0, ...arr)
  })

  const firstIndex = diffArr.findIndex(item => item === '+++ b')
  diffArr.splice(firstIndex + 1, 0, '@@ -0,0 +0,0 @@')

  return diffArr.join('\n')
}

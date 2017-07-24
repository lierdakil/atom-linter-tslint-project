'use babel';

import { execFile } from 'child_process'
import { sep, dirname } from 'path'
import { access } from 'fs'

let tslintpath = `${dirname(dirname(require.resolve('tslint')))}${sep}bin${sep}tslint`

export function activate() {
  // Fill something here, optional
}

export function deactivate() {
  // Fill something here, optional
}

export function provideLinter() {
  return {
    name: 'tslint',
    scope: 'project', // or 'project'
    lintsOnChange: false, // or true
    grammarScopes: ['source.ts', 'source.tsx'],
    async lint(textEditor) {
      const editorPath = textEditor.getPath()

      let projectpath = dirname(editorPath)
      async function isProjectPath(path) {
        let p = `${path}${sep}tsconfig.json`
        return new Promise((resolve) =>{
          access(p,(err) => {
            resolve(!err)
          })
        })
      }
      while (true) {
        let ex = await isProjectPath(projectpath)
        if (ex) break;
        projectpath = dirname(projectpath)
      }

      // Do something async
      return new Promise((resolve, reject) => {
        execFile('node', [tslintpath, '--project', `${projectpath}${sep}tsconfig.json`, '--type-check','--format','json'],
        { cwd: projectpath, maxBuffer: Infinity },
        (error, stdout, stderr) => {
          if(error && !stdout) {
            console.error(error)
            resolve([])
            return
          }
          let res = JSON.parse(stdout)
          resolve(res.map((item) => ({
            severity: 'warning',
            location: {
              file: item.name,
              position: [[item.startPosition.line, item.startPosition.character],
                         [item.endPosition.line, item.endPosition.character]],
            },
            excerpt: item.ruleName,
            description: item.failure
          })))
        })
      })
    }
  }
}

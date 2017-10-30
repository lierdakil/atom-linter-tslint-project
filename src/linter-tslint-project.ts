import { execFile } from 'child_process'
import { sep, dirname } from 'path'
import { access } from 'fs'
import * as TSLint from 'tslint'

export function activate() {
  // Fill something here, optional
}

export function deactivate() {
  // Fill something here, optional
}

export function provideLinter(): Linter.StandardLinterV2 {
  return {
    name: 'tslint',
    scope: 'project', // or 'project'
    lintsOnChange: false, // or true
    grammarScopes: ['source.ts', 'source.tsx'],
    async lint(textEditor) {
      const editorPath = textEditor.getPath()

      let projectpath = dirname(editorPath)
      let nodepath = dirname(editorPath)
      async function isProjectPath(path: string) {
        const p = `${path}${sep}tsconfig.json`
        return new Promise((resolve) => {
          access(p, (err) => {
            resolve(!err)
          })
        })
      }
      while (true) {
        const ex = await isProjectPath(projectpath)
        if (ex) { break }
        projectpath = dirname(projectpath)
      }
      async function isNodePath(path: string) {
        const p = `${path}${sep}node_modules${sep}`
        return new Promise((resolve) => {
          access(p, (err) => {
            resolve(!err)
          })
        })
      }
      while (true) {
        const ex = await isNodePath(nodepath)
        if (ex) { break }
        nodepath = dirname(nodepath)
      }

      const tslintpath = `${nodepath}${sep}node_modules${sep}.bin${sep}tslint`
      // Do something async
      return new Promise<Linter.V2Message[]>((resolve, reject) => {
        execFile(
          'node', [
            tslintpath, '--project', `${projectpath}`, '--format', 'json',
          ],
          { cwd: projectpath, maxBuffer: Infinity },
          (error, stdout, stderr) => {
            if (error && !stdout) {
              // tslint:disable-next-line: no-console
              console.error(error)
              resolve([])
              return
            }
            const res: TSLint.IRuleFailureJson[] = JSON.parse(stdout)
            const msgs = res.map((item): Linter.V2Message => ({
              severity: 'warning',
              location: {
                file: item.name,
                position: [
                  [item.startPosition.line, item.startPosition.character],
                  [item.endPosition.line, item.endPosition.character],
                ],
              },
              excerpt: item.ruleName,
              description: item.failure,
            }))
            resolve(msgs)
          })
      })
    },
  }
}

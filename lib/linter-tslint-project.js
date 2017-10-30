"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const path_1 = require("path");
const fs_1 = require("fs");
function activate() {
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
function provideLinter() {
    return {
        name: 'tslint',
        scope: 'project',
        lintsOnChange: false,
        grammarScopes: ['source.ts', 'source.tsx'],
        lint(textEditor) {
            return __awaiter(this, void 0, void 0, function* () {
                const editorPath = textEditor.getPath();
                let projectpath = path_1.dirname(editorPath);
                let nodepath = path_1.dirname(editorPath);
                function isProjectPath(path) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const p = `${path}${path_1.sep}tsconfig.json`;
                        return new Promise((resolve) => {
                            fs_1.access(p, (err) => {
                                resolve(!err);
                            });
                        });
                    });
                }
                while (true) {
                    const ex = yield isProjectPath(projectpath);
                    if (ex) {
                        break;
                    }
                    projectpath = path_1.dirname(projectpath);
                }
                function isNodePath(path) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const p = `${path}${path_1.sep}node_modules${path_1.sep}`;
                        return new Promise((resolve) => {
                            fs_1.access(p, (err) => {
                                resolve(!err);
                            });
                        });
                    });
                }
                while (true) {
                    const ex = yield isNodePath(nodepath);
                    if (ex) {
                        break;
                    }
                    nodepath = path_1.dirname(nodepath);
                }
                const tslintpath = `${nodepath}${path_1.sep}node_modules${path_1.sep}.bin${path_1.sep}tslint`;
                return new Promise((resolve, reject) => {
                    child_process_1.execFile('node', [
                        tslintpath, '--project', `${projectpath}`, '--format', 'json',
                    ], { cwd: projectpath, maxBuffer: Infinity }, (error, stdout, stderr) => {
                        if (error && !stdout) {
                            console.error(error);
                            resolve([]);
                            return;
                        }
                        const res = JSON.parse(stdout);
                        const msgs = res.map((item) => ({
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
                        }));
                        resolve(msgs);
                    });
                });
            });
        },
    };
}
exports.provideLinter = provideLinter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGludGVyLXRzbGludC1wcm9qZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2xpbnRlci10c2xpbnQtcHJvamVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsaURBQXdDO0FBQ3hDLCtCQUFtQztBQUNuQywyQkFBMkI7QUFHM0I7QUFFQSxDQUFDO0FBRkQsNEJBRUM7QUFFRDtBQUVBLENBQUM7QUFGRCxnQ0FFQztBQUVEO0lBQ0UsTUFBTSxDQUFDO1FBQ0wsSUFBSSxFQUFFLFFBQVE7UUFDZCxLQUFLLEVBQUUsU0FBUztRQUNoQixhQUFhLEVBQUUsS0FBSztRQUNwQixhQUFhLEVBQUUsQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxVQUFVOztnQkFDbkIsTUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFBO2dCQUV2QyxJQUFJLFdBQVcsR0FBRyxjQUFPLENBQUMsVUFBVSxDQUFDLENBQUE7Z0JBQ3JDLElBQUksUUFBUSxHQUFHLGNBQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQTtnQkFDbEMsdUJBQTZCLElBQVk7O3dCQUN2QyxNQUFNLENBQUMsR0FBRyxHQUFHLElBQUksR0FBRyxVQUFHLGVBQWUsQ0FBQTt3QkFDdEMsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTzs0QkFDekIsV0FBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUc7Z0NBQ1osT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUE7NEJBQ2YsQ0FBQyxDQUFDLENBQUE7d0JBQ0osQ0FBQyxDQUFDLENBQUE7b0JBQ0osQ0FBQztpQkFBQTtnQkFDRCxPQUFPLElBQUksRUFBRSxDQUFDO29CQUNaLE1BQU0sRUFBRSxHQUFHLE1BQU0sYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFBO29CQUMzQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUFDLEtBQUssQ0FBQTtvQkFBQyxDQUFDO29CQUNqQixXQUFXLEdBQUcsY0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFBO2dCQUNwQyxDQUFDO2dCQUNELG9CQUEwQixJQUFZOzt3QkFDcEMsTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJLEdBQUcsVUFBRyxlQUFlLFVBQUcsRUFBRSxDQUFBO3dCQUMzQyxNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPOzRCQUN6QixXQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRztnQ0FDWixPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQTs0QkFDZixDQUFDLENBQUMsQ0FBQTt3QkFDSixDQUFDLENBQUMsQ0FBQTtvQkFDSixDQUFDO2lCQUFBO2dCQUNELE9BQU8sSUFBSSxFQUFFLENBQUM7b0JBQ1osTUFBTSxFQUFFLEdBQUcsTUFBTSxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUE7b0JBQ3JDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQUMsS0FBSyxDQUFBO29CQUFDLENBQUM7b0JBQ2pCLFFBQVEsR0FBRyxjQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7Z0JBQzlCLENBQUM7Z0JBRUQsTUFBTSxVQUFVLEdBQUcsR0FBRyxRQUFRLEdBQUcsVUFBRyxlQUFlLFVBQUcsT0FBTyxVQUFHLFFBQVEsQ0FBQTtnQkFFeEUsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFxQixDQUFDLE9BQU8sRUFBRSxNQUFNO29CQUNyRCx3QkFBUSxDQUNOLE1BQU0sRUFBRTt3QkFDTixVQUFVLEVBQUUsV0FBVyxFQUFFLEdBQUcsV0FBVyxFQUFFLEVBQUUsVUFBVSxFQUFFLE1BQU07cUJBQzlELEVBQ0QsRUFBRSxHQUFHLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsRUFDekMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU07d0JBQ3BCLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7NEJBRXJCLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7NEJBQ3BCLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTs0QkFDWCxNQUFNLENBQUE7d0JBQ1IsQ0FBQzt3QkFDRCxNQUFNLEdBQUcsR0FBOEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQTt3QkFDekQsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBdUIsQ0FBQzs0QkFDaEQsUUFBUSxFQUFFLFNBQVM7NEJBQ25CLFFBQVEsRUFBRTtnQ0FDUixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0NBQ2YsUUFBUSxFQUFFO29DQUNSLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUM7b0NBQ3ZELENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUM7aUNBQ3BEOzZCQUNGOzRCQUNELE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUTs0QkFDdEIsV0FBVyxFQUFFLElBQUksQ0FBQyxPQUFPO3lCQUMxQixDQUFDLENBQUMsQ0FBQTt3QkFDSCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7b0JBQ2YsQ0FBQyxDQUFDLENBQUE7Z0JBQ04sQ0FBQyxDQUFDLENBQUE7WUFDSixDQUFDO1NBQUE7S0FDRixDQUFBO0FBQ0gsQ0FBQztBQXZFRCxzQ0F1RUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBleGVjRmlsZSB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnXG5pbXBvcnQgeyBzZXAsIGRpcm5hbWUgfSBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgYWNjZXNzIH0gZnJvbSAnZnMnXG5pbXBvcnQgKiBhcyBUU0xpbnQgZnJvbSAndHNsaW50J1xuXG5leHBvcnQgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gIC8vIEZpbGwgc29tZXRoaW5nIGhlcmUsIG9wdGlvbmFsXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWFjdGl2YXRlKCkge1xuICAvLyBGaWxsIHNvbWV0aGluZyBoZXJlLCBvcHRpb25hbFxufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvdmlkZUxpbnRlcigpOiBMaW50ZXIuU3RhbmRhcmRMaW50ZXJWMiB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3RzbGludCcsXG4gICAgc2NvcGU6ICdwcm9qZWN0JywgLy8gb3IgJ3Byb2plY3QnXG4gICAgbGludHNPbkNoYW5nZTogZmFsc2UsIC8vIG9yIHRydWVcbiAgICBncmFtbWFyU2NvcGVzOiBbJ3NvdXJjZS50cycsICdzb3VyY2UudHN4J10sXG4gICAgYXN5bmMgbGludCh0ZXh0RWRpdG9yKSB7XG4gICAgICBjb25zdCBlZGl0b3JQYXRoID0gdGV4dEVkaXRvci5nZXRQYXRoKClcblxuICAgICAgbGV0IHByb2plY3RwYXRoID0gZGlybmFtZShlZGl0b3JQYXRoKVxuICAgICAgbGV0IG5vZGVwYXRoID0gZGlybmFtZShlZGl0b3JQYXRoKVxuICAgICAgYXN5bmMgZnVuY3Rpb24gaXNQcm9qZWN0UGF0aChwYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgcCA9IGAke3BhdGh9JHtzZXB9dHNjb25maWcuanNvbmBcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgYWNjZXNzKHAsIChlcnIpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUoIWVycilcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgY29uc3QgZXggPSBhd2FpdCBpc1Byb2plY3RQYXRoKHByb2plY3RwYXRoKVxuICAgICAgICBpZiAoZXgpIHsgYnJlYWsgfVxuICAgICAgICBwcm9qZWN0cGF0aCA9IGRpcm5hbWUocHJvamVjdHBhdGgpXG4gICAgICB9XG4gICAgICBhc3luYyBmdW5jdGlvbiBpc05vZGVQYXRoKHBhdGg6IHN0cmluZykge1xuICAgICAgICBjb25zdCBwID0gYCR7cGF0aH0ke3NlcH1ub2RlX21vZHVsZXMke3NlcH1gXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgIGFjY2VzcyhwLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKCFlcnIpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIGNvbnN0IGV4ID0gYXdhaXQgaXNOb2RlUGF0aChub2RlcGF0aClcbiAgICAgICAgaWYgKGV4KSB7IGJyZWFrIH1cbiAgICAgICAgbm9kZXBhdGggPSBkaXJuYW1lKG5vZGVwYXRoKVxuICAgICAgfVxuXG4gICAgICBjb25zdCB0c2xpbnRwYXRoID0gYCR7bm9kZXBhdGh9JHtzZXB9bm9kZV9tb2R1bGVzJHtzZXB9LmJpbiR7c2VwfXRzbGludGBcbiAgICAgIC8vIERvIHNvbWV0aGluZyBhc3luY1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPExpbnRlci5WMk1lc3NhZ2VbXT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBleGVjRmlsZShcbiAgICAgICAgICAnbm9kZScsIFtcbiAgICAgICAgICAgIHRzbGludHBhdGgsICctLXByb2plY3QnLCBgJHtwcm9qZWN0cGF0aH1gLCAnLS1mb3JtYXQnLCAnanNvbicsXG4gICAgICAgICAgXSxcbiAgICAgICAgICB7IGN3ZDogcHJvamVjdHBhdGgsIG1heEJ1ZmZlcjogSW5maW5pdHkgfSxcbiAgICAgICAgICAoZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyb3IgJiYgIXN0ZG91dCkge1xuICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLWNvbnNvbGVcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcilcbiAgICAgICAgICAgICAgcmVzb2x2ZShbXSlcbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCByZXM6IFRTTGludC5JUnVsZUZhaWx1cmVKc29uW10gPSBKU09OLnBhcnNlKHN0ZG91dClcbiAgICAgICAgICAgIGNvbnN0IG1zZ3MgPSByZXMubWFwKChpdGVtKTogTGludGVyLlYyTWVzc2FnZSA9PiAoe1xuICAgICAgICAgICAgICBzZXZlcml0eTogJ3dhcm5pbmcnLFxuICAgICAgICAgICAgICBsb2NhdGlvbjoge1xuICAgICAgICAgICAgICAgIGZpbGU6IGl0ZW0ubmFtZSxcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogW1xuICAgICAgICAgICAgICAgICAgW2l0ZW0uc3RhcnRQb3NpdGlvbi5saW5lLCBpdGVtLnN0YXJ0UG9zaXRpb24uY2hhcmFjdGVyXSxcbiAgICAgICAgICAgICAgICAgIFtpdGVtLmVuZFBvc2l0aW9uLmxpbmUsIGl0ZW0uZW5kUG9zaXRpb24uY2hhcmFjdGVyXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBleGNlcnB0OiBpdGVtLnJ1bGVOYW1lLFxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogaXRlbS5mYWlsdXJlLFxuICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICByZXNvbHZlKG1zZ3MpXG4gICAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSxcbiAgfVxufVxuIl19
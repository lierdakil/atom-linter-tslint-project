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
                        tslintpath, '--project', `${projectpath}${path_1.sep}tsconfig.json`,
                        '--type-check', '--format', 'json',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGludGVyLXRzbGludC1wcm9qZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2xpbnRlci10c2xpbnQtcHJvamVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsaURBQXdDO0FBQ3hDLCtCQUFtQztBQUNuQywyQkFBMkI7QUFHM0I7QUFFQSxDQUFDO0FBRkQsNEJBRUM7QUFFRDtBQUVBLENBQUM7QUFGRCxnQ0FFQztBQUVEO0lBQ0UsTUFBTSxDQUFDO1FBQ0wsSUFBSSxFQUFFLFFBQVE7UUFDZCxLQUFLLEVBQUUsU0FBUztRQUNoQixhQUFhLEVBQUUsS0FBSztRQUNwQixhQUFhLEVBQUUsQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxVQUFVOztnQkFDbkIsTUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFBO2dCQUV2QyxJQUFJLFdBQVcsR0FBRyxjQUFPLENBQUMsVUFBVSxDQUFDLENBQUE7Z0JBQ3JDLElBQUksUUFBUSxHQUFHLGNBQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQTtnQkFDbEMsdUJBQTZCLElBQVk7O3dCQUN2QyxNQUFNLENBQUMsR0FBRyxHQUFHLElBQUksR0FBRyxVQUFHLGVBQWUsQ0FBQTt3QkFDdEMsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTzs0QkFDekIsV0FBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUc7Z0NBQ1osT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUE7NEJBQ2YsQ0FBQyxDQUFDLENBQUE7d0JBQ0osQ0FBQyxDQUFDLENBQUE7b0JBQ0osQ0FBQztpQkFBQTtnQkFDRCxPQUFPLElBQUksRUFBRSxDQUFDO29CQUNaLE1BQU0sRUFBRSxHQUFHLE1BQU0sYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFBO29CQUMzQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUFDLEtBQUssQ0FBQTtvQkFBQyxDQUFDO29CQUNqQixXQUFXLEdBQUcsY0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFBO2dCQUNwQyxDQUFDO2dCQUNELG9CQUEwQixJQUFZOzt3QkFDcEMsTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJLEdBQUcsVUFBRyxlQUFlLFVBQUcsRUFBRSxDQUFBO3dCQUMzQyxNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPOzRCQUN6QixXQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRztnQ0FDWixPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQTs0QkFDZixDQUFDLENBQUMsQ0FBQTt3QkFDSixDQUFDLENBQUMsQ0FBQTtvQkFDSixDQUFDO2lCQUFBO2dCQUNELE9BQU8sSUFBSSxFQUFFLENBQUM7b0JBQ1osTUFBTSxFQUFFLEdBQUcsTUFBTSxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUE7b0JBQ3JDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQUMsS0FBSyxDQUFBO29CQUFDLENBQUM7b0JBQ2pCLFFBQVEsR0FBRyxjQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7Z0JBQzlCLENBQUM7Z0JBRUQsTUFBTSxVQUFVLEdBQUcsR0FBRyxRQUFRLEdBQUcsVUFBRyxlQUFlLFVBQUcsT0FBTyxVQUFHLFFBQVEsQ0FBQTtnQkFFeEUsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFxQixDQUFDLE9BQU8sRUFBRSxNQUFNO29CQUNyRCx3QkFBUSxDQUNOLE1BQU0sRUFBRTt3QkFDTixVQUFVLEVBQUUsV0FBVyxFQUFFLEdBQUcsV0FBVyxHQUFHLFVBQUcsZUFBZTt3QkFDNUQsY0FBYyxFQUFFLFVBQVUsRUFBRSxNQUFNO3FCQUNuQyxFQUNELEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLEVBQ3pDLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNO3dCQUNwQixFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDOzRCQUVyQixPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFBOzRCQUNwQixPQUFPLENBQUMsRUFBRSxDQUFDLENBQUE7NEJBQ1gsTUFBTSxDQUFBO3dCQUNSLENBQUM7d0JBQ0QsTUFBTSxHQUFHLEdBQThCLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7d0JBQ3pELE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEtBQXVCLENBQUM7NEJBQ2hELFFBQVEsRUFBRSxTQUFTOzRCQUNuQixRQUFRLEVBQUU7Z0NBQ1IsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO2dDQUNmLFFBQVEsRUFBRTtvQ0FDUixDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDO29DQUN2RCxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDO2lDQUNwRDs2QkFDRjs0QkFDRCxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVE7NEJBQ3RCLFdBQVcsRUFBRSxJQUFJLENBQUMsT0FBTzt5QkFDMUIsQ0FBQyxDQUFDLENBQUE7d0JBQ0gsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO29CQUNmLENBQUMsQ0FBQyxDQUFBO2dCQUNOLENBQUMsQ0FBQyxDQUFBO1lBQ0osQ0FBQztTQUFBO0tBQ0YsQ0FBQTtBQUNILENBQUM7QUF4RUQsc0NBd0VDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXhlY0ZpbGUgfSBmcm9tICdjaGlsZF9wcm9jZXNzJ1xuaW1wb3J0IHsgc2VwLCBkaXJuYW1lIH0gZnJvbSAncGF0aCdcbmltcG9ydCB7IGFjY2VzcyB9IGZyb20gJ2ZzJ1xuaW1wb3J0ICogYXMgVFNMaW50IGZyb20gJ3RzbGludCdcblxuZXhwb3J0IGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAvLyBGaWxsIHNvbWV0aGluZyBoZXJlLCBvcHRpb25hbFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVhY3RpdmF0ZSgpIHtcbiAgLy8gRmlsbCBzb21ldGhpbmcgaGVyZSwgb3B0aW9uYWxcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb3ZpZGVMaW50ZXIoKTogTGludGVyLlN0YW5kYXJkTGludGVyVjIge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICd0c2xpbnQnLFxuICAgIHNjb3BlOiAncHJvamVjdCcsIC8vIG9yICdwcm9qZWN0J1xuICAgIGxpbnRzT25DaGFuZ2U6IGZhbHNlLCAvLyBvciB0cnVlXG4gICAgZ3JhbW1hclNjb3BlczogWydzb3VyY2UudHMnLCAnc291cmNlLnRzeCddLFxuICAgIGFzeW5jIGxpbnQodGV4dEVkaXRvcikge1xuICAgICAgY29uc3QgZWRpdG9yUGF0aCA9IHRleHRFZGl0b3IuZ2V0UGF0aCgpXG5cbiAgICAgIGxldCBwcm9qZWN0cGF0aCA9IGRpcm5hbWUoZWRpdG9yUGF0aClcbiAgICAgIGxldCBub2RlcGF0aCA9IGRpcm5hbWUoZWRpdG9yUGF0aClcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIGlzUHJvamVjdFBhdGgocGF0aDogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IHAgPSBgJHtwYXRofSR7c2VwfXRzY29uZmlnLmpzb25gXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgIGFjY2VzcyhwLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKCFlcnIpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIGNvbnN0IGV4ID0gYXdhaXQgaXNQcm9qZWN0UGF0aChwcm9qZWN0cGF0aClcbiAgICAgICAgaWYgKGV4KSB7IGJyZWFrIH1cbiAgICAgICAgcHJvamVjdHBhdGggPSBkaXJuYW1lKHByb2plY3RwYXRoKVxuICAgICAgfVxuICAgICAgYXN5bmMgZnVuY3Rpb24gaXNOb2RlUGF0aChwYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgcCA9IGAke3BhdGh9JHtzZXB9bm9kZV9tb2R1bGVzJHtzZXB9YFxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICBhY2Nlc3MocCwgKGVycikgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZSghZXJyKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICBjb25zdCBleCA9IGF3YWl0IGlzTm9kZVBhdGgobm9kZXBhdGgpXG4gICAgICAgIGlmIChleCkgeyBicmVhayB9XG4gICAgICAgIG5vZGVwYXRoID0gZGlybmFtZShub2RlcGF0aClcbiAgICAgIH1cblxuICAgICAgY29uc3QgdHNsaW50cGF0aCA9IGAke25vZGVwYXRofSR7c2VwfW5vZGVfbW9kdWxlcyR7c2VwfS5iaW4ke3NlcH10c2xpbnRgXG4gICAgICAvLyBEbyBzb21ldGhpbmcgYXN5bmNcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxMaW50ZXIuVjJNZXNzYWdlW10+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgZXhlY0ZpbGUoXG4gICAgICAgICAgJ25vZGUnLCBbXG4gICAgICAgICAgICB0c2xpbnRwYXRoLCAnLS1wcm9qZWN0JywgYCR7cHJvamVjdHBhdGh9JHtzZXB9dHNjb25maWcuanNvbmAsXG4gICAgICAgICAgICAnLS10eXBlLWNoZWNrJywgJy0tZm9ybWF0JywgJ2pzb24nLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgeyBjd2Q6IHByb2plY3RwYXRoLCBtYXhCdWZmZXI6IEluZmluaXR5IH0sXG4gICAgICAgICAgKGVycm9yLCBzdGRvdXQsIHN0ZGVycikgPT4ge1xuICAgICAgICAgICAgaWYgKGVycm9yICYmICFzdGRvdXQpIHtcbiAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby1jb25zb2xlXG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXG4gICAgICAgICAgICAgIHJlc29sdmUoW10pXG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcmVzOiBUU0xpbnQuSVJ1bGVGYWlsdXJlSnNvbltdID0gSlNPTi5wYXJzZShzdGRvdXQpXG4gICAgICAgICAgICBjb25zdCBtc2dzID0gcmVzLm1hcCgoaXRlbSk6IExpbnRlci5WMk1lc3NhZ2UgPT4gKHtcbiAgICAgICAgICAgICAgc2V2ZXJpdHk6ICd3YXJuaW5nJyxcbiAgICAgICAgICAgICAgbG9jYXRpb246IHtcbiAgICAgICAgICAgICAgICBmaWxlOiBpdGVtLm5hbWUsXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IFtcbiAgICAgICAgICAgICAgICAgIFtpdGVtLnN0YXJ0UG9zaXRpb24ubGluZSwgaXRlbS5zdGFydFBvc2l0aW9uLmNoYXJhY3Rlcl0sXG4gICAgICAgICAgICAgICAgICBbaXRlbS5lbmRQb3NpdGlvbi5saW5lLCBpdGVtLmVuZFBvc2l0aW9uLmNoYXJhY3Rlcl0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgZXhjZXJwdDogaXRlbS5ydWxlTmFtZSxcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGl0ZW0uZmFpbHVyZSxcbiAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgcmVzb2x2ZShtc2dzKVxuICAgICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0sXG4gIH1cbn1cbiJdfQ==
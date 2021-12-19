import * as vscode from 'vscode';
import { activeInfo, bad } from './utils';
import { ActiveEditorCurrentInfo } from './types';


export function handleCurrentLine(activeEditor: vscode.TextEditor) {
  if (!globalThis.IS_RECORDING) {
    return;
  }
  const info: ActiveEditorCurrentInfo = activeInfo(activeEditor);
  let currInfo: ActiveEditorCurrentInfo = globalThis.currentInfo!;
  let stats = globalThis.stats;

  stats.init(info, activeEditor);

  if (globalThis.atStart) {
    globalThis.currentInfo = info;
    globalThis.atStart = false;
    return;
  }

  if (currInfo !== info) {
    if (currInfo.fileLineNumber !== info.fileLineNumber) {
      stats.endLine(currInfo);
      let line = stats.getLine(info);
      line!.timesVisited += 1;
      line!.start();
    }
    stats.endChar(currInfo)!;
    let char = stats.getChar(info);
    char!.timesVisited += 1;
    char!.start();
  }
  globalThis.currentInfo = info;
}

vscode.window.onDidChangeTextEditorSelection((e) => {
  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor) {
    if (!globalThis.IS_RECORDING) {
      return;
    }
    if (globalThis.currentInfo  === null) {
      bad();
    }
    handleCurrentLine(activeEditor);
  }
});
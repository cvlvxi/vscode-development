import * as vscode from 'vscode';
import { performance } from 'perf_hooks';
import { activeInfo, bad } from './utils';
import { ActiveEditorCurrentInfo } from './types';


export function handleCurrentLine(activeEditor: vscode.TextEditor) {
  if (!globalThis.IS_RECORDING) {
    return;
  }
  const info: ActiveEditorCurrentInfo = activeInfo(activeEditor);
  let currInfo: ActiveEditorCurrentInfo = globalThis.currentInfo!;
  let stats = globalThis.stats;

  stats.initFile(info);

  if (globalThis.atStart) {
    globalThis.currentInfo = info
    globalThis.atStart = false;
    return;
  }

  if (globalThis.currentInfo !== info) {
    stats.getLine(currInfo)?.end();
  }
  let line = stats.getLine(info);
  line!.timesVisited += 1;
  line!.start();
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
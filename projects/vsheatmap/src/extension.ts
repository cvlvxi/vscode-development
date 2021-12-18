import * as vscode from 'vscode';
import { handleCurrentLine } from "./capture";
import { init } from "./utils";

export function activate(context: vscode.ExtensionContext) {

  init();
  globalThis.out = vscode.window.createOutputChannel("vsheatmap");

  let startRecording = vscode.commands.registerCommand('vsheatmap.startRecording', () => {
    vscode.window.showInformationMessage("Start Recording!");
    globalThis.IS_RECORDING = true;
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
      handleCurrentLine(activeEditor);
    }
  });

  let stopRecording = vscode.commands.registerCommand('vsheatmap.stopRecording', () => {
    vscode.window.showInformationMessage("Stopped Recording!");
    globalThis.IS_RECORDING = false;
    init();
  });

  context.subscriptions.push(startRecording);
  context.subscriptions.push(stopRecording);
}

export function deactivate() { }

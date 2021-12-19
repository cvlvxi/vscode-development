import * as vscode from 'vscode';
import { handleCurrentLine } from "./capture";
import { HeatmapViewPanel } from './heatmap';
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
    globalThis.stats.getLine(globalThis.currentInfo!);
    globalThis.stats.obs!.disconnect()
    vscode.window.showInformationMessage("Stopped Recording!");
    globalThis.IS_RECORDING = false;
    // Otherwise, create a new panel.
    const panel = vscode.window.createWebviewPanel(
        HeatmapViewPanel.viewType,
        'HeatmapView',
        vscode.ViewColumn.One,
        HeatmapViewPanel.getWebviewOptions(context.extensionUri)
    );
    const h = new HeatmapViewPanel(globalThis.stats, globalThis.out, panel, context.extensionUri)
    init();
  });

  context.subscriptions.push(startRecording);
  context.subscriptions.push(stopRecording);
}

export function deactivate() { }

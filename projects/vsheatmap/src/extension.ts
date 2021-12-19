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

    HeatmapViewPanel.createOrShow(context.extensionUri)
    if (vscode.window.registerWebviewPanelSerializer) {
      // Make sure we register a serializer in activation event
      vscode.window.registerWebviewPanelSerializer(HeatmapViewPanel.viewType, {
        async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
          console.log(`Got state: ${state}`);
          // Reset the webview options so we use latest uri for `localResourceRoots`.
          webviewPanel.webview.options = HeatmapViewPanel.getWebviewOptions(context.extensionUri);
          HeatmapViewPanel.revive(webviewPanel, context.extensionUri);
        }
      });
    }
    init();
  });

  context.subscriptions.push(startRecording);
  context.subscriptions.push(stopRecording);
}

export function deactivate() { }

import * as vscode from 'vscode';
import { FileMap, Stats } from './types';
import { handleCurrentLine } from "./capture"
import { init } from "./utils"

export function activate(context: vscode.ExtensionContext) {

	init();
	globalThis.out = vscode.window.createOutputChannel("vsheatmap");

	let startRecording = vscode.commands.registerCommand('vsheatmap.startRecording', () => {
		vscode.window.showInformationMessage("Start Recording!");
		globalThis.IS_RECORDING = true;
		const activeEditor = vscode.window.activeTextEditor;
		if (activeEditor) {
			handleCurrentLine(activeEditor)
			globalThis.isStart = false
		}
	});

	let stopRecording = vscode.commands.registerCommand('vsheatmap.stopRecording', () => {
		vscode.window.showInformationMessage("Stopped Recording!");
		globalThis.IS_RECORDING = false;
		globalThis.filemap.forEach((fileMap: FileMap, fileName: string) => {
			globalThis.out.appendLine(`FILE: ${fileName}`)
			fileMap.stats.forEach((lineStats: Stats, lineNumber: number) => {
				globalThis.out.appendLine(`\tLINE_NUMBER: ${lineNumber}`)
				globalThis.out.appendLine(`\t\tdurationMs: ${lineStats.durationMs}`)
				globalThis.out.appendLine(`\t\ttimesVisited: ${lineStats.timesVisited}`)
			})
		});
		init();
	})

	context.subscriptions.push(startRecording);
	context.subscriptions.push(stopRecording);
}

export function deactivate() { }

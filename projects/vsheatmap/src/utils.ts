import * as vscode from "vscode"
import { TextEditor } from "vscode"
import { FileName, FileMap, ActiveEditorCurrentInfo} from './types';

export function bad() {
	vscode.window.showInformationMessage("Invalid State! Stopping Recording.")
	globalThis.IS_RECORDING = false;
	init();
	throw new Error("Bad");
}

export function init() {
	globalThis.IS_RECORDING = false;
	globalThis.filemap = new Map<FileName, FileMap>();
	globalThis.lineinfo = null;
	globalThis.isStart = true;
}

export function activeInfo(activeEditor: TextEditor): ActiveEditorCurrentInfo {
	return {
		fileName: activeEditor.document.fileName,
		fileLineNumber: activeEditor.selection.active.line,
		fileLineCount: activeEditor.document.lineCount,
	}
}

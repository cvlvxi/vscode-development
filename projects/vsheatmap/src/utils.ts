import * as vscode from "vscode";
import { TextEditor } from "vscode";
import { ActiveEditorCurrentInfo} from './types';
import { Stats } from "./types";

export function bad() {
  vscode.window.showInformationMessage("Invalid State! Stopping Recording.");
  globalThis.IS_RECORDING = false;
  init();
  throw new Error("Bad");
}

export function init() {
  globalThis.IS_RECORDING = false;
  globalThis.currentInfo = null;
  globalThis.stats = new Stats();
  globalThis.atStart = true;
}

export function activeInfo(activeEditor: TextEditor): ActiveEditorCurrentInfo {
  return new ActiveEditorCurrentInfo (
    activeEditor.document.fileName,
    activeEditor.selection.active.line + 1, // 0 based
    activeEditor.document.lineCount,
    activeEditor.selection.start.character + 1 // 0 based
  );
}

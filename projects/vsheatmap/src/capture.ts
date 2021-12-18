import * as vscode from 'vscode';
import { performance } from 'perf_hooks';
import { activeInfo, bad } from './utils';
import { ActiveEditorCurrentInfo } from './types';


function tryInitLine(info: ActiveEditorCurrentInfo): boolean {
	let setLineInfo = false
	let initStats = {
		startMs: performance.now(),
		initialized: false,
		durationMs: performance.now(),
		timesVisited: 1
	}
	if (!globalThis.filemap.has(info.fileName)) {
		globalThis.filemap.set(info.fileName, {
			fileLineCount: info.fileLineCount,
			fileName: info.fileName,
			stats: new Map([[info.fileLineNumber, initStats]])
		})
		setLineInfo = true;
	} else {
		let stats = globalThis.filemap.get(info.fileName)!.stats
		if (!stats.has(info.fileLineNumber)) {
			stats.set(info.fileLineNumber, initStats)
			setLineInfo = true;
		}
	}
	if (setLineInfo) {
		globalThis.lineinfo = {
			...info,
			stats: initStats
		}
	}
	return setLineInfo
}

export function handleCurrentLine(activeEditor: vscode.TextEditor) {
	if (!globalThis.IS_RECORDING) {
		return
	}
	const info = activeInfo(activeEditor)
	const didInit = tryInitLine(info)
	if (didInit) {
		handlePrevious()
		return
	}
	let currFilemap = globalThis.filemap.get(info.fileName)!
	if (currFilemap.fileLineCount !== info.fileLineCount) {
		currFilemap.fileLineCount = info.fileLineCount
	}
	update(info)
}



function update(currLineInfo: ActiveEditorCurrentInfo) {
	let {
		fileName,
		fileLineNumber
	} = currLineInfo
	let currFilemap = globalThis.filemap.get(fileName)!
	let stats = currFilemap.stats.get(fileLineNumber)
	if (stats) {
		stats.timesVisited += 1
		stats.durationMs = performance.now() - stats!.durationMs
	} else {
		// For some reason we need to insert the line?
		bad()
	}
}

function handlePrevious() {
	if (!globalThis.lineinfo || globalThis.isStart) {
		return;
	}
	// Things that need updating when currline and prevline is different
	let {
		fileName,
		fileLineNumber,
		stats
	} = globalThis.lineinfo!

	let mapLineStats = globalThis.filemap.get(fileName)!.stats.get(fileLineNumber)!
	if (!stats.initialized) {
		let initDelta = performance.now() - stats.startMs;
		mapLineStats.durationMs = initDelta
		mapLineStats.initialized = true;
	} else {
		mapLineStats.durationMs = performance.now() - stats.durationMs
	}
}

vscode.window.onDidChangeTextEditorSelection((e) => {
	const activeEditor = vscode.window.activeTextEditor;
	if (activeEditor) {
		if (!globalThis.IS_RECORDING) {
			return;
		}
		if (globalThis.lineinfo === null) {
			bad();
		}
		handleCurrentLine(activeEditor)
	}
})
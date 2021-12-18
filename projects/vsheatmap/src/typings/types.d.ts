import { OutputChannel } from "vscode";
export { }
declare global {
	var IS_RECORDING: boolean;
	var filemap: Map<FileName, FileMap>;
	var lineinfo: LineStats | null;
	var isStart: boolean;
	var out: OutputChannel
}

/////////////////////////////////////////////////////

declare type FileName = string
declare type FileLineNumber = number;

declare interface FileMap {
	fileName: FileName;
	fileLineCount: number;
	stats: LineStatsMap;
}
declare type LineStatsMap = Map<FileLineNumber, Stats>

declare interface LineStats {
	fileName: string;
	fileLineCount: number;
	fileLineNumber: FileLineNumber;
	stats: Stats
}

declare interface Stats {
	startMs: number;
	initialized: boolean;
	durationMs: number;
	timesVisited: number;
}

declare interface ActiveEditorCurrentInfo {
	fileName: string;
	fileLineNumber: number;
	fileLineCount: number;
}
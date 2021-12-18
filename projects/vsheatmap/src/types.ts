export type FileName = string
export type FileLineNumber = number;

export interface FileMap {
	fileName: FileName;
	fileLineCount: number;
	stats: LineStatsMap;
}
export type LineStatsMap = Map<FileLineNumber, Stats>

export interface LineStats {
	fileName: FileName;
	fileLineCount: number;
	fileLineNumber: FileLineNumber;
	stats: Stats
}


export interface Stats {
	startMs: number;
	initialized: boolean;
	durationMs: number;
	timesVisited: number;
}

export interface ActiveEditorCurrentInfo {
	fileName: string;
	fileLineNumber: number;
	fileLineCount: number;
}

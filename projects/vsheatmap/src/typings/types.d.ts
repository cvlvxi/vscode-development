import { OutputChannel } from "vscode";
import { ActiveEditorCurrentInfo, Stats } from "../types"
export { }
declare global {
	var IS_RECORDING: boolean;
	var currentInfo: ActiveEditorCurrentInfo | null;
	var stats: Stats;
	var out: OutputChannel;
	var atStart: boolean;
}

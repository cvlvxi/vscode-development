import { performance, PerformanceObserver, PerformanceObserverEntryList } from 'perf_hooks';
import { OutputChannel } from 'vscode';
import { bad } from "./utils";
import * as vscode from "vscode";

export class ActiveEditorCurrentInfo {

  fileName: string;
  fileLineNumber: number;
  fileLineCount: number;
  characterPos: number;

  constructor(
    fileName: string,
    fileLineNumber: number,
    fileLineCount: number,
    characterPos: number
  ) {
    this.fileName = fileName;
    this.fileLineNumber = fileLineNumber;
    this.fileLineCount = fileLineCount;
    this.characterPos = characterPos;
  }
}

class Perf {
  identifier: string;
  markStart: string;
  markEnd: string;
  totalDuration: number;
  timesVisited: number;
  constructor(identifier: string) {
    this.identifier = identifier;
    this.markStart = `${identifier}-start`;
    this.markEnd = `${identifier}-end`;
    this.totalDuration = 0;
    this.timesVisited = 1;
  }
  start() {
    performance.mark(this.markStart);
  }
  end() {
    performance.mark(this.markEnd);
    performance.measure(this.identifier, this.markStart, this.markEnd);
    performance.clearMarks(this.markStart);
    performance.clearMarks(this.markEnd);
  }
}

export class Line extends Perf {
  lineNumber: number;
  charstats: Map<number, Char>;
  constructor(fileName: string, lineNumber: number) {
    super(`${fileName}:${lineNumber}`);
    this.lineNumber = lineNumber;
    this.charstats = new Map();
    this.start();
  }
}

export class Char extends Perf {
  charNumber: number;
  constructor(fileName: string, lineNumber: number, charNumber: number) {
    super(`${fileName}:${lineNumber}:${charNumber}`);
    this.charNumber = charNumber;
    this.start();
  }
}

export class File {
  fileName: string;
  lineCount: number;
  linestats: Map<number, Line>;

  constructor(fileName: string, lineCount: number) {
    this.fileName = fileName;
    this.lineCount = lineCount;
    this.linestats = new Map();
  }
}

export class Stats {

  filestats: Map<string, File>;
  updating: Line | Char | undefined;
  obs: PerformanceObserver | undefined;

  constructor() {
    this.filestats = new Map();
    this.obs = this.registerObserver();
    this.updating = undefined;
  }

  log(out: OutputChannel) {
    this.filestats.forEach((f: File, filename: string) => {
      out.appendLine(`FILE: ${filename}`);
      f.linestats.forEach((l: Line, lineNumber: number) => {
        out.appendLine(`\tLINE_NUMBER: ${lineNumber}`);
        out.appendLine(`\t\tdurationMs: ${l.totalDuration}`);
        out.appendLine(`\t\ttimesVisited: ${l.timesVisited}`);
        l.charstats.forEach((c: Char, charNumber: number) => {
          out.appendLine(`\t\tCHAR_NUMBER: ${charNumber}`);
          out.appendLine(`\t\t\tdurationMs: ${c.totalDuration}`);
          out.appendLine(`\t\ttimesVisited: ${c.timesVisited}`);
        });
      });
    });
  }

  endChar(info: ActiveEditorCurrentInfo) {
    this.updating = this.getChar(info);
    this.updating?.end();
  }

  endLine(info: ActiveEditorCurrentInfo) {
    this.updating = this.getLine(info);
    this.updating?.end();
  }


  getLine(info: ActiveEditorCurrentInfo): Line | undefined {
    return this.filestats.get(info.fileName)?.linestats?.get(info.fileLineNumber);
  }

  getChar(info: ActiveEditorCurrentInfo): Char | undefined {
    return this.filestats.get(info.fileName)?.linestats?.get(info.fileLineNumber)?.charstats.get(info.characterPos);
  }

  init(info: ActiveEditorCurrentInfo) {
    let {
      fileName: fname,
      fileLineCount: flcount,
      fileLineNumber: flinenum,
      characterPos: charpos
    } = info;
    let file;
    let line;
    let char;
    if (!(file = this.filestats.get(fname))) {
      file = this.filestats.set(fname, new File(fname, flcount));
    }
    if (!(line = this.filestats.get(fname)!.linestats.get(flinenum))) {
      this.filestats.get(fname)!.linestats.set(flinenum, new Line(fname, flinenum));
    }
    if (!(char = this.filestats.get(fname)!.linestats.get(flinenum)?.charstats.get(charpos))) {
      this.filestats.get(fname)!.linestats.get(flinenum)!.charstats.set(charpos, new Char(fname, flinenum, charpos));
    }
  }

  registerObserver(): PerformanceObserver {
    vscode.window.showInformationMessage("Start Recording!");
    let obs = new PerformanceObserver((list) => {
      if (this.updating) {
        let measures = list.getEntriesByName(this.updating.identifier);
        if (measures.length > 1) {
          bad();
        }
        this.updating.totalDuration += measures[0].duration;
      }
    });
    obs.observe({ entryTypes: ['measure'] });
    return obs
  }
}
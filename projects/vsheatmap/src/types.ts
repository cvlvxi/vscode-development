import { performance, PerformanceObserver } from 'perf_hooks';
import { bad } from "./utils";

export class ActiveEditorCurrentInfo {
  fileName: string;
  fileLineNumber: number;
  fileLineCount: number;
  constructor(fileName: string, fileLineNumber: number, fileLineCount: number) {
    this.fileName = fileName;
    this.fileLineNumber = fileLineNumber;
    this.fileLineCount = fileLineCount;
  }
  getMeasureId(): string {
    return `${this.fileName}:${this.fileLineNumber}`;
  }
  getMarkStart(): string {
    return `${this.getMeasureId}-start`;
  }

  getMarkEnd(): string {
    return `${this.getMeasureId}-end`;
  }
}

class Perf {
  identifier: string;
  markStart: string;
  markEnd: string;
  totalDuration: number;
  constructor(identifier: string) {
    this.identifier = identifier;
    this.markStart = `${identifier}-start`;
    this.markEnd = `${identifier}-end`;
    this.totalDuration = 0;
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
  fileName: string;
  timesVisited: number;
  constructor(fileName: string, lineNumber: number) {
    super(`${fileName}:${lineNumber}`);
    this.lineNumber = lineNumber;
    this.fileName = fileName;
    this.timesVisited = 0;
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

  constructor() {
    this.filestats = new Map();
    this.registerObservers();
  }

  getLine(info: ActiveEditorCurrentInfo): Line | undefined {
    return this.filestats.get(info.fileName)?.linestats?.get(info.fileLineNumber);
  }

  initFile(info: ActiveEditorCurrentInfo): boolean {
    if (!this.filestats.has(info.fileName)) {
      // Init File
      this.filestats.set(info.fileName, new File(info.fileName, info.fileLineCount));
      // Init Line
      this.filestats.get(info.fileName)!.linestats.set(info.fileLineNumber, new Line(
        info.fileName,
        info.fileLineNumber
      ))
      return true;
    } else {
      let lines = this.filestats.get(info.fileName)!.linestats;
      if (!lines.has(info.fileLineNumber)) {
        lines.set(info.fileLineNumber, new Line(
          info.fileName, info.fileLineNumber
        ))
      }
    }
    return false;
  }

  registerObservers() {
    this.registerLineChangeObserver.bind(this)();

  }

  registerLineChangeObserver() {
    const obs = new PerformanceObserver((list) => {
      let info = globalThis.currentInfo;
      if (info) {
        let line = this.getLine(info);
        let measures = list.getEntriesByName(info.getMeasureId());
        if (measures.length > 1) {
          bad();
        }
        if (line) {
          line.totalDuration += measures[0].duration;
        }
      }
    });
    obs.observe({ entryTypes: ['measure'] });
  }
}
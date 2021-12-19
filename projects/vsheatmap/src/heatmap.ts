import * as vscode from "vscode";
import { Stats } from "./types"

export class HeatmapViewPanel {
    public static currentPanel: HeatmapViewPanel | undefined;

    public static readonly viewType = 'heatmapView';

    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];

    constructor(stats: Stats, out: vscode.OutputChannel, panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;
        // Send to webview
        this._panel.webview.postMessage({ stats: stats.toJson() });
        this._extensionUri = extensionUri;
        this._panel.webview.html = this.getHtml()
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'alert':
                        vscode.window.showErrorMessage(message.text);
                        return;
                }
            },
            null,
            this._disposables
        );
    }

    public static getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
        return {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'public')]
        };
    }


    public dispose() {
        HeatmapViewPanel.currentPanel = undefined;

        // Clean up our resources
        this._panel.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private getHtml() {
        const scriptPathOnDisk = vscode.Uri.joinPath(this._extensionUri, 'public', 'apex-built.js');
        const scriptUri = (scriptPathOnDisk).with({ 'scheme': 'vscode-resource' });
        const nonce = getNonce();

        return `

    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Simple HeatMap</title>

        <style>
            #chart {
                max-width: 1200px;
                margin: 35px auto;
            }
        </style>


    </head>

    <body>
        <div id="chart"></div>


        <script nonce="${nonce}" src="${scriptUri}"></script>

    </body>

    </html>
`
    }
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

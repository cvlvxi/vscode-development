import * as vscode from "vscode";

export class HeatmapViewPanel {
    public static currentPanel: HeatmapViewPanel | undefined;

    public static readonly viewType = 'heatmapView';

    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];

    public static getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
        return {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'public')]
        };
    }

    public static createOrShow(extensionUri: vscode.Uri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        // If we already have a panel, show it.
        if (HeatmapViewPanel.currentPanel) {
            HeatmapViewPanel.currentPanel._panel.reveal(column);
            return;
        }

        // Otherwise, create a new panel.
        const panel = vscode.window.createWebviewPanel(
            HeatmapViewPanel.viewType,
            'HeatmapView',
            column || vscode.ViewColumn.One,
            this.getWebviewOptions(extensionUri),
        );

        HeatmapViewPanel.currentPanel = new HeatmapViewPanel(panel, extensionUri);
    }

    public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        HeatmapViewPanel.currentPanel = new HeatmapViewPanel(panel, extensionUri);
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;
        this._extensionUri = extensionUri;
        this._panel.webview.html = this.getHtml()
        // this._update();
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        // this._panel.onDidChangeViewState(
        // 	e => {
        // 		if (this._panel.visible) {
        // 			this._update();
        // 		}
        // 	},
        // 	null,
        // 	this._disposables
        // );

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

    public doRefactor() {
        // Send a message to the webview webview.
        // You can send any JSON serializable data.
        this._panel.webview.postMessage({ command: 'refactor' });
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
        // Local path to main script run in the webview
        const scriptPathOnDisk = vscode.Uri.joinPath(this._extensionUri, 'public', 'apex-built.js');

        // And the uri we use to load this script in the webview
        const scriptUri = (scriptPathOnDisk).with({ 'scheme': 'vscode-resource' });

        // Use a nonce to only allow specific scripts to be run
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
                max-width: 650px;
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

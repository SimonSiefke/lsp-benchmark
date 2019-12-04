import * as path from "path";
import * as vscode from "vscode";
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind
} from "vscode-languageclient";

export const activate: (
  context: vscode.ExtensionContext
) => Promise<void> = async context => {
  const serverModule = context.asAbsolutePath(
    path.join("../", "server", "dist", "serverMain.js")
  );
  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: { execArgv: ["--nolazy", "--inspect=6009"] }
    }
  };
  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: "file", language: "plaintext" }]
  };
  const client = new LanguageClient(
    "languageServerExample",
    "Language Server Example",
    serverOptions,
    clientOptions
  );
  context.subscriptions.push(client.start());
  await client.onReady();
};

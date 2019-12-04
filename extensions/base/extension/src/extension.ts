import * as vscode from "vscode";
import {
  LanguageClient,
  ServerOptions,
  TransportKind,
  LanguageClientOptions
} from "vscode-languageclient";

export const activate = async (context: vscode.ExtensionContext) => {
  console.log("activated");
  const serverModule = context.asAbsolutePath("../server/dist/server2.js");
  console.log(serverModule);
  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: { execArgv: ["--nolazy", "--inspect=6009"] }
    }
  };
  const clientOptions: LanguageClientOptions = {
    documentSelector: [
      {
        scheme: "file",
        language: "plaintext"
      }
    ],
    outputChannel: {
      appendLine: console.log,
      append: console.log,
      clear: () => {},
      dispose: () => {},
      show: () => {},
      hide: () => {},
      name: "base"
    }
  };
  const languageClient = new LanguageClient(
    "base-extension",
    serverOptions,
    clientOptions
  );
  await languageClient.onReady();
};

import {
  CompletionItem,
  CompletionList,
  createConnection,
  IConnection,
  ServerCapabilities,
  TextDocuments,
  TextDocumentSyncKind
} from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";

const connection: IConnection = createConnection();
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

console.log = connection.console.log.bind(connection.console);
console.error = connection.console.error.bind(connection.console);

process.on("uncaughtException", console.error);
process.on("unhandledRejection", console.error);

connection.onInitialize(() => {
  // throw new Error("no");
  console.log("initialized");
  const capabilities: ServerCapabilities = {
    textDocumentSync: TextDocumentSyncKind.Incremental,
    completionProvider: {
      resolveProvider: false
    }
  };
  return { capabilities };
});

connection.onCompletion(() => {
  const completionItems: CompletionItem[] = [
    {
      label: "Completion 1"
    },
    {
      label: "Completion 2"
    }
  ];
  const completionList: CompletionList = {
    isIncomplete: false,
    items: completionItems
  };
  return completionList;
});

documents.listen(connection);
connection.listen();

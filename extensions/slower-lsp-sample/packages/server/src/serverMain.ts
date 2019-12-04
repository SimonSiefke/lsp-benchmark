import {
  CompletionItemKind,
  createConnection,
  ProposedFeatures,
  TextDocuments,
  TextDocumentSyncKind
} from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";

const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments(TextDocument);

connection.onInitialize(() => {
  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: {}
    }
  };
});

const doSomeUnnecessaryWork: () => Promise<void> = () =>
  new Promise(resolve => setTimeout(resolve, 5));

connection.onCompletion(async () => {
  await doSomeUnnecessaryWork();
  return [
    {
      label: "TypeScript",
      kind: CompletionItemKind.Text,
      data: 1
    },
    {
      label: "JavaScript",
      kind: CompletionItemKind.Text,
      data: 2
    }
  ];
});

documents.listen(connection);

connection.listen();

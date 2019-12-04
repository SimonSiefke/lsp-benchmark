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

connection.onCompletion(async () => [
  {
    label: "TypeScript",
    kind: CompletionItemKind.Text
  },
  {
    label: "JavaScript",
    kind: CompletionItemKind.Text
  }
]);

documents.listen(connection);
connection.listen();

import * as vscode from "vscode";
import * as fs from "fs-extra";
import * as path from "path";
import * as assert from "assert";

const extension = vscode.extensions.getExtension(
  `${process.env.publisher}.${process.env.name}`
) as vscode.Extension<any>;

/**
 * Activates the extension
 */
export const activateExtension: () => Promise<void> = () =>
  extension.activate() as any;

const createTestFile: (
  fileName: string,
  content: string
) => Promise<void> = async (fileName, content) => {
  const filePath = path.join(
    vscode.workspace.workspaceFolders![0].uri.fsPath,
    fileName
  );
  fs.writeFileSync(filePath, content);
  const uri = vscode.Uri.file(filePath);
  await vscode.window.showTextDocument(uri);
};

const saveStats: (stats: object) => void = stats => {
  fs.ensureDirSync(process.env.statsDir);
  fs.writeFileSync(
    path.join(process.env.statsDir, `${process.env.name}.json`),
    JSON.stringify(stats, null, 2) + "\n"
  );
};

const insertWhitespaceAtStart: () => Promise<void> = async () => {
  await vscode.window.activeTextEditor.insertSnippet(
    new vscode.SnippetString(" "),
    new vscode.Position(0, 0)
  );
};

const getCompletionList: () => Promise<vscode.CompletionList> = async () => {
  return vscode.commands.executeCommand<vscode.CompletionList>(
    "vscode.executeCompletionItemProvider",
    vscode.window.activeTextEditor.document.uri,
    new vscode.Position(0, 0)
  );
};

const average: (numbers: number[]) => number = numbers => {
  const total = numbers.reduce((total, current) => total + current, 0);
  return total / numbers.length;
};

/**
 * Tests how long completions take
 */
export const benchmarkCompletion: ({
  fileContent,
  fileName,
  numberOfCompletions,
  offset
}: {
  fileContent: string;
  fileName: string;
  numberOfCompletions: number;
  offset: number;
}) => Promise<void> = async ({
  fileContent,
  fileName,
  numberOfCompletions,
  offset
}) => {
  await createTestFile(fileName, fileContent);
  const document = vscode.window.activeTextEditor.document;
  const position = document.positionAt(offset);
  vscode.window.activeTextEditor.selection = new vscode.Selection(
    position,
    position
  );
  const times: [number, number][] = [];
  for (let i = 0; i < 300; i++) {
    const start = new Date().getTime();
    const completionList = await getCompletionList();
    const end = new Date().getTime();
    assert.equal(completionList.items.length, numberOfCompletions);
    times.push([start, end]);
    await insertWhitespaceAtStart();
  }
  const durations = times.map(([start, end]) => end - start);
  const avg = average(durations);
  saveStats({
    "completion-average": avg
  });
};

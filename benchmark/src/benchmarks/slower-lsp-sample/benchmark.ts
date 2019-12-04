import {
  activateExtension,
  benchmarkCompletion
} from "../../benchmark-utils/benchmark-utils";

suite("slower-lsp-sample", () => {
  test("Completions", async () => {
    await activateExtension();
    await benchmarkCompletion({
      fileContent: "sample text",
      fileName: "index.txt",
      numberOfCompletions: 2,
      offset: 0
    });
  });
});

import * as path from "path";
import { downloadAndUnzipVSCode, runTests } from "vscode-test";

const vscodeVersion = "1.40.2";
const root = path.resolve(__dirname, "../../");
let vscodeExecutablePath: string;

const setup: () => Promise<void> = async () => {
  vscodeExecutablePath = await downloadAndUnzipVSCode(vscodeVersion);
};

const run: (testCase: BenchMark) => Promise<void> = async testCase => {
  await runTests({
    vscodeExecutablePath,
    extensionDevelopmentPath: path.resolve(
      root,
      testCase.extensionDevelopmentPath
    ),
    extensionTestsPath: path.resolve(root, testCase.extensionTestPath),
    launchArgs: ["--disable-extensions", `${root}/playground`],
    extensionTestsEnv: {
      name: testCase.name,
      publisher: testCase.publisher,
      statsDir: `${root}/stats`
    }
  });
};

interface BenchMark {
  /**
   * Name of the extension as defined in the package.json file of the extension
   */
  readonly name: string;
  /**
   * Publisher of the extension as defined in the package.json file of the extension
   */
  readonly publisher: string;
  /**
   * Path to the extension
   */
  readonly extensionDevelopmentPath: string;
  /**
   * Path to the benchmark test files
   */
  readonly extensionTestPath: string;
}

const benchMarks: BenchMark[] = [
  {
    name: "slower-lsp-sample",
    publisher: "samples",
    extensionDevelopmentPath: "extensions/slower-lsp-sample/packages/extension",
    extensionTestPath: "benchmark/dist/benchmarks/slower-lsp-sample/suite"
  },
  {
    name: "lsp-sample",
    publisher: "samples",
    extensionDevelopmentPath: "extensions/lsp-sample",
    extensionTestPath: "benchmark/dist/benchmarks/lsp-sample/suite"
  }
];

const main: () => Promise<void> = async () => {
  try {
    await setup();
    for (const testCase of benchMarks) {
      for (let i = 0; i < 1; i++) {
        await run(testCase);
      }
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

main();

import * as path from "path";
import * as Mocha from "mocha";
import * as glob from "glob";

const testFiles = `benchmark.js`;

export const createRunner: (
  dirName: string
) => () => Promise<void> = dirname => {
  const mocha = new Mocha({
    ui: "tdd",
    timeout: 1000000
  });
  const testRoot = dirname.replace("src", "dist");
  mocha.useColors(true);
  mocha.bail(true);
  return () =>
    new Promise((resolve, reject) => {
      glob(testFiles, { cwd: testRoot }, (err, files) => {
        console.log(files);
        if (err) {
          console.log("reject");
          return reject(err);
        }
        files.forEach(f => mocha.addFile(path.resolve(testRoot, f)));
        try {
          mocha.run(failures => {
            if (failures > 0) {
              reject(new Error(`${failures} tests failed.`));
            } else {
              resolve();
            }
          });
        } catch (err) {
          console.log("error catch");
          reject(err);
        }
      });
    });
};

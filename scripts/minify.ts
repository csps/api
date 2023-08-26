/**
 * Minify build files after typescript compilation
 * @author mavyfaby (Maverick Fabroa)
 */

import { globSync } from "glob";
import chalk from "chalk";
import Terser from "terser";
import fs from "fs";

// List all javascript files in dist folder
const files = globSync("dist/**/*.js");

// For each file
for (const file of files) {
  // Log the file name
  console.log(chalk.blue(`[+] Minifying ${file}`));
  // Read and minify the file
  Terser.minify(fs.readFileSync(file, "utf8"))
    .then(result => {
      // Write the minified file
      fs.writeFileSync(file, result.code);
    })
    .catch(error => {
      // Log error
      console.log(chalk.red(`[-] Minifying ${file} error.`, error));
    });
}
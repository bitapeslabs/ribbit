import gulp from "gulp";
import { watch } from "gulp";
import { exec } from "child_process";

// Define the build task to run the Vite build command
const build = (cb) => {
  exec("npm run build", (err, stdout, stderr) => {
    if (err) {
      console.error(`Error: ${stderr}`);
    }
    console.log(stdout);
    cb(err);
  });
};

// Define the watch task to monitor file changes
const watchFiles = () => {
  // Watch all files in the src directory
  return watch(["src/**/*", "public/**/*"], build);
};

// Default task when running `gulp`
export default gulp.series(build, watchFiles);

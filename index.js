const util = require("util");
const exec = util.promisify(require("child_process").exec);
const npmInstall = async () => {
  const { stdout, stderr } = await exec("npm install");
  if (stderr) {
    if (process.env.NODE_ENV == "dev") {
      console.error(`error: ${stderr}`);
    } else {
      console.log(
        "There are a few errors. The program might crash. Contact Aditya for resolving."
      );
    }
  }
};
const start = async () => {
  const { stdout, stderr } = await exec("git pull");

  if (stderr) {
    if (process.env.NODE_ENV == "dev") {
      console.error(`error: ${stderr}`);
    } else {
      console.log(
        "There are a few errors. The program will still continue to function without new functionality. Contact Aditya for resolving."
      );
    }
  } else {
    console.log("Got latest version of the app.");
  }
  if (stdout && stdout.indexOf("install") >= 0) {
    console.log("New Module Installation Required. Installing Now.");
    await npmInstall();
  }
  // console.log(stdout);

  require("./app");
};

start();

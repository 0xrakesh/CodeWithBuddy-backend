const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs').promises;
const {v4: uuid} = require("uuid")
const path = require('path');
const { spawn } = require('child_process');

/*
Python Program Routes
- Execute the code with the input
- The input is a list data type, each value is given as separate input.
- If the code has error, it return the status as Compilation error.
- Otherwise it return the output of the code.
*/
exports.javascript = async (questions,input) => {

    let filename = uuid();
    const filePath = path.join(__dirname, `/userprogram/${filename}-input`);

    var inputData;
    if(typeof(input) !==  typeof([]))
	  inputData = input;
    else
	  inputData = input.join('\n')+'\n';

   const codePath = path.join(__dirname,`/userprogram/${filename}.js`);
   // Write input data and code to temporary files
   await fs.writeFile(codePath, questions.code);
   try {
       
        // Spawn a child Node.js process
        const child = spawn('node', [codePath], { stdio: ['inherit', 'pipe', 'pipe'] });

        // Capture stdout and stderr streams
        let stdout = '';
        let stderr = '';
        child.stdout.on('data', (data) => {
            stdout += data.toString();
        });
        child.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        // Wait for child process to exit
        const exitCode = await new Promise((resolve) => {
            child.on('exit', resolve);
        });

        // Cleanup temporary files
        await fs.unlink(codePath);

        // Handle successful execution
        if (exitCode === 0) {
            return stdout.trim();
        } else {
        return { status: 'Execution error', error: stderr.trim() };
        }
  } catch (error) {
    return { status: 'Compilation error', error };
  }
}



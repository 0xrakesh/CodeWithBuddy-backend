const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const {v4: uuid} = require("uuid")
const path = require('path');

/*
Python Program Routes
- Execute the code with the input
- The input is a list data type, each value is given as separate input.
- If the code has error, it return the status as Compilation error.
- Otherwise it return the output of the code.
*/
exports.python = async (questions,input) => {

    let filename = uuid();
    const filePath = path.join("/tmp/", `${filename}-input`);

    var inputData;
    if(typeof(input) !==  typeof([]))
	  inputData = input;
    else
	  inputData = input.join('\n')+'\n';

   const codePath = path.join("/tmp/",`${filename}.py`);
    try {
        await fs.promises.writeFile(filePath, inputData);
	    await fs.promises.writeFile(codePath, questions.code);
        const { stdout, stderr } = await exec(`python ${codePath}`);
        // const { stdout, stderr } = await exec(`python "${codePath}" < ${filePath}`);
        return stdout.trim();
    } catch (error) {
        return {status:'Compilation error',error:error }
    }
}



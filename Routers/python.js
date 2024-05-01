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
    const filePath = path.join(__dirname, `/userprogram/${filename}-input`);

    var inputData;
    if(typeof(input) !==  typeof([]))
	  inputData = input;
    else
	  inputData = input.join('\n')+'\n';

   const codePath = path.join(__dirname,`/userprogram/${filename}.py`);
    try {
        await fs.promises.writeFile(filePath, inputData);
	    await fs.promises.writeFile(codePath, questions.code);
        const { stdout, stderr } = await exec(`python ${codePath} < ${filePath}`);
        // const { stdout, stderr } = await exec(`python "${codePath}" < ${filePath}`);

        await fs.promises.unlink(filePath);
        await fs.promises.unlink(codePath);

        return stdout.trim();
    } catch (error) {
        return {status:'Compilation error',error:error }
    }
}



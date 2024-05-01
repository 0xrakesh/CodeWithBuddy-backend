const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const {v4:uuid} = require("uuid");
const path = require('path');


/*
C Program Routes
- Execute the code with the input
- The input is a list data type, each value is given as separate input.
- If the code has error, it return the status as Compilation error.
- Otherwise it return the output of the code.
*/
exports.c = async (questions,input) => {
    let filename = uuid();
    const filePathInput = path.join(__dirname, `/userprogram/${filename}-input`);
    const filePath = path.join(__dirname+`/userprogram/${filename}.c`)

    var cCode = questions.code;

    try {
	var inputData;
        // Prepare input data
        if(typeof(input) !== typeof([])){
		inputData = input;
	}
	else
		inputData = input.join('\n') + '\n';

	    cCode = cCode.replace(/void\s+main\s*\(/g,"int main(")

        // Write the C code to a file
        await fs.promises.writeFile(filePath, cCode);
        await fs.promises.writeFile(filePathInput, inputData);

        // Compile the C code using gcc
        let outPath = path.join(__dirname+`/userprogram/${filename}.out`)
        const compileCommand = `gcc ${filePath} -o ${outPath}`;
        await exec(compileCommand);

        // Execute the compiled C code and pass input data
        const executeCommand = `${outPath}`;
        const { stdout, stderr } = await exec(` ${executeCommand} < ${filePathInput}`);
        // Clean up the executable file
        await fs.promises.unlink(path.join(__dirname+`/userprogram/${filename}-input`));
        await fs.promises.unlink(path.join(__dirname+`/userprogram/${filename}.c`))
        await fs.promises.unlink(outPath)
        
        
        return stdout.trim();
    } catch (error) {
        return {status:'Compilation error',error:error }
    }
};


/*
C++ Program Routes
- Execute the code with the input
- The input is a list data type, each value is given as separate input.
- Exception handle if the input is empty, it create a empty list as input and give as input for program.
- If the code has error, it return the status as Compilation error.
- Otherwise it return the output of the code.
*/
exports.cpp = async (user, examID, questions, i, input) => {
    const filePathInput = path.join(__dirname, 'UserProgram', `${user.name}${examID}${i}${questions.number}-input`);
    const filePath = path.join(__dirname, 'UserProgram', `${user.name}${examID}${i}${questions.number}-input.cpp`);

    const cCode = questions.code;

    try {
        // Prepare input data
	var inputData;
        if(typeof(input) !== typeof(new Array())) {
		inputData = input;
	}
	else
		inputData = input.join('\n') + '\n';

        // Write the C code to a file
        await fs.promises.writeFile(filePath, cCode);
        await fs.promises.writeFile(filePathInput, inputData);
        
        // Compile the C code using gcc
        const compileCommand = `g++ ${filePath} -o ${filePath}.out`;
        await exec(compileCommand);


        // Execute the compiled C code and pass input data
        const executeCommand = `${filePath}.out`;
        const { stdout, stderr } = await exec(` ${executeCommand} < ${filePathInput} `);

        // Clean up the executable file
        await fs.promises.unlink(`${filePath}.out`);
	console.log(stdout);
        return stdout.trim();
    } catch (error) {
        return {status:'Compilation error',error:error }
    }
};

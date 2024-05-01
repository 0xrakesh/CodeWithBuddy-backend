const python = require("./python")
const {c} = require("./c")
const {javascript} = require("./javascript")

exports.compiler = async (req,res) => {
    const { code, input, language } = req.body;
    var inputValue;
    if(!input)
		inputValue = [];
    else
		inputValue = input
    let questions = {
        code: code
    }
    var outputArray = [];
    let output;
    for(const io of inputValue) {
        switch(language) {
            case "python":
                output = await python.python(questions,io);
                outputArray.push(output);
                break;
            case "c":
                output = await c(questions, io);
                outputArray.push(output);
                break;
            
            case "javascript":
                output = await javascript(questions, io);
                outputArray.push(output);
                break;
            // case "cpp":
            //     output = await c.cpp(user,examID,questions, 1, io);
            //     outputArray.push(output);
            //     break;
            // case "java":
            //     output = await java.java(user,examID, questions, 1,io);
            //     outputArray.push(output);
            //     break;
        default:
            break;
	    }
    };
    return res.json({output:outputArray});
}

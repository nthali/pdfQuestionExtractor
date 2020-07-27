class QuizCreator {
    #questionExtractor = new QuestionDataExtractor();
    #answerExtractor = new AnswerDataExtractor();

    createQuiz( questionsText, answersText ) {
        const quiz = new Quiz();
        quiz.addQuestions( this.#questionExtractor.extractQuestions( questionsText ) );
        quiz.addAnswers( this.#answerExtractor.extractAnswers( answersText ) );
        return quiz;
    }
}

class Quiz {
    #questions = [];

    addQuestions( questions ) {
        this.#questions = [...questions];
    }

    addAnswers( answers ) {
        this.#questions.forEach( (question, index) => {
            question.answer = answers[index];
        });
    }

    addQuestion( question ) {
        this.#questions.push( question );
    }

    question(index) {
        return this.#questions[index];
    }

    totalQuestions() {
        return this.#questions.length;
    }

    toJson() {
        const fullQuizStr = [];
        fullQuizStr.push( "const myQuestions = [\n" );
        this.#questions.forEach( (question, index) => {
            fullQuizStr.push( question.toJson() );
            if ( index < this.#questions.length-1 ) {
                fullQuizStr.push(",\n");
            }
        });
        fullQuizStr.push("];");
        return fullQuizStr.join("");
    }
}

/**
 * QuizQuestion stores the question, the choices and the (correct) answer(s) 
 * and returns the formatted json question
 */
class QuizQuestion {
    #index = 1;
    #question = "";
    #choices = ["", "", "", ""];
    #answer = "";
    #multipleChoice = false;

    constructor( index, question, choices, answer ) {
        this.#index = index;
        this.#question = question;
        if ( question.includes("(Choose")) {
            this.#multipleChoice = true;
        }
        this.#choices = choices;
        this.#answer = answer;
        if (typeof answer !== 'undefined' && Array.isArray(answer)) {
            this.#multipleChoice = true;
        }    
    }

    set question(theQuestion) {
        if ( theQuestion != null )
            this.#question = theQuestion;
    }

    get question() { return this.#question; }

    set choices(theChoices) {
        if ( theChoices != null ) 
            this.#choices = theChoices;
    }

    get choices() { return this.#choices; }

    set answer(theAnswer) {
        if ( theAnswer != null )
            this.#answer = theAnswer;
    }

    get answer() { return this.#answer; }

    toJson() {
        const output = [];
        output.push(
            '// Q' + this.#index + '\n' + // purely convenience
            '{\n' +
            "  question: '" + this.#question + "',\n" +
            '  choices: {\n');
        this.#choices.forEach( (choice, index) => {
            var choiceStr = '    ' + StringUtils.nextChar('a', index) + ": '" + choice + "'";
            if (index < this.#choices.length-1) {
                choiceStr += ',';
            }
            output.push( choiceStr + '\n' );
        });
        output.push("  },\n");
        var answers = "  answer: ";
        if ( typeof this.#answer === 'undefined' ) {
            answers += "''";
        }
        else 
        if ( this.#multipleChoice ) {
            answers += '[ ';
            this.#answer.forEach( (ans, i) => {
                answers += "'" + ans + "'";
                if ( i < this.#answer.length-1 ) {
                    answers += ", ";
                }
            });
            answers += " ]";
        }
        else {
            answers += "'" + this.#answer + "'";
        }
        output.push( answers + '\n' );
        output.push('}');
        return output.join("");
    }
}

/**
 * This class specifically extracts the Question and the (answer) choices from a string like this:
 * "Review	Questions 1 . In what ways does Amazon Simple Storage Service (Amazon S3) object storage differ from block and file storage? (Choose 2 answers) A . Amazon S3 stores data in fixed size blocks. B . Objects are identified by a numbered address. C . Objects can be any size. D . Objects contain both data and metadata. E . Objects are stored in buckets."
 */
class QuestionDataExtractor {

    constructor() {
    }

    /**
     * Takes an array of extractedText, cleans up and condenses the array into a single string 
     * and then extracts the question and choices 
     * @param {String[]} extractedTextLines 
     */
    extractQuestions( extractedTextLinesArray ) {
        // convert all whitespace to single whitespace
        var trimmedLine = StringUtils.tabsToSingleWhitespace( extractedTextLinesArray );

        const quizQuestions = [];
        var questionStringArray = this.separateQuestionStringChunksFromFullText(trimmedLine);
        questionStringArray.forEach( (questionString, index) => {
            var questionAndChoices = this.extractQuestion( questionString );
            quizQuestions.push( new QuizQuestion( index+1, questionAndChoices[0], questionAndChoices[1] ) );
        });
        return quizQuestions;
    }

    // hardcoded start and ends may need to be parameterized in the future
    extractQuestion( text ) {
        var question;
        var choices = [];

        // extract the question. we are looking for 1 . (official study guide) or 1. (sybex practice tests)
        var indexOfQuestionNumber = text.search(/\d[\s]*\./g);
        var indexOfFirstChoice = text.search(/A[ ]*\./g);

        // unfortunately a comment is needed here about the use of "intermediate", till i (or someone else) 
        // uses better javascript to do this a different way.
        // the pdf that i'm extracting these questions from has the word "Review Questions" first. 
        // "intermediate" is used to skip the "Review Questions" string
        var intermediate = "";
        if ( indexOfFirstChoice === -1 ) { // incomplete text. only question present. no choices
            intermediate = text.substring( indexOfQuestionNumber );
        }
        else {
            intermediate = text.substring( indexOfQuestionNumber, indexOfFirstChoice );
        }
        var indexOfQuestionTextStart = intermediate.search(/[A-Z]/g);
        question = intermediate.substring( indexOfQuestionTextStart ).trim();

        if ( indexOfFirstChoice > -1 ) {
            choices = Array.from(this.extractChoices(text.substring(indexOfFirstChoice), 0));
        }

        return [ question, choices ];
    }

    extractChoices(text, indexOfFirstChoice) {
        var choices = [];

        var currChoice = 'A';
        var nextChoice = StringUtils.nextChar(currChoice, 1);
        var currIndex = indexOfFirstChoice;
        while ( currIndex < text.length ) {
            var re1 = new RegExp(currChoice + '[ ]*\\.', "g");
            var re2 = new RegExp(nextChoice + '[ ]*\\.', "g");
            var startOfThisChoice = text.search(re1);
            var startOfNextChoice = text.search(re2);
            if ( startOfNextChoice != -1 ) {
                choices.push( text.substring( startOfThisChoice+4, startOfNextChoice ).trim() );
                currIndex = startOfNextChoice;
                currChoice = nextChoice;
                nextChoice = StringUtils.nextChar(currChoice, 1);
            }
            else { // end of line?
                choices.push( text.substring( startOfThisChoice+4 ).trim() );
                break;
            }
        }
        return choices;
    }

    /**
     * This function separates the full text string out into an array of individual questions
     * @param {String} fullText 
     */
    separateQuestionStringChunksFromFullText( fullText, currQNum=1 ) {
        const questionStringArray = [];
        var currIndex = 0;
        while ( currIndex < fullText.length ) {
            var re1 = new RegExp(currQNum.toString() + '[ ]*\\.', "g");
            var re2 = new RegExp((currQNum+1).toString() + '[ ]*\\.', "g");
            var startOfThisQuestion = this.indexOf( currQNum, fullText );
            var startOfNextQuestion = this.indexOf( currQNum+1, fullText );
            if ( startOfNextQuestion != -1 ) {
                questionStringArray.push( fullText.substring( startOfThisQuestion, startOfNextQuestion ).trim() );
                currIndex = startOfNextQuestion;
                currQNum++;
                }
            else { // end of line?
                questionStringArray.push( fullText.substring( startOfThisQuestion ).trim() );
                break;
            }
        }
        return questionStringArray;
    }

    /**
     * The whole reason this helper method exists is because one of the question numbers
     * in a pdf got extracted as '6 7', instead of 67. Go figure.
     * it tries to fix such deformed question numbers.
     * @param {Integer} currQNum the question number we are looking for
     * @param {String} text the text string in which to search
     */
    indexOf( currQNum, text ) {
        var re1 = new RegExp(currQNum.toString() + '[ ]*\\.', "g");
        var pos = text.search( re1 );
        if ( pos > -1 ) {
            return pos;
        }

        // didn't find the number. e.g. 67. now we are looking for 6 7
        var individualDigitsArray = currQNum.toString().split('');
        var searchStrForIndividualDigits = '';
        individualDigitsArray.forEach( (digit, i) => {
            searchStrForIndividualDigits += digit;
            if ( i < individualDigitsArray.length-1 ) {
                searchStrForIndividualDigits += '[ ]*';
            }
            else {
                searchStrForIndividualDigits += '\\.';
            }
        });
        var re2 = new RegExp( searchStrForIndividualDigits );
        pos = text.search( re2 );
        return pos;
    }
}

class AnswerDataExtractor {
    // '3.   B.   Many of these answers are nonsensical in terms of what AWS allows. The limits on size  related to S3 are for objects; an individual object can be as large as 5 TB. Both A and C,  then, are not useful (or possible). D proposes to increase the maximum object size to 50  GB, but the maximum object size is already 5 TB. Option B is correct; AWS recommends  using Multipart Upload for all objects larger than 100 MB.      '
    // '4.   C, D.   PUTs of new objects have a read after write consistency. DELETEs and overwrite  PUTs have eventual consistency across S3.      '
    extractAnswers( answerPagesTextArray, qNum=1 ) {
        const answersText = StringUtils.tabsToSingleWhitespace( answerPagesTextArray );
        const answers = [];
        while (answersText.indexOf(qNum + ".") > -1) {
            var re1 = new RegExp(qNum + '\\.[\\s]+[A-E]', 'g');
            const ansStart = answersText.search(re1);
            const afterPeriodPos = ansStart+qNum.toString().length+1;
            const ansStr = answersText.substring(afterPeriodPos, answersText.indexOf('.', afterPeriodPos)).trim();
            if (ansStr.indexOf(',') > -1) { // multiple correct answers
                var arr = ansStr.split(',').map( item => item.trim() );
                answers.push(arr);
            } else {
                answers.push(ansStr);
            }
            qNum++;
        }
        return answers;
    }

}

class StringUtils {
    
    static tabsToSingleWhitespace(extractedTextLines) {
        var extractedTextLinesTrimmed = "";
        extractedTextLines.forEach( (line) => {
            extractedTextLinesTrimmed += line.replace(/\t/g, ' ');
        });
        return extractedTextLinesTrimmed.trim();
    }    

    /**
     * This method extracts the question and the (answer) choices from a single question string
     * @param {String} trimmedText 
     */
    static nextChar(c, index) {
        return String.fromCharCode(c.charCodeAt(0) + index);
    }

}

module.exports = {
    QuizCreator,
    Quiz,
    QuizQuestion,
    QuestionDataExtractor,
    AnswerDataExtractor,
    StringUtils
}
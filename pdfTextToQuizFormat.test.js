const { QuestionDataExtractor, StringUtils, AnswerDataExtractor, QuizCreator, Quiz } = require('./pdfTextToQuizFormat');

test( 'createQuiz with questions and answers', () => {
    const quizCreator = new QuizCreator();
    expect( quizCreator.createQuiz( [SYBEX_QUESTIONS_1ST_PAGE], [SYBEX_ANSWERS_1ST_PAGE] ).toJson() ).toEqual( EXPECTED_QUIZ_JSON_SYBEX_WITH_ANSWERS );
});

test( 'createQuiz for official study guide NO ANSWERS', () => {
    const quizCreator = new QuizCreator();
    expect( quizCreator.createQuiz( extractedTextLines, [] ).toJson() ).toEqual( expectedQuizJsonForOfficialStudyGuide );
});

test( 'createQuiz for sybex practice tests NO ANSWERS', () => {
    const quizCreator = new QuizCreator();
    expect( quizCreator.createQuiz( [SYBEX_QUESTIONS_1ST_PAGE], [] ).toJson() ).toEqual( EXPECTED_QUIZ_JSON_SYBEX_NO_ANSWERS );
});

test( 'createQuiz for a single sybex question NO ANSWERS', () => {
    const sybex1Question = 
        "2   Chapter 1   ■   Domain 1: Design Resilient Architectures  Review Questions      " +
        "1.   Which of the following statements regarding S3 storage classes is true? " + 
        "A.   The availability of S3 and S3-IA is the same. " + 
        "B.   The durability of S3 and S3-IA is the same. " +
        "C.   The latency of S3 and Glacier is the same. " +
        "D.   The latency of S3 is greater than that of Glacier.      ";

    const sybex1QuestionQuizJson = 
        "const myQuestions = [\n" +
        "// Q1\n" +
        "{\n" +
        "  question: 'Which of the following statements regarding S3 storage classes is true?',\n" +
        "  choices: {\n" +
        "    A: 'The availability of S3 and S3-IA is the same.',\n" +
        "    B: 'The durability of S3 and S3-IA is the same.',\n" +
        "    C: 'The latency of S3 and Glacier is the same.',\n" +
        "    D: 'The latency of S3 is greater than that of Glacier.'\n" +
        "  },\n" +
        "  answer: ''\n" +
        "}];"

        const quizCreator = new QuizCreator();
        expect( quizCreator.createQuiz( [sybex1Question], [] ).toJson() ).toEqual( sybex1QuestionQuizJson );
});

test( 'createQuiz single page with 5th question incomplete formats correctly NO ANSWERS', () => {
    const oneExtractedTextLine =
    "Review	Questions 1 .	 In	what	ways	does	Amazon	Simple	Storage	Service	(Amazon	S3)	object	storage	differ from	block	and	file	storage?	(Choose	2	answers) A .	 Amazon	S3	stores	data	in	fixed	size	blocks. B .	 Objects	are	identified	by	a	numbered	address. C .	 Objects	can	be	any	size. D .	 Objects	contain	both	data	and	metadata. E .	 Objects	are	stored	in	buckets. 2 .	 Which	of	the	following	are	not	appropriates	use	cases	for	Amazon	Simple	Storage	Service (Amazon	S3)?	(Choose	2	answers) A .	 Storing	web	content B .	 Storing	a	file	system	mounted	to	an	Amazon	Elastic	Compute	Cloud	(Amazon	EC2) instance C .	 Storing	backups	for	a	relational	database D .	 Primary	storage	for	a	database E .	 Storing	logs	for	analytics 3 .	 What	are	some	of	the	key	characteristics	of	Amazon	Simple	Storage	Service	(Amazon S3)?	(Choose	3	answers) A .	 All	objects	have	a	URL. B .	 Amazon	S3	can	store	unlimited	amounts	of	data. C .	 Objects	are	world-readable	by	default. D .	 Amazon	S3	uses	a	REST	(Representational	State	Transfer)	Application	Program Interface	(API). E .	 You	must	pre-allocate	the	storage	in	a	bucket. 4 .	 Which	features	can	be	used	to	restrict	access	to	Amazon	Simple	Storage	Service	(Amazon S3)	data?	(Choose	3	answers) A .	 Enable	static	website	hosting	on	the	bucket. B .	 Create	a	pre-signed	URL	for	an	object. C .	 Use	an	Amazon	S3	Access	Control	List	(ACL)	on	a	bucket	or	object. D .	 Use	a	lifecycle	policy. E .	 Use	an	Amazon	S3	bucket	policy. 5 .	 Your	application	stores	critical	data	in	Amazon	Simple	Storage	Service	(Amazon	S3), which	must	be	protected	against	inadvertent	or	intentional	deletion.	How	can	this	data be	protected?	(Choose	2	answers) ";

    const quizCreator = new QuizCreator();
    expect( quizCreator.createQuiz( [oneExtractedTextLine], [] ).toJson() ).toEqual( EXPECTED_QUIZ_JSON_INCOMPLETE_5TH_Q_NO_ANSWERS );
});

test( 'extract question data for string with only question and no choices extracts correctly', () => {
    const textWithOnlyQuestionAndNoChoices = '5 .  Your application stores critical data in Amazon Simple Storage Service (Amazon S3), which must be protected against inadvertent or intentional deletion. How can this data be protected? (Choose 2 answers)';
    const expectedQ = 'Your application stores critical data in Amazon Simple Storage Service (Amazon S3), which must be protected against inadvertent or intentional deletion. How can this data be protected? (Choose 2 answers)';
    
    const qExtractor = new QuestionDataExtractor();
    const q = qExtractor.extractQuestion( textWithOnlyQuestionAndNoChoices, 5 );
    expect( q[0] ).toEqual( expectedQ );
});

test( 'splitQuestionStrings For Sybex Practice Exam Text', () => {
    const qExtractor = new QuestionDataExtractor();
    const questionStringArray = qExtractor.splitQuestionStrings( SYBEX_QUESTIONS_1ST_PAGE );
    expect( questionStringArray.length ).toBe( 4 ); // 4 Questions
});

test( 'splitQuestionStrings From FullText', () => {
    const fullText = "Review Questions 1 . In what ways does Amazon Simple Storage Service (Amazon S3) object storage differ from block and file storage? (Choose 2 answers) A . Amazon S3 stores data in fixed size blocks. B . Objects are identified by a numbered address. C . Objects can be any size. D . Objects contain both data and metadata. E . Objects are stored in buckets. 2 . Which of the following are not appropriates use cases for Amazon Simple Storage Service (Amazon S3)? (Choose 2 answers) A . Storing web content B . Storing a file system mounted to an Amazon Elastic Compute Cloud (Amazon EC2) instance C . Storing backups for a relational database D . Primary storage for a database E . Storing logs for analytics 3 . What are some of the key characteristics of Amazon Simple Storage Service (Amazon S3)? (Choose 3 answers) A . All objects have a URL. B . Amazon S3 can store unlimited amounts of data. C . Objects are world-readable by default. D . Amazon S3 uses a REST (Representational State Transfer) Application Program Interface (API). E . You must pre-allocate the storage in a bucket. 4 . Which features can be used to restrict access to Amazon Simple Storage Service (Amazon S3) data? (Choose 3 answers) A . Enable static website hosting on the bucket. B . Create a pre-signed URL for an object. C . Use an Amazon S3 Access Control List (ACL) on a bucket or object. D . Use a lifecycle	policy. E . Use an Amazon S3 bucket policy.";
    const expectedQuestionStrings = [
        "1 . In what ways does Amazon Simple Storage Service (Amazon S3) object storage differ from block and file storage? (Choose 2 answers) A . Amazon S3 stores data in fixed size blocks. B . Objects are identified by a numbered address. C . Objects can be any size. D . Objects contain both data and metadata. E . Objects are stored in buckets.",
        "2 . Which of the following are not appropriates use cases for Amazon Simple Storage Service (Amazon S3)? (Choose 2 answers) A . Storing web content B . Storing a file system mounted to an Amazon Elastic Compute Cloud (Amazon EC2) instance C . Storing backups for a relational database D . Primary storage for a database E . Storing logs for analytics",
        "3 . What are some of the key characteristics of Amazon Simple Storage Service (Amazon S3)? (Choose 3 answers) A . All objects have a URL. B . Amazon S3 can store unlimited amounts of data. C . Objects are world-readable by default. D . Amazon S3 uses a REST (Representational State Transfer) Application Program Interface (API). E . You must pre-allocate the storage in a bucket.",
        "4 . Which features can be used to restrict access to Amazon Simple Storage Service (Amazon S3) data? (Choose 3 answers) A . Enable static website hosting on the bucket. B . Create a pre-signed URL for an object. C . Use an Amazon S3 Access Control List (ACL) on a bucket or object. D . Use a lifecycle	policy. E . Use an Amazon S3 bucket policy."
    ];
    const qExtractor = new QuestionDataExtractor();
    const questionStringArray = qExtractor.splitQuestionStrings( fullText );
    expect( questionStringArray.length ).toBe( 4 ); // 4 Questions
    questionStringArray.forEach( (questionStr, index) => {
        expect( questionStr ).toEqual( expectedQuestionStrings[index] );
    });
});

test( 'splitQuestionStrings from text with incorrect q number', () => {
    // Q67 shows up as 6 7, instead of 67 :(
    const sybexQuestionsProblemPage = 
    "Review Questions   13    " + 
    "64.   How long is a presigned URL valid? A.   60 seconds B.   60 minutes C.   24 hours D.   As long as it is configured to last    " + 
    "65.   Which of the following HTTP methods with regard to S3 have eventual consistency?  (Choose two.) A.      UPDATEs B.      DELETEs C.   PUTs of new objects D.   Over write PU Ts    " + 
    "66.   Which of the following behaviors is consistent with how S3 handles object operations on a  bucket? A.   A process writes a new object to Amazon S3 and immediately lists keys within its  bucket. The new object does not appear in the list of keys. B.   A process deletes an object, attempts to immediately read the deleted object, and S3  still returns the deleted data. C.   A process deletes an object and immediately lists the keys in the bucket. S3 returns a  list with the deleted object in the list. D.   All of the above    " + 
    "6 7.   In which regions does Amazon S3 offer eventual consistency for overwrite PUTs and  DELETEs? A.   All US regions B.   All US and EU regions C.   All regions D.   No regions, eventual consistency is not the model for overwrite PUTs.    " + 
    "68.   Which of the following storage media are object based? (Choose two.) A.     S3-IA B.      EBS C.      EFS D.   S3 standard    " + 
    "69.   EBS stands for what? A.   Elastic Based Storage B.   Elastic Block Storage C.   Extra Block Storage D.   Ephemeral Block Storage";

    const qExtractor = new QuestionDataExtractor();
    const qStrArray = qExtractor.splitQuestionStrings( sybexQuestionsProblemPage, 64 );
    expect( qStrArray.length ).toBe( 6 );
    expect( qStrArray[3] ).toEqual( '6 7.   In which regions does Amazon S3 offer eventual consistency for overwrite PUTs and  DELETEs? A.   All US regions B.   All US and EU regions C.   All regions D.   No regions, eventual consistency is not the model for overwrite PUTs.' );
});

test( 'full quiz creation for page with num 6 7', () => {
    // Q67 shows up as 6 7, instead of 67 :(
    const sybexQuestionsProblemPage = 
        "Review Questions   13    " + 
        "64.   How long is a presigned URL valid? " +
        "A.   60 seconds " + 
        "B.   60 minutes " + 
        "C.   24 hours " + 
        "D.   As long as it is configured to last    " + 
        "65.   Which of the following HTTP methods with regard to S3 have eventual consistency?  (Choose two.) " + 
        "A.      UPDATEs " + 
        "B.      DELETEs " + 
        "C.   PUTs of new objects " + 
        "D.   Over write PU Ts    " + 
        "66.   Which of the following behaviors is consistent with how S3 handles object operations on a  bucket? " + 
        "A.   A process writes a new object to Amazon S3 and immediately lists keys within its  bucket. The new object does not appear in the list of keys. " + 
        "B.   A process deletes an object, attempts to immediately read the deleted object, and S3  still returns the deleted data. " + 
        "C.   A process deletes an object and immediately lists the keys in the bucket. S3 returns a  list with the deleted object in the list. " + 
        "D.   All of the above    " + 
        "6 7.   In which regions does Amazon S3 offer eventual consistency for overwrite PUTs and  DELETEs? " + 
        "A.   All US regions " + 
        "B.   All US and EU regions " + 
        "C.   All regions " + 
        "D.   No regions, eventual consistency is not the model for overwrite PUTs.    " + 
        "68.   Which of the following storage media are object based? (Choose two.) " + 
        "A.     S3-IA " + 
        "B.      EBS " + 
        "C.      EFS " + 
        "D.   S3 standard    " + 
        "69.   EBS stands for what? " + 
        "A.   Elastic Based Storage " + 
        "B.   Elastic Block Storage " + 
        "C.   Extra Block Storage " + 
        "D.   Ephemeral Block Storage";

    const expectedQuizJsonFor6_7 = 
        "const myQuestions = [\n" +
            "// Q64\n" +
            "{\n" +
            "  question: 'How long is a presigned URL valid?',\n" +
            "  choices: {\n" +
            "    A: '60 seconds',\n" +
            "    B: '60 minutes',\n" +
            "    C: '24 hours',\n" +
            "    D: 'As long as it is configured to last'\n" +
            "  },\n" +
            "  answer: 'D'\n" +
            "},\n" +
            "// Q65\n" +
            "{\n" +
            "  question: 'Which of the following HTTP methods with regard to S3 have eventual consistency?  (Choose two.)',\n" +
            "  choices: {\n" +
            "    A: 'UPDATEs',\n" +
            "    B: 'DELETEs',\n" +
            "    C: 'PUTs of new objects',\n" +
            "    D: 'Over write PU Ts'\n" +
            "  },\n" +
            "  answer: [ 'B', 'D' ]\n" +
            "},\n" +
            "// Q66\n" +
            "{\n" +
            "  question: 'Which of the following behaviors is consistent with how S3 handles object operations on a  bucket?',\n" +
            "  choices: {\n" +
            "    A: 'A process writes a new object to Amazon S3 and immediately lists keys within its  bucket. The new object does not appear in the list of keys.',\n" +
            "    B: 'A process deletes an object, attempts to immediately read the deleted object, and S3  still returns the deleted data.',\n" +
            "    C: 'A process deletes an object and immediately lists the keys in the bucket. S3 returns a  list with the deleted object in the list.',\n" +
            "    D: 'All of the above'\n" +
            "  },\n" +
            "  answer: 'D'\n" +
            "},\n" +
            "// Q67\n" +
            "{\n" +
            "  question: 'In which regions does Amazon S3 offer eventual consistency for overwrite PUTs and  DELETEs?',\n" +
            "  choices: {\n" +
            "    A: 'All US regions',\n" +
            "    B: 'All US and EU regions',\n" +
            "    C: 'All regions',\n" +
            "    D: 'No regions, eventual consistency is not the model for overwrite PUTs.'\n" +
            "  },\n" +
            "  answer: 'C'\n" +
            "},\n" +
            "// Q68\n" +
            "{\n" +
            "  question: 'Which of the following storage media are object based? (Choose two.)',\n" +
            "  choices: {\n" +
            "    A: 'S3-IA',\n" +
            "    B: 'EBS',\n" +
            "    C: 'EFS',\n" +
            "    D: 'S3 standard'\n" +
            "  },\n" +
            "  answer: [ 'A', 'D' ]\n" +
            "},\n" +
            "// Q69\n" +
            "{\n" +
            "  question: 'EBS stands for what?',\n" +
            "  choices: {\n" +
            "    A: 'Elastic Based Storage',\n" +
            "    B: 'Elastic Block Storage',\n" +
            "    C: 'Extra Block Storage',\n" +
            "    D: 'Ephemeral Block Storage'\n" +
            "  },\n" +
            "  answer: 'B'\n" +
            "}];";

    const quizCreator = new QuizCreator();
    const quiz = quizCreator.createQuiz( [sybexQuestionsProblemPage], [ANSWERS_PAGE_FOR_6_7], 64, 59 );
    // expect( quiz.toJson() ).toEqual( expectedQuizJsonFor6_7 );
});

test( "findIndexOf in Quiz", () => {
    answers = [ [59, 'a'], [60, 'b'], [61, 'c'], [62, 'd']];
    const quiz = new Quiz();
    expect( quiz.findIndexOf( 60, answers ) ).toBe( 1 );
});

const ANSWERS_PAGE_FOR_6_7 = 
"Domain 1: Design Resilient Architectures   187    " + 
"59.   B.   S3 uploads are, by default, done via a single operation, usually via a single PUT  operation. AWS suggests that you can upload objects up to 100 MB before changing to  Multipart Upload.    " + 
"60.   B.   Using the Multipart Upload is almost entirely a function of the size of the files being  uploaded. AWS recommends using it for any files greater than 100 MB, and 10 GB is  certainly large enough to benefit from Multipart Uploads.    " + 
"61.   A, C.   Multipart Upload is, as should be the easiest answer, ideal for large objects on  stable networks (A). But it also helps handle less-reliable networks as smaller parts can fail  while others get through, reducing the overall failure rate (C). There is no cost associated  with data ingress (B), and D doesn’t make much sense at all!    " + 
"62.   A, C.   Presigned URLs are created to allow users without AWS credentials to access  specific resources (option C). And it’s the creator of the URL (option A) that assigns these  permissions, rather than the user (option B). Finally, these credentials are associated with  the URL but are not encrypted into the URL itself.    " + 
"63.   D.   Presigned URLs are not tied to specific AWS services. They are simply URLs that  can point at anything a normal URL can point at, except that the creator can associate  permissions and a timeout with the URL.    " + 
"64.   D.   A presigned URL is always configured at creation for a valid Time to Live (often  referred to as TTL). This time can be very short, or quite long.    " + 
"65.   B, D.   Overwrite PUTs and DELETEs have eventual consistency. PUTs of new objects have  write and then read consistency.    " + 
"66.   D.   These are all consistent with S3 behavior. Option A could occur as the new object is  being propagated to additional S3 buckets. B and C could occur as a result of eventual  consistency, where a DELETE operation does not immediately appear.    " + 
"6 7.   C.   All regions have eventual consistency for overwrite PUTs and DELETEs.    " + 
"68.   A, D.   All S3 storage classes are object-based, while EBS and EFS are block-based.    " + 
"69.   B.   EBS stands for Elastic Block Storage.    " + 
"70.   B.   New objects uploaded via PUT are subject to read after write consistency. Overwrite  PUTs use the eventual consistency model.    " + 
"71.   C.   This is important because it reflects a recent change by AWS. Until 2018, there was a  hard limit on S3 of 100 PUTs per second, but that limit has now been raised to 3500 PUTs  per second.    " + 
"72.   B.   S3 buckets have names based upon the S3 identifier (s3), the region (us-west-1 in this  case), and the  amazonaws.com  domain. Then, the bucket name appears  after  the domain.  That results in B,  https://s3-us-west-1.amazonaws.com/prototypeBucket32 . Option  A has an incorrect region, and both C and D have the bucket name in the domain, which  is incorrect.";

const INDIVIDUAL_ANS_STRINGS_FOR_6_7 = [
    "59.   B.   S3 uploads are, by default, done via a single operation, usually via a single PUT  operation. AWS suggests that you can upload objects up to 100 MB before changing to  Multipart Upload.",
    "60.   B.   Using the Multipart Upload is almost entirely a function of the size of the files being  uploaded. AWS recommends using it for any files greater than 100 MB, and 10 GB is  certainly large enough to benefit from Multipart Uploads.",
    "61.   A, C.   Multipart Upload is, as should be the easiest answer, ideal for large objects on  stable networks (A). But it also helps handle less-reliable networks as smaller parts can fail  while others get through, reducing the overall failure rate (C). There is no cost associated  with data ingress (B), and D doesn’t make much sense at all!",
    "62.   A, C.   Presigned URLs are created to allow users without AWS credentials to access  specific resources (option C). And it’s the creator of the URL (option A) that assigns these  permissions, rather than the user (option B). Finally, these credentials are associated with  the URL but are not encrypted into the URL itself.",
    "63.   D.   Presigned URLs are not tied to specific AWS services. They are simply URLs that  can point at anything a normal URL can point at, except that the creator can associate  permissions and a timeout with the URL.",
    "64.   D.   A presigned URL is always configured at creation for a valid Time to Live (often  referred to as TTL). This time can be very short, or quite long.",
    "65.   B, D.   Overwrite PUTs and DELETEs have eventual consistency. PUTs of new objects have  write and then read consistency.",
    "66.   D.   These are all consistent with S3 behavior. Option A could occur as the new object is  being propagated to additional S3 buckets. B and C could occur as a result of eventual  consistency, where a DELETE operation does not immediately appear.",
    "6 7.   C.   All regions have eventual consistency for overwrite PUTs and DELETEs.",
    "68.   A, D.   All S3 storage classes are object-based, while EBS and EFS are block-based.",
    "69.   B.   EBS stands for Elastic Block Storage.",
    "70.   B.   New objects uploaded via PUT are subject to read after write consistency. Overwrite  PUTs use the eventual consistency model.",
    "71.   C.   This is important because it reflects a recent change by AWS. Until 2018, there was a  hard limit on S3 of 100 PUTs per second, but that limit has now been raised to 3500 PUTs  per second.",
    "72.   B.   S3 buckets have names based upon the S3 identifier (s3), the region (us-west-1 in this  case), and the  amazonaws.com  domain. Then, the bucket name appears  after  the domain.  That results in B,  https://s3-us-west-1.amazonaws.com/prototypeBucket32 . Option  A has an incorrect region, and both C and D have the bucket name in the domain, which  is incorrect."
];

test( 'extractQuestionDataFromText', () => {
    const trimmedText = "Review	Questions 1 . In what ways does Amazon Simple Storage Service (Amazon S3) object storage differ from block and file storage? (Choose 2 answers) A . Amazon S3 stores data in fixed size blocks. B . Objects are identified by a numbered address. C . Objects can be any size. D . Objects contain both data and metadata. E . Objects are stored in buckets.";
    const expectedQuestion = "In what ways does Amazon Simple Storage Service (Amazon S3) object storage differ from block and file storage? (Choose 2 answers)";
    const expectedChoices = ["Amazon S3 stores data in fixed size blocks."];
    const qExtractor = new QuestionDataExtractor();
    const questionAndChoices = qExtractor.extractQuestion( trimmedText );
    expect( questionAndChoices[0] ).toEqual( expectedQuestion );
    expect( questionAndChoices[1][0] ).toEqual( expectedChoices[0] );
});

test( 'convert a problematic sybex question', () => {
    // The reason this is a "problematic" question is that it has the text "..excess of 5GB."
    // The "B." at the end of that fragment was being mistaken as the "B." choice for answers
    const problematicSybexQuestionText = 
    "3.   You have a group of web designers who frequently upload large zip files of images to S3,  often in excess of 5 GB. Recently, team members have reported that they are receiving the  error “Your proposed upload exceeds the maximum allowed object size.” What action  should you take to resolve the upload problems? " + 
    "A.   Increase the maximum allowed object size in the target S3 bucket used by the web  designers. " + 
    "B.   Ensure that your web designers are using applications or clients that take advantage  of the Multipart Upload API for all uploaded objects. " + 
    "C.   Contact AWS and submit a ticket to have your default S3 bucket size raised; ensure  that this is also applied to the target bucket for your web designers’ uploads. " + 
    "D.   Log in to the AWS console, select the S3 service, and locate your bucket. Edit the  bucket properties and increase the maximum object size to 50 GB.      ";

    const qExtractor = new QuestionDataExtractor();
    const questionAndChoices = qExtractor.extractQuestion( problematicSybexQuestionText );
    expect( questionAndChoices[0] ).toEqual( "You have a group of web designers who frequently upload large zip files of images to S3,  often in excess of 5 GB. Recently, team members have reported that they are receiving the  error “Your proposed upload exceeds the maximum allowed object size.” What action  should you take to resolve the upload problems?" );
    expect( questionAndChoices[1][0] ).toEqual( "Increase the maximum allowed object size in the target S3 bucket used by the web  designers." );
    expect( questionAndChoices[1][1] ).toEqual( "Ensure that your web designers are using applications or clients that take advantage  of the Multipart Upload API for all uploaded objects." );
});

test( 'extractAnswers single page', () => {
    const ansExtractor = new AnswerDataExtractor();
    const answers = ansExtractor.extractAnswers( [ SYBEX_ANSWERS_1ST_PAGE ] );
    expect( answers ).toEqual(
        [ [1, 'B'], [2, 'B'], [3, 'B'], [4, [ 'C', 'D' ]], 
        [5, 'C'], [6, 'A'], [7, 'C'], [8, 'A'], [9, 'B'] ]);
});

test( 'extractAnswers second page', () => {
    const ansExtractor = new AnswerDataExtractor();
    const answers = ansExtractor.extractAnswers( [ SYBEX_ANSWERS_2ND_PAGE ], 10 );
    expect( answers ).toEqual(
        [ [10, [ 'A', 'C' ]], [11, [ 'A', 'D' ]], [12, 'D'], [13, 'D'], 
        [14, [ 'A', 'D' ]], [15, [ 'A', 'D' ]], [16, 'D'], [17, 'D'], [18, 'B'] ]);
});

test( 'extractAnswers for 6 7', () => {
    const ansExtractor = new AnswerDataExtractor();
    const answers = ansExtractor.extractAnswers( [ANSWERS_PAGE_FOR_6_7], 59 );
    expect( answers ).toEqual( 
        [ [59, 'B'], [60, 'B'], [61, [ 'A', 'C' ]], [62, [ 'A', 'C' ]], 
        [63, 'D'], [64, 'D'], [65, [ 'B', 'D' ]], [66, 'D'], [67, 'C'], 
        [68, [ 'A', 'D' ]], [69, 'B'], [70, 'B'], [71, 'C'], [72, 'B'] ] );
});

// In this one, answers for previous chapter end with 240-244 and next chapter answers start with 1-4
// So the code would mistakenly pick the 241-244 answers as the 1-4 answers for the next chapter
test( 'extractAnswers for sybex answers page with overlapping chapters', () => {
    const ansExtractor = new AnswerDataExtractor();
    const answers = ansExtractor.extractAnswers( [SYBEX_ANSWER_PAGE_OVERLAPPING_TWO_CHAPTERS], 1 );
    expect( answers.length ).toBe( 4 );
    expect( answers ).toEqual( [ [ 1, [ 'A', 'B' ] ], [ 2, [ 'C', 'D' ] ], [ 3, 'D' ], [ 4, 'C' ] ] );
});

test( 'splitStringsFromFullText for answer strings', () => {
    const actual = StringUtils.splitStringsFromFullText( ANSWERS_PAGE_FOR_6_7,  '\\.[\\s]+[A-E]', 59 );
    expect( actual ).toEqual( INDIVIDUAL_ANS_STRINGS_FOR_6_7 );
});

test( 'tabsToSingleWhitespace', () => {
    const text = "Review	Questions 1 .	 In	what	ways	does	Amazon	Simple	Storage	Service	(Amazon	S3)	object	storage	differ from	block	and	file	storage?	(Choose	2	answers) ";
    const trimmedText = "Review Questions 1 .  In what ways does Amazon Simple Storage Service (Amazon S3) object storage differ from block and file storage? (Choose 2 answers)";
    expect( StringUtils.tabsToSingleWhitespace( [ text ]) ).toEqual( trimmedText );
});

test( 'nextChar', () => {
    // only one index arg should return 'a'+index char
    expect( StringUtils.nextChar('a', 1) ).toEqual( 'b' );
    var currChoice = 'A';
    expect( StringUtils.nextChar(currChoice, 1) ).toEqual( 'B' );
});

const SYBEX_ANSWERS_1ST_PAGE = 
'182   Appendix   ■   Answers to Review Questions Domain 1: Design Resilient Architectures      ' +
'1.   B.   This is a common question on AWS exams, and relates to your understanding of the  various S3 classes. S3 and S3-IA have the same durability, but the availability of S3 is one  9 greater than S3-IA. S3 has 99.99 availability, while S3-IA has 99.9 availability. Glacier  has much greater first-byte latency than S3, so both C and D are false.      ' +
'2.   B.   Anytime the primary consideration is storage with a local data presence—where  data must be stored or seen to be stored locally—a storage gateway gives you the best  option. This reduces the choices to B and D. B will store the files in S3 and provide local  cached copies, while D will store the files locally and push them to S3 as a backup. Since  management is concerned about storage in the cloud of primary files, B is the best choice;  local files are the primary source of data, while still allowing the company to experiment  with cloud storage without “risking” its data being stored primarily in the cloud.      ' +
'3.   B.   Many of these answers are nonsensical in terms of what AWS allows. The limits on size  related to S3 are for objects; an individual object can be as large as 5 TB. Both A and C,  then, are not useful (or possible). D proposes to increase the maximum object size to 50  GB, but the maximum object size is already 5 TB. Option B is correct; AWS recommends  using Multipart Upload for all objects larger than 100 MB.      ' +
'4.   C, D.   PUTs of new objects have a read after write consistency. DELETEs and overwrite  PUTs have eventual consistency across S3.      ' +
'5.   C.   First, note that “on standard class S3” is a red herring, and irrelevant to the question.  Second, objects on S3 can be 0 bytes. This is equivalent to using  touch  on a file and then  uploading that 0-byte file to S3.      ' +
'6.   A.   This is a matter of carefully looking at each URL. Bucket names—when not used as  a website—always come after the fully qualified domain name (FQDN); in other words,  after the forward slash. That eliminates C. Additionally, the region always comes earlier  in the FQDN than amazonaws.com, eliminating D. This leaves A and B. Of the two, A  correctly has the complete region, us-east-2.       ' +
'7.   C.   This is another question that is tricky unless you work through each part of the URL,  piece by piece. The first clue is that this is a website hosted on S3, as opposed to directly  accessing an S3 bucket. Where website hosting is concerned, the bucket name is  part of  the  FQDN; where direct bucket access is concerned, the bucket name comes  after  the FQDN.  This is an essential distinction. This means that A and B are invalid. Then, you need to  recall that the s3-website portion of the FQDN is always connected to the region; in other  words, it is not a subdomain. The only option where this is the case is C.      ' +
'8.   A.   This is another case of rote memorization. S3 and S3-IA have the same durability;  however, the availability of S3 is higher (99.99 vs. the 99.9 of S3-IA). Both Glacier and  S3-IA have the same durability of standard S3, so both C and D are false.      ' +
'9.   B.   This is an important distinction when understanding S3 classes. Standard S3, S3-IA,  and S3 One Zone-IA all are equally durable, although in One Zone-IA, data will be lost if ';

const SYBEX_ANSWERS_2ND_PAGE = 
'Domain 1: Design Resilient Architectures   183 ' + 
'the availability zone is destroyed. Each class has different availability, though: S3 is 99.99,  S3-IA is 99.9, and S3 One Zone-IA is 99.5. Therefore, it is false that all have the same  availability (B).    ' + 
'10.   A, C.   The wording of this question is critical. S3 buckets are created within a region,  but the AWS console and your account will show you  all  S3 buckets at all times. While a  bucket is created in a specific region, names of buckets are also global. IAM permissions  are also global and affect all regions. RDS and EC2 instances are region specific, and only  appear in the regions in which they were created in the AWS console.     ' + 
'11.   A, D.   EBS volumes are block-based storage, meaning that A is correct and B is incorrect.  That leaves C and D. The default EBS volume is SSD, so C is false. However, EBS volumes  can be in a variety of types, including magnetic and SSD options, so D is true.    ' + 
'12.   D.   AMIs are not cross-region, regardless of account or security group. This makes B  and C invalid. A is a valid choice but will not preserve any of the permissions or roles  that allow the instance to connect to S3. Therefore, D is the correct option: manual  configuration of the AMI  after  it has been copied is required for correct operation.    ' + 
'13.   D.   This is a bit of a trick question if you’re not careful. While S3 allows for 0-byte objects,  and charges as such, S3-IA charges all objects as if they are  at least  128 KB in size. So  while you can store a smaller object in S3-IA, it will be considered 128 KB for pricing and  charging purposes.    ' + 
'14.   A, D.   A Multi-AZ setup is the easiest solution, and the most common. Turning on read  replicas (option B) is not a guarantee, as read replicas are not automatically installed in  different AZs or regions. However, with option D, a cross-region replica configuration  will ensure multiple regions are used. A storage gateway (option C) is backed by S3, not  RDS.    ' + 
'15.   A, D.   Launch configurations are concerned primarily with creating new instances while  staying abstract from the details of what is on those instances. So the AMI and IAM role  for an instance is a general configuration, applies to all created instances, and is correct (A  and D). The polling time for latency isn’t connected to launching new instances (although  it might be a trigger configured elsewhere). Each instance is associated with a different  EBS volume, so selecting an EBS volume for multiple instances doesn’t actually make  sense.    ' + 
'16.   D.   Launch configurations are where details are specified for creating (launching) new  instances (option D). Security groups have to do more with what traffic is allowed into  and out of the launched instances. The remaining two options—A and C—don’t make  sense in this context.     ' + 
'17.   D.   By default, EBS root volumes are terminated when the associated instance is  terminated. However, this is only the default value; therefore A is not correct. Option B  is not directly addressing the question; the EBS volume would still be deleted even if you  take a snapshot. Option C is not relevant, but option D is: You can use the AWS CLI (or  the console) to set the root volume to persist after instance termination.    ' + 
'18.   B.   EBS volumes are backed up to S3 incrementally.';

const SYBEX_QUESTIONS_1ST_PAGE = 
    "2   Chapter 1   ■   Domain 1: Design Resilient Architectures  Review Questions      " +
    "1.   Which of the following statements regarding S3 storage classes is true? " + 
    "A.   The availability of S3 and S3-IA is the same. " + 
    "B.   The durability of S3 and S3-IA is the same. " +
    "C.   The latency of S3 and Glacier is the same. " +
    "D.   The latency of S3 is greater than that of Glacier.      " + 
    "2.   A small business specializing in video processing wants to prototype cloud storage in  order to lower its costs. However, management is wary of storing its client files in the  cloud rather than on premises. They are focused on cost savings and experimenting with  the cloud at this time. What is the best solution for their prototype? " +
    "A.   Install a VPN, set up an S3 bucket for their files created within the last month, and  set up an additional S3-IA bucket for older files. Create a lifecycle policy in S3 to  move files older than 30 days into the S3-IA bucket nightly. " + 
    "B.   Install an AWS storage gateway using stored volumes. " + 
    "C.   Set up a Direct Connect and back all local hard drives up to S3 over the Direct   Connect nightly. " + 
    "D.   Install an AWS storage gateway using cached volumes.      " + 
    "3.   You have a group of web designers who frequently upload large zip files of images to S3,  often in excess of 5 GB. Recently, team members have reported that they are receiving the  error “Your proposed upload exceeds the maximum allowed object size.” What action  should you take to resolve the upload problems? " + 
    "A.   Increase the maximum allowed object size in the target S3 bucket used by the web  designers. " + 
    "B.   Ensure that your web designers are using applications or clients that take advantage  of the Multipart Upload API for all uploaded objects. " + 
    "C.   Contact AWS and submit a ticket to have your default S3 bucket size raised; ensure  that this is also applied to the target bucket for your web designers’ uploads. " + 
    "D.   Log in to the AWS console, select the S3 service, and locate your bucket. Edit the  bucket properties and increase the maximum object size to 50 GB.      " + 
    "4.   For which of the following HTTP methods does S3 have eventual consistency? (Choose  two.) " + 
    "A.   PUTs of new objects " + 
    "B.      UPDATEs " + 
    "C.      DELETEs " + 
    "D.   PUTs that overwrite existing objects";

const EXPECTED_QUIZ_JSON_SYBEX_WITH_ANSWERS = 
    "const myQuestions = [\n" +
        "// Q1\n" +
        "{\n" +
        "  question: 'Which of the following statements regarding S3 storage classes is true?',\n" +
        "  choices: {\n" +
        "    A: 'The availability of S3 and S3-IA is the same.',\n" +
        "    B: 'The durability of S3 and S3-IA is the same.',\n" +
        "    C: 'The latency of S3 and Glacier is the same.',\n" +
        "    D: 'The latency of S3 is greater than that of Glacier.'\n" +
        "  },\n" +
        "  answer: 'B'\n" +
        "},\n" +
        "// Q2\n" +
        "{\n" +
        "  question: 'A small business specializing in video processing wants to prototype cloud storage in  order to lower its costs. However, management is wary of storing its client files in the  cloud rather than on premises. They are focused on cost savings and experimenting with  the cloud at this time. What is the best solution for their prototype?',\n" +
        "  choices: {\n" +
        "    A: 'Install a VPN, set up an S3 bucket for their files created within the last month, and  set up an additional S3-IA bucket for older files. Create a lifecycle policy in S3 to  move files older than 30 days into the S3-IA bucket nightly.',\n" +
        "    B: 'Install an AWS storage gateway using stored volumes.',\n" +
        "    C: 'Set up a Direct Connect and back all local hard drives up to S3 over the Direct   Connect nightly.',\n" +
        "    D: 'Install an AWS storage gateway using cached volumes.'\n" +
        "  },\n" +
        "  answer: 'B'\n" +
        "},\n" +
        "// Q3\n" +
        "{\n" +
        "  question: 'You have a group of web designers who frequently upload large zip files of images to S3,  often in excess of 5 GB. Recently, team members have reported that they are receiving the  error “Your proposed upload exceeds the maximum allowed object size.” What action  should you take to resolve the upload problems?',\n" +
        "  choices: {\n" +
        "    A: 'Increase the maximum allowed object size in the target S3 bucket used by the web  designers.',\n" +
        "    B: 'Ensure that your web designers are using applications or clients that take advantage  of the Multipart Upload API for all uploaded objects.',\n" +
        "    C: 'Contact AWS and submit a ticket to have your default S3 bucket size raised; ensure  that this is also applied to the target bucket for your web designers’ uploads.',\n" +
        "    D: 'Log in to the AWS console, select the S3 service, and locate your bucket. Edit the  bucket properties and increase the maximum object size to 50 GB.'\n" +
        "  },\n" +
        "  answer: 'B'\n" +
        "},\n" +
        "// Q4\n" +
        "{\n" +
        "  question: 'For which of the following HTTP methods does S3 have eventual consistency? (Choose  two.)',\n" +
        "  choices: {\n" +
        "    A: 'PUTs of new objects',\n" +
        "    B: 'UPDATEs',\n" +
        "    C: 'DELETEs',\n" +
        "    D: 'PUTs that overwrite existing objects'\n" +
        "  },\n" +
        "  answer: [ 'C', 'D' ]\n" +
        "}];"

const EXPECTED_QUIZ_JSON_SYBEX_NO_ANSWERS = 
    "const myQuestions = [\n" +
        "// Q1\n" +
        "{\n" +
        "  question: 'Which of the following statements regarding S3 storage classes is true?',\n" +
        "  choices: {\n" +
        "    A: 'The availability of S3 and S3-IA is the same.',\n" +
        "    B: 'The durability of S3 and S3-IA is the same.',\n" +
        "    C: 'The latency of S3 and Glacier is the same.',\n" +
        "    D: 'The latency of S3 is greater than that of Glacier.'\n" +
        "  },\n" +
        "  answer: ''\n" +
        "},\n" +
        "// Q2\n" +
        "{\n" +
        "  question: 'A small business specializing in video processing wants to prototype cloud storage in  order to lower its costs. However, management is wary of storing its client files in the  cloud rather than on premises. They are focused on cost savings and experimenting with  the cloud at this time. What is the best solution for their prototype?',\n" +
        "  choices: {\n" +
        "    A: 'Install a VPN, set up an S3 bucket for their files created within the last month, and  set up an additional S3-IA bucket for older files. Create a lifecycle policy in S3 to  move files older than 30 days into the S3-IA bucket nightly.',\n" +
        "    B: 'Install an AWS storage gateway using stored volumes.',\n" +
        "    C: 'Set up a Direct Connect and back all local hard drives up to S3 over the Direct   Connect nightly.',\n" +
        "    D: 'Install an AWS storage gateway using cached volumes.'\n" +
        "  },\n" +
        "  answer: ''\n" +
        "},\n" +
        "// Q3\n" +
        "{\n" +
        "  question: 'You have a group of web designers who frequently upload large zip files of images to S3,  often in excess of 5 GB. Recently, team members have reported that they are receiving the  error “Your proposed upload exceeds the maximum allowed object size.” What action  should you take to resolve the upload problems?',\n" +
        "  choices: {\n" +
        "    A: 'Increase the maximum allowed object size in the target S3 bucket used by the web  designers.',\n" +
        "    B: 'Ensure that your web designers are using applications or clients that take advantage  of the Multipart Upload API for all uploaded objects.',\n" +
        "    C: 'Contact AWS and submit a ticket to have your default S3 bucket size raised; ensure  that this is also applied to the target bucket for your web designers’ uploads.',\n" +
        "    D: 'Log in to the AWS console, select the S3 service, and locate your bucket. Edit the  bucket properties and increase the maximum object size to 50 GB.'\n" +
        "  },\n" +
        "  answer: ''\n" +
        "},\n" +
        "// Q4\n" +
        "{\n" +
        "  question: 'For which of the following HTTP methods does S3 have eventual consistency? (Choose  two.)',\n" +
        "  choices: {\n" +
        "    A: 'PUTs of new objects',\n" +
        "    B: 'UPDATEs',\n" +
        "    C: 'DELETEs',\n" +
        "    D: 'PUTs that overwrite existing objects'\n" +
        "  },\n" +
        "  answer: ''\n" +
        "}];"

const EXPECTED_QUIZ_JSON_INCOMPLETE_5TH_Q_NO_ANSWERS = 
    "const myQuestions = [\n" +
        "// Q1\n" +
        "{\n" +
        "  question: 'In what ways does Amazon Simple Storage Service (Amazon S3) object storage differ from block and file storage? (Choose 2 answers)',\n" +
        "  choices: {\n" +
        "    A: 'Amazon S3 stores data in fixed size blocks.',\n" +
        "    B: 'Objects are identified by a numbered address.',\n" +
        "    C: 'Objects can be any size.',\n" +
        "    D: 'Objects contain both data and metadata.',\n" +
        "    E: 'Objects are stored in buckets.'\n" +
        "  },\n" +
        "  answer: ''\n" +
        "},\n" +
        "// Q2\n" +
        "{\n" +
        "  question: 'Which of the following are not appropriates use cases for Amazon Simple Storage Service (Amazon S3)? (Choose 2 answers)',\n" +
        "  choices: {\n" +
        "    A: 'Storing web content',\n" +
        "    B: 'Storing a file system mounted to an Amazon Elastic Compute Cloud (Amazon EC2) instance',\n" +
        "    C: 'Storing backups for a relational database',\n" +
        "    D: 'Primary storage for a database',\n" +
        "    E: 'Storing logs for analytics'\n" +
        "  },\n" +
        "  answer: ''\n" +
        "},\n" +
        "// Q3\n" +
        "{\n" +
        "  question: 'What are some of the key characteristics of Amazon Simple Storage Service (Amazon S3)? (Choose 3 answers)',\n" +
        "  choices: {\n" +
        "    A: 'All objects have a URL.',\n" +
        "    B: 'Amazon S3 can store unlimited amounts of data.',\n" +
        "    C: 'Objects are world-readable by default.',\n" +
        "    D: 'Amazon S3 uses a REST (Representational State Transfer) Application Program Interface (API).',\n" +
        "    E: 'You must pre-allocate the storage in a bucket.'\n" +
        "  },\n" +
        "  answer: ''\n" +
        "},\n" +
        "// Q4\n" +
        "{\n" +
        "  question: 'Which features can be used to restrict access to Amazon Simple Storage Service (Amazon S3) data? (Choose 3 answers)',\n" +
        "  choices: {\n" +
        "    A: 'Enable static website hosting on the bucket.',\n" +
        "    B: 'Create a pre-signed URL for an object.',\n" +
        "    C: 'Use an Amazon S3 Access Control List (ACL) on a bucket or object.',\n" +
        "    D: 'Use a lifecycle policy.',\n" +
        "    E: 'Use an Amazon S3 bucket policy.'\n" +
        "  },\n" +
        "  answer: ''\n" +
        "},\n" +
        "// Q5\n" +
        "{\n" +
        "  question: 'Your application stores critical data in Amazon Simple Storage Service (Amazon S3), which must be protected against inadvertent or intentional deletion. How can this data be protected? (Choose 2 answers)',\n" +
        "  choices: {\n" +
        "  },\n" +
        "  answer: ''\n" +
        "}];"

const extractedTextLines = [
    "Review	Questions 1 .	 In	what	ways	does	Amazon	Simple	Storage	Service	(Amazon	S3)	object	storage	differ from	block	and	file	storage?	(Choose	2	answers) A .	 Amazon	S3	stores	data	in	fixed	size	blocks. B .	 Objects	are	identified	by	a	numbered	address. C .	 Objects	can	be	any	size. D .	 Objects	contain	both	data	and	metadata. E .	 Objects	are	stored	in	buckets. 2 .	 Which	of	the	following	are	not	appropriates	use	cases	for	Amazon	Simple	Storage	Service (Amazon	S3)?	(Choose	2	answers) A .	 Storing	web	content B .	 Storing	a	file	system	mounted	to	an	Amazon	Elastic	Compute	Cloud	(Amazon	EC2) instance C .	 Storing	backups	for	a	relational	database D .	 Primary	storage	for	a	database E .	 Storing	logs	for	analytics 3 .	 What	are	some	of	the	key	characteristics	of	Amazon	Simple	Storage	Service	(Amazon S3)?	(Choose	3	answers) A .	 All	objects	have	a	URL. B .	 Amazon	S3	can	store	unlimited	amounts	of	data. C .	 Objects	are	world-readable	by	default. D .	 Amazon	S3	uses	a	REST	(Representational	State	Transfer)	Application	Program Interface	(API). E .	 You	must	pre-allocate	the	storage	in	a	bucket. 4 .	 Which	features	can	be	used	to	restrict	access	to	Amazon	Simple	Storage	Service	(Amazon S3)	data?	(Choose	3	answers) A .	 Enable	static	website	hosting	on	the	bucket. B .	 Create	a	pre-signed	URL	for	an	object. C .	 Use	an	Amazon	S3	Access	Control	List	(ACL)	on	a	bucket	or	object. D .	 Use	a	lifecycle	policy. E .	 Use	an	Amazon	S3	bucket	policy. 5 .	 Your	application	stores	critical	data	in	Amazon	Simple	Storage	Service	(Amazon	S3), which	must	be	protected	against	inadvertent	or	intentional	deletion.	How	can	this	data be	protected?	(Choose	2	answers) ",
    "A .	 Use	cross-region	replication	to	copy	data	to	another	bucket	automatically. B .	 Set	a	vault	lock. C .	 Enable	versioning	on	the	bucket. D .	 Use	a	lifecycle	policy	to	migrate	data	to	Amazon	Glacier. E .	 Enable	MFA	Delete	on	the	bucket. 6 .	 Your	company	stores	documents	in	Amazon	Simple	Storage	Service	(Amazon	S3),	but	it wants	to	minimize	cost.	Most	documents	are	used	actively	for	only	about	a	month,	then much	less	frequently.	However,	all	data	needs	to	be	available	within	minutes	when requested.	How	can	you	meet	these	requirements? A .	 Migrate	the	data	to	Amazon	S3	Reduced	Redundancy	Storage	(RRS)	after	30	days. B .	 Migrate	the	data	to	Amazon	Glacier	after	30	days. C .	 Migrate	the	data	to	Amazon	S3	Standard	–	Infrequent	Access	(IA)	after	30	days. D .	 Turn	on	versioning,	then	migrate	the	older	version	to	Amazon	Glacier. 7 .	 How	is	data	stored	in	Amazon	Simple	Storage	Service	(Amazon	S3)	for	high	durability? A .	 Data	is	automatically	replicated	to	other	regions. B .	 Data	is	automatically	replicated	within	a	region. C .	 Data	is	replicated	only	if	versioning	is	enabled	on	the	bucket. D .	 Data	is	automatically	backed	up	on	tape	and	restored	if	needed. 8 .	 Based	on	the	following	Amazon	Simple	Storage	Service	(Amazon	S3)	URL,	which	one	of the	following	statements	is	correct? https://bucket1.abc.com.s3.amazonaws.com/folderx/myfile.doc A .	 The	object	“myfile.doc”	is	stored	in	the	folder	“folderx”	in	the	bucket “bucket1.abc.com.” B .	 The	object	“myfile.doc”	is	stored	in	the	bucket	“bucket1.abc.com.” C .	 The	object	“folderx/myfile.doc”	is	stored	in	the	bucket	“bucket1.abc.com.” D .	 The	object	“myfile.doc”	is	stored	in	the	bucket	“bucket1.” 9 .	 To	have	a	record	of	who	accessed	your	Amazon	Simple	Storage	Service	(Amazon	S3)	data and	from	where,	you	should	do	what? A .	 Enable	versioning	on	the	bucket. B .	 Enable	website	hosting	on	the	bucket. C .	 Enable	server	access	logs	on	the	bucket. D .	 Create	an	AWS	Identity	and	Access	Management	(IAM)	bucket	policy. E .	 Enable	Amazon	CloudWatch	logs. 10 .	 What	are	some	reasons	to	enable	cross-region	replication	on	an	Amazon	Simple	Storage Service	(Amazon	S3)	bucket?	(Choose	2	answers) ",
    "A .	 You	want	a	backup	of	your	data	in	case	of	accidental	deletion. B .	 You	have	a	set	of	users	or	customers	who	can	access	the	second	bucket	with	lower latency. C .	 For	compliance	reasons,	you	need	to	store	data	in	a	location	at	least	300	miles	away from	the	first	region. D .	 Your	data	needs	at	least	five	nines	of	durability. 11 .	 Your	company	requires	that	all	data	sent	to	external	storage	be	encrypted	before	being sent.	Which	Amazon	Simple	Storage	Service	(Amazon	S3)	encryption	solution	will	meet this	requirement? A .	 Server-Side	Encryption	(SSE)	with	AWS-managed	keys	(SSE-S3) B .	 SSE	with	customer-provided	keys	(SSE-C) C .	 Client-side	encryption	with	customer-managed	keys D .	 Server-side	encryption	with	AWS	Key	Management	Service	(AWS	KMS)	keys	(SSE- KMS) 12 .	 You	have	a	popular	web	application	that	accesses	data	stored	in	an	Amazon	Simple Storage	Service	(Amazon	S3)	bucket.	You	expect	the	access	to	be	very	read-intensive, with	expected	request	rates	of	up	to	500	GETs	per	second	from	many	clients.	How	can you	increase	the	performance	and	scalability	of	Amazon	S3	in	this	case? A .	 Turn	on	cross-region	replication	to	ensure	that	data	is	served	from	multiple locations. B .	 Ensure	randomness	in	the	namespace	by	including	a	hash	prefix	to	key	names. C .	 Turn	on	server	access	logging. D .	 Ensure	that	key	names	are	sequential	to	enable	pre-fetch. 13 .	 What	is	needed	before	you	can	enable	cross-region	replication	on	an	Amazon	Simple Storage	Service	(Amazon	S3)	bucket?	(Choose	2	answers) A .	 Enable	versioning	on	the	bucket. B .	 Enable	a	lifecycle	rule	to	migrate	data	to	the	second	region. C .	 Enable	static	website	hosting. D .	 Create	an	AWS	Identity	and	Access	Management	(IAM)	policy	to	allow	Amazon	S3 to	replicate	objects	on	your	behalf. 14 .	 Your	company	has	100TB	of	financial	records	that	need	to	be	stored	for	seven	years	by law.	Experience	has	shown	that	any	record	more	than	one-year	old	is	unlikely	to	be accessed.	Which	of	the	following	storage	plans	meets	these	needs	in	the	most	cost efficient	manner? A .	 Store	the	data	on	Amazon	Elastic	Block	Store	(Amazon	EBS)	volumes	attached	to t2.micro	instances. B .	 Store	the	data	on	Amazon	Simple	Storage	Service	(Amazon	S3)	with	lifecycle	policies that	change	the	storage	class	to	Amazon	Glacier	after	one	year	and	delete	the	object ",
    "after	seven	years. C .	 Store	the	data	in	Amazon	DynamoDB	and	run	daily	script	to	delete	data	older	than seven	years. D .	 Store	the	data	in	Amazon	Elastic	MapReduce	(Amazon	EMR). 15 .	 Amazon	Simple	Storage	Service	(S3)	bucket	policies	can	restrict	access	to	an	Amazon	S3 bucket	and	objects	by	which	of	the	following?	(Choose	3	answers) A .	 Company	name B .	 IP	address	range C .	 AWS	account D .	 Country	of	origin E .	 Objects	with	a	specific	prefix 16 .	 Amazon	Simple	Storage	Service	(Amazon	S3)	is	an	eventually	consistent	storage	system. For	what	kinds	of	operations	is	it	possible	to	get	stale	data	as	a	result	of	eventual consistency?	(Choose	2	answers) A .	 GET	after	PUT	of	a	new	object B .	 GET	or	LIST	after	a	DELETE C .	 GET	after	overwrite	PUT	(PUT	to	an	existing	key) D .	 DELETE	after	PUT	of	new	object 17 .	 What	must	be	done	to	host	a	static	website	in	an	Amazon	Simple	Storage	Service (Amazon	S3)	bucket?	(Choose	3	answers) A .	 Configure	the	bucket	for	static	hosting	and	specify	an	index	and	error	document. B .	 Create	a	bucket	with	the	same	name	as	the	website. C .	 Enable	File	Transfer	Protocol	(FTP)	on	the	bucket. D .	 Make	the	objects	in	the	bucket	world-readable. E .	 Enable	HTTP	on	the	bucket. 18 .	 You	have	valuable	media	files	hosted	on	AWS	and	want	them	to	be	served	only	to authenticated	users	of	your	web	application.	You	are	concerned	that	your	content	could be	stolen	and	distributed	for	free.	How	can	you	protect	your	content? A .	 Use	static	web	hosting. B .	 Generate	pre-signed	URLs	for	content	in	the	web	application. C .	 Use	AWS	Identity	and	Access	Management	(IAM)	policies	to	restrict	access. D .	 Use	logging	to	track	your	content. 19 .	 Amazon	Glacier	is	well-suited	to	data	that	is	which	of	the	following?	(Choose	2	answers) A .	 Is	infrequently	or	rarely	accessed B .	 Must	be	immediately	available	when	needed ",
    "C .	 Is	available	after	a	three-	to	five-hour	restore	period D .	 Is	frequently	erased	within	30	days 20 .	 Which	statements	about	Amazon	Glacier	are	true?	(Choose	3	answers) A .	 Amazon	Glacier	stores	data	in	objects	that	live	in	archives. B .	 Amazon	Glacier	archives	are	identified	by	user-specified	key	names. C .	 Amazon	Glacier	archives	take	three	to	five	hours	to	restore. D .	 Amazon	Glacier	vaults	can	be	locked. E .	 Amazon	Glacier	can	be	used	as	a	standalone	service	and	as	an	Amazon	S3	storage class. "
];

const SYBEX_ANSWER_PAGE_OVERLAPPING_TWO_CHAPTERS = 
    "240   Appendix   ■   Answers to Review Questions   " + 
    "241.   C.   AWS is responsible for the security of virtualization infrastructure. All other items  in this list are your responsibility. As a hint on questions like this and related to the  AWS shared responsibility model, AWS is typically responsible for anything with the  word  infrastructure , although there are some exclusions (for example,  application  infrastructure ).   " + 
    "242.   A.   An IAM role is assumed by an EC2 instance when it needs to access other AWS  services, and that role has permissions associated with it. While these permissions are  formally defined in a policy (B), it is the role that is used by the instance for actual service  access.   " + 
    "243.   A, D.   Just as is the case with a compute instance (EC2), a task in a container needs an  IAM role with permissions to access S3 (A), which in turn requires a policy specifying a  permission that lets ECS tasks access S3 (D). Both of these are required to ensure access.  Security groups apply to network traffic and would not affect S3 access, and while a VPC  endpoint could be used (C), it is not required.   " + 
    "244.   C.   By default, newly created S3 buckets are private. They can only be accessed by a user  that has been granted explicit access. Domain 4: Design Cost-Optimized  Architectures      " + 
    "1.   A, B.   When instance cost is the issue, the answers are almost always to consider some  form of lowered instance pricing. AWS provides reserved instances and spot instances and  the spot market for this purpose. Further, paying for reserved instances all up front is the  most cost-effective means of getting reserved instances. Therefore, A and B are correct. C  is problematic, as running a smaller instance for longer is not necessarily any cheaper than  running a large instance for shorter amounts of time. Option D has some validity, but  AWS is almost certainly going to point you back to either reserved instances or the spot  market (A and B).      " + 
    "2.   C, D.   Reserved instances can be paid for in no up-front, partial up-front, and all up-front  models, where all up-front is the least expensive and no up-front is the most expensive.      " + 
    "3.   D.   Reserved instances are locked to the region in which they are created, so D is correct.  You would need to create a new reserved instance in the new region.      " + 
    "4.   C.   This should be an easy correct answer: Spot instances via the spot market are the  potentially least expensive option, given that your compute has flexible timing and needs.";

const expectedQuizJsonForOfficialStudyGuide = "const myQuestions = [\n" +
    "// Q1\n" +
    "{\n" +
    "  question: 'In what ways does Amazon Simple Storage Service (Amazon S3) object storage differ from block and file storage? (Choose 2 answers)',\n" +
    "  choices: {\n" +
    "    A: 'Amazon S3 stores data in fixed size blocks.',\n" +
    "    B: 'Objects are identified by a numbered address.',\n" +
    "    C: 'Objects can be any size.',\n" +
    "    D: 'Objects contain both data and metadata.',\n" +
    "    E: 'Objects are stored in buckets.'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "},\n" +
    "// Q2\n" +
    "{\n" +
    "  question: 'Which of the following are not appropriates use cases for Amazon Simple Storage Service (Amazon S3)? (Choose 2 answers)',\n" +
    "  choices: {\n" +
    "    A: 'Storing web content',\n" +
    "    B: 'Storing a file system mounted to an Amazon Elastic Compute Cloud (Amazon EC2) instance',\n" +
    "    C: 'Storing backups for a relational database',\n" +
    "    D: 'Primary storage for a database',\n" +
    "    E: 'Storing logs for analytics'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "},\n" +
    "// Q3\n" +
    "{\n" +
    "  question: 'What are some of the key characteristics of Amazon Simple Storage Service (Amazon S3)? (Choose 3 answers)',\n" +
    "  choices: {\n" +
    "    A: 'All objects have a URL.',\n" +
    "    B: 'Amazon S3 can store unlimited amounts of data.',\n" +
    "    C: 'Objects are world-readable by default.',\n" +
    "    D: 'Amazon S3 uses a REST (Representational State Transfer) Application Program Interface (API).',\n" +
    "    E: 'You must pre-allocate the storage in a bucket.'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "},\n" +
    "// Q4\n" +
    "{\n" +
    "  question: 'Which features can be used to restrict access to Amazon Simple Storage Service (Amazon S3) data? (Choose 3 answers)',\n" +
    "  choices: {\n" +
    "    A: 'Enable static website hosting on the bucket.',\n" +
    "    B: 'Create a pre-signed URL for an object.',\n" +
    "    C: 'Use an Amazon S3 Access Control List (ACL) on a bucket or object.',\n" +
    "    D: 'Use a lifecycle policy.',\n" +
    "    E: 'Use an Amazon S3 bucket policy.'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "},\n" +
    "// Q5\n" +
    "{\n" +
    "  question: 'Your application stores critical data in Amazon Simple Storage Service (Amazon S3), which must be protected against inadvertent or intentional deletion. How can this data be protected? (Choose 2 answers)',\n" +
    "  choices: {\n" +
    "    A: 'Use cross-region replication to copy data to another bucket automatically.',\n" +
    "    B: 'Set a vault lock.',\n" +
    "    C: 'Enable versioning on the bucket.',\n" +
    "    D: 'Use a lifecycle policy to migrate data to Amazon Glacier.',\n" +
    "    E: 'Enable MFA Delete on the bucket.'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "},\n" +
    "// Q6\n" +
    "{\n" +
    "  question: 'Your company stores documents in Amazon Simple Storage Service (Amazon S3), but it wants to minimize cost. Most documents are used actively for only about a month, then much less frequently. However, all data needs to be available within minutes when requested. How can you meet these requirements?',\n" +
    "  choices: {\n" +
    "    A: 'Migrate the data to Amazon S3 Reduced Redundancy Storage (RRS) after 30 days.',\n" +
    "    B: 'Migrate the data to Amazon Glacier after 30 days.',\n" +
    "    C: 'Migrate the data to Amazon S3 Standard – Infrequent Access (IA) after 30 days.',\n" +
    "    D: 'Turn on versioning, then migrate the older version to Amazon Glacier.'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "},\n" +
    "// Q7\n" +
    "{\n" +
    "  question: 'How is data stored in Amazon Simple Storage Service (Amazon S3) for high durability?',\n" +
    "  choices: {\n" +
    "    A: 'Data is automatically replicated to other regions.',\n" +
    "    B: 'Data is automatically replicated within a region.',\n" +
    "    C: 'Data is replicated only if versioning is enabled on the bucket.',\n" +
    "    D: 'Data is automatically backed up on tape and restored if needed.'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "},\n" +
    "// Q8\n" +
    "{\n" +
    "  question: 'Based on the following Amazon Simple Storage Service (Amazon S3) URL, which one of the following statements is correct? https://bucket1.abc.com.s3.amazonaws.com/folderx/myfile.doc',\n" +
    "  choices: {\n" +
    "    A: 'The object “myfile.doc” is stored in the folder “folderx” in the bucket “bucket1.abc.com.”',\n" +
    "    B: 'The object “myfile.doc” is stored in the bucket “bucket1.abc.com.”',\n" +
    "    C: 'The object “folderx/myfile.doc” is stored in the bucket “bucket1.abc.com.”',\n" +
    "    D: 'The object “myfile.doc” is stored in the bucket “bucket1.”'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "},\n" +
    "// Q9\n" +
    "{\n" +
    "  question: 'To have a record of who accessed your Amazon Simple Storage Service (Amazon S3) data and from where, you should do what?',\n" +
    "  choices: {\n" +
    "    A: 'Enable versioning on the bucket.',\n" +
    "    B: 'Enable website hosting on the bucket.',\n" +
    "    C: 'Enable server access logs on the bucket.',\n" +
    "    D: 'Create an AWS Identity and Access Management (IAM) bucket policy.',\n" +
    "    E: 'Enable Amazon CloudWatch logs.'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "},\n" +
    "// Q10\n" +
    "{\n" +
    "  question: 'What are some reasons to enable cross-region replication on an Amazon Simple Storage Service (Amazon S3) bucket? (Choose 2 answers)',\n" +
    "  choices: {\n" +
    "    A: 'You want a backup of your data in case of accidental deletion.',\n" +
    "    B: 'You have a set of users or customers who can access the second bucket with lower latency.',\n" +
    "    C: 'For compliance reasons, you need to store data in a location at least 300 miles away from the first region.',\n" +
    "    D: 'Your data needs at least five nines of durability.'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "},\n" +
    "// Q11\n" +
    "{\n" +
    "  question: 'Your company requires that all data sent to external storage be encrypted before being sent. Which Amazon Simple Storage Service (Amazon S3) encryption solution will meet this requirement?',\n" +
    "  choices: {\n" +
    "    A: 'Server-Side Encryption (SSE) with AWS-managed keys (SSE-S3)',\n" +
    "    B: 'SSE with customer-provided keys (SSE-C)',\n" +
    "    C: 'Client-side encryption with customer-managed keys',\n" +
    "    D: 'Server-side encryption with AWS Key Management Service (AWS KMS) keys (SSE- KMS)'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "},\n" +
    "// Q12\n" +
    "{\n" +
    "  question: 'You have a popular web application that accesses data stored in an Amazon Simple Storage Service (Amazon S3) bucket. You expect the access to be very read-intensive, with expected request rates of up to 500 GETs per second from many clients. How can you increase the performance and scalability of Amazon S3 in this case?',\n" +
    "  choices: {\n" +
    "    A: 'Turn on cross-region replication to ensure that data is served from multiple locations.',\n" +
    "    B: 'Ensure randomness in the namespace by including a hash prefix to key names.',\n" +
    "    C: 'Turn on server access logging.',\n" +
    "    D: 'Ensure that key names are sequential to enable pre-fetch.'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "},\n" +
    "// Q13\n" +
    "{\n" +
    "  question: 'What is needed before you can enable cross-region replication on an Amazon Simple Storage Service (Amazon S3) bucket? (Choose 2 answers)',\n" +
    "  choices: {\n" +
    "    A: 'Enable versioning on the bucket.',\n" +
    "    B: 'Enable a lifecycle rule to migrate data to the second region.',\n" +
    "    C: 'Enable static website hosting.',\n" +
    "    D: 'Create an AWS Identity and Access Management (IAM) policy to allow Amazon S3 to replicate objects on your behalf.'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "},\n" +
    "// Q14\n" +
    "{\n" +
    "  question: 'Your company has 100TB of financial records that need to be stored for seven years by law. Experience has shown that any record more than one-year old is unlikely to be accessed. Which of the following storage plans meets these needs in the most cost efficient manner?',\n" +
    "  choices: {\n" +
    "    A: 'Store the data on Amazon Elastic Block Store (Amazon EBS) volumes attached to t2.micro instances.',\n" +
    "    B: 'Store the data on Amazon Simple Storage Service (Amazon S3) with lifecycle policies that change the storage class to Amazon Glacier after one year and delete the object after seven years.',\n" +
    "    C: 'Store the data in Amazon DynamoDB and run daily script to delete data older than seven years.',\n" +
    "    D: 'Store the data in Amazon Elastic MapReduce (Amazon EMR).'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "},\n" +
    "// Q15\n" +
    "{\n" +
    "  question: 'Amazon Simple Storage Service (S3) bucket policies can restrict access to an Amazon S3 bucket and objects by which of the following? (Choose 3 answers)',\n" +
    "  choices: {\n" +
    "    A: 'Company name',\n" +
    "    B: 'IP address range',\n" +
    "    C: 'AWS account',\n" +
    "    D: 'Country of origin',\n" +
    "    E: 'Objects with a specific prefix'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "},\n" +
    "// Q16\n" +
    "{\n" +
    "  question: 'Amazon Simple Storage Service (Amazon S3) is an eventually consistent storage system. For what kinds of operations is it possible to get stale data as a result of eventual consistency? (Choose 2 answers)',\n" +
    "  choices: {\n" +
    "    A: 'GET after PUT of a new object',\n" +
    "    B: 'GET or LIST after a DELETE',\n" +
    "    C: 'GET after overwrite PUT (PUT to an existing key)',\n" +
    "    D: 'DELETE after PUT of new object'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "},\n" +
    "// Q17\n" +
    "{\n" +
    "  question: 'What must be done to host a static website in an Amazon Simple Storage Service (Amazon S3) bucket? (Choose 3 answers)',\n" +
    "  choices: {\n" +
    "    A: 'Configure the bucket for static hosting and specify an index and error document.',\n" +
    "    B: 'Create a bucket with the same name as the website.',\n" +
    "    C: 'Enable File Transfer Protocol (FTP) on the bucket.',\n" +
    "    D: 'Make the objects in the bucket world-readable.',\n" +
    "    E: 'Enable HTTP on the bucket.'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "},\n" +
    "// Q18\n" +
    "{\n" +
    "  question: 'You have valuable media files hosted on AWS and want them to be served only to authenticated users of your web application. You are concerned that your content could be stolen and distributed for free. How can you protect your content?',\n" +
    "  choices: {\n" +
    "    A: 'Use static web hosting.',\n" +
    "    B: 'Generate pre-signed URLs for content in the web application.',\n" +
    "    C: 'Use AWS Identity and Access Management (IAM) policies to restrict access.',\n" +
    "    D: 'Use logging to track your content.'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "},\n" +
    "// Q19\n" +
    "{\n" +
    "  question: 'Amazon Glacier is well-suited to data that is which of the following? (Choose 2 answers)',\n" +
    "  choices: {\n" +
    "    A: 'Is infrequently or rarely accessed',\n" +
    "    B: 'Must be immediately available when needed',\n" +
    "    C: 'Is available after a three- to five-hour restore period',\n" +
    "    D: 'Is frequently erased within 30 days'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "},\n" +
    "// Q20\n" +
    "{\n" +
    "  question: 'Which statements about Amazon Glacier are true? (Choose 3 answers)',\n" +
    "  choices: {\n" +
    "    A: 'Amazon Glacier stores data in objects that live in archives.',\n" +
    "    B: 'Amazon Glacier archives are identified by user-specified key names.',\n" +
    "    C: 'Amazon Glacier archives take three to five hours to restore.',\n" +
    "    D: 'Amazon Glacier vaults can be locked.',\n" +
    "    E: 'Amazon Glacier can be used as a standalone service and as an Amazon S3 storage class.'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "}];";

    test( 'extractAnswers for all answer pages text from first chapter', () => {
        const ansExtractor = new AnswerDataExtractor();
        const answerStrArray = ansExtractor.extractAnswers( [SOME_ANSWER_PAGES_FROM_FIRST_CHAPTER] );
        expect( answerStrArray.length ).toEqual( 113 );
    });

    test( 'extractQuestions for another problem page', () => {
        const qExtractor = new QuestionDataExtractor();
        const quizQs = qExtractor.extractQuestions( [ANOTHER_PROBLEM_PAGE_QUESTION_TEXT], 94 );
        expect( quizQs.length ).toBe( 6 );
        expect( quizQs[4].question ).toEqual( "What is a collection of edge locations called?" );
    });

    const ANOTHER_PROBLEM_PAGE_QUESTION_TEXT = 
    "18   Chapter 1   ■   Domain 1: Design Resilient Architectures     94.   Which of the following are typical origin servers for a CloudFront distribution? (Choose  two.) A.   EC2 instances B.   Amazon Glacier archives C.   API Gateway D.   S3 buckets    95.   Which of the following are not origin servers for a CloudFront distribution? (Choose  two.) A.   Docker containers running on ECS B.   MySQL ResultSet C.   S3 buckets D.   Redshift workloads    96.   What is the location where content will be cached in a CloudFront distribution called? A.   Availability zone B.   Edge location C.   Remote location D.   Origin edge    97.   Which of the following are not origin servers for a CloudFront distribution? (Choose  two.) A.   Elastic load balancer B.   Route 53 recordsets C.   SQS subscription endpoint D.   SNS topic retrieval endpoint    98.   What is a collection of edge locations called? A.      Region B.   Availability zone C.      CloudFront D.      Distribution    99.   Rank the total number of regions, availability zones, and edge locations in order from the  least number to the greatest number. A.   Availability zones < regions < edge locations B.   Regions < availability zones < edge locations C.   Edge locations < regions < availability zones D.   Edge locations < availability zones < regions";

    // 112 . instead of 112. problem
    const THE_112_DOT_PROBLEM_SET = 
    "111.   A.   This is a little harder unless you’ve seen the term  virtual tape library (VTL)  before. A tape  volume is in fact a virtual tape library. Fortunately, even if you’ve never heard of a VTL, you  can reason it out based on the other incorrect options: A VPC is a virtual private cloud, a  VPN is a virtual private network, and NetBackup is an application, not a tape volume.   " + 
    "112 .   A.   This is an easy onE: Snowball is the AWS solution for transferring large datasets.   " + 
    "113.   D.   Snowball actually does not support any code. You just transfer your data to the device  and send it to Amazon. Additionally, CloudFormation is not a language; you use YAML  (for example) to write CloudFormation templates.   "; 

    test( 'extractAnswers for 112 .', () => {
        const ansExtractor = new AnswerDataExtractor();
        const answerStrArray = ansExtractor.extractAnswers( [THE_112_DOT_PROBLEM_SET], 111 );
        expect( answerStrArray.length ).toEqual( 3 );
    });

    test( 'extractQuestionStrings for the 99.9% issue', () => {
        const qExtractor = new QuestionDataExtractor();
        const quizQs = qExtractor.extractQuestions( [ SYBEX_PAGES_22_TO_31 ], 39 );
        expect( quizQs.length ).toBe( 61 );
        expect ( quizQs[60].question ).toEqual( SYBEX_PG31_Q99 );
    });

    const SYBEX_PG31_Q99 = "Rank the total number of regions, availability zones, and edge locations in order from the  least number to the greatest number.";

    // This data set causes problems when getting Q# 99, because on Q45, one of the answers is 99.9%
    // and the code assumes that is Q# 99 :)
    const SYBEX_PAGES_22_TO_31 = 
    "Review Questions   9    " + 
    "39.   Which of the following storage gateway options is best for reducing the costs associated  with an off-site disaster recovery solution? A.   File gateway B.   Cached volume gateway C.   Stored volume gateway D.   Tape gateway    " + 
    "40.   Which of the following storage classes is optimized for long-term data storage at the  expense of retrieval time? A.     S3 B.      S3-IA C.   S3 One Zone-IA D.      Glacier    " + 
    "41.   Which of the following need to be considered across all regions in your account? (Choose  two.) A.   Launch configurations B.   IAM users C.   EC2 instances D.   S3 bucket names    " + 
    "42.   What HTTP code would you expect after a successful upload of an object to an S3  bucket? A.   HTTP 200 B.   HTTP 307 C.   HTTP 404 D.   HTTP 501    " + 
    "43.   What is the durability of S3 One Zone-IA? A.      99.0% B.      99.9% C.      99.99% D.      99.999999999%    " + 
    "44.   What is the durability of S3-IA? A.      99.0% B.      99.9% C.      99.99% D.      99.999999999%,10   Chapter 1   ■   Domain 1: Design Resilient Architectures     " + 
    "45.   What is the durability of S3? A.      99.0% B.      99.9% C.      99.99% D.      99.999999999%    " + 
    "46.   What is the availability of S3 One Zone-IA? A.      99.5% B.      99.9% C.      99.99% D.      99.999999999%     " + 
    "47.   What is the availability of S3-IA? A.      99.5% B.      99.9% C.      99.99% D.      99.999999999%    " + 
    "48.   What is the availability of S3? A.      99.5% B.      99.9% C.      99.99% D.      99.999999999%    " + 
    "49.   Which S3 storage class supports SSL for data in transit? A.     S3 B.      S3-IA C.   S3 One Zone-IA D.   All of the above    " + 
    "50.   Which S3 storage class supports encryption for data at rest? A.     S3 B.      S3-IA C.   S3 One Zone-IA D.   All of the above    " + 
    "51.   For which of the following storage classes do you need to specify a region? A.     S3 B.      S3-IA C.   S3 One Zone-IA D.   All of the above,Review Questions   11    " + 
    "52.   For which of the following storage classes do you need to specify an availability zone? A.     S3 B.      S3-IA C.   S3 One Zone-IA D.   None of the above    " + 
    "53.   How does S3 store your objects? A.   As key-value pairs B.   As relational entries. C.   Using a NoSQL interface D.   As blocks in a block storage    " + 
    "54.   In what ways can you access your data stored in S3 buckets? (Choose two.) A.   Through FTP access to the bucket B.   Through SFTP access to the bucket C.   Through a REST-based web service interface D.   Through the AWS console    " + 
    "55.   Which of the following are true about S3 data access when traffic spikes (increases)?  (Choose two.) A.   S3 will scale to handle the load if you have Auto Scaling set up. B.   S3 will scale automatically to ensure your service is not interrupted. C.   Scale spreads evenly across AWS network to minimize the effect of a spike. D.   A few instances are scaled up dramatically to minimize the effect of the spike.    " + 
    "56.   You have been tasked with helping a company migrate its expensive off-premises storage  to AWS. It will still primarily back up files from its on-premises location to a local NAS.  These files then need to be stored off-site (in AWS rather than the original off-site loca- tion). The company is concerned with durability and cost and wants to retain quick access  to its files. What should you recommend? A.   Copying files from the NAS to an S3 standard class bucket B.   Copying files from the NAS to an S3 One Zone-IA class bucket C.   Copying the files from the NAS to EBS volumes with provisioned IOPS D.   Copying the files from the NAS to Amazon Glacier     " + 
    "57.   Which S3 storage class would you recommend if you were building out storage for an  application that you anticipated growing in size exponentially over the next 12 months? A.   Amazon Glacier B.   S3 standard C.      S3-IA D.   There is not enough information to make a good decision.,12   Chapter 1   ■   Domain 1: Design Resilient Architectures     " + 
    "58.   How many S3 buckets can you create per AWS account, by default? A.     25 B.      50 C.      100 D.   There is not a default limit.    " + 
    "59.   How are objects uploaded to S3 by default? A.   In parts B.   In a single operation C.   You must configure this option for each S3 bucket explicitly. D.   Via the REST API    " + 
    "60.   When does AWS suggest you start uploading objects via the Multipart Upload API? A.   When you’re uploading a lot of files at once B.   When you’re uploading files of 10 GB or more C.   When you have multiple applications uploading files to the same S3 bucket D.   When you need the greatest network throughput for uploads    " + 
    "61.   Which of the following are the ways you should consider using Multipart Upload? A.   For uploading large objects over a stable high-bandwidth network to maximize   bandwidth B.   For uploading large objects to reduce the cost of ingress related to those objects C.   For uploading any size files over a spotty network to increase resiliency D.   For uploading files that must be appended to existing files    " + 
    "62.   How is a presigned URL different from a normal URL? (Choose two.) A.   A presigned URL has permissions associated with certain objects provided by the   creator of the URL. B.   A presigned URL has permissions associated with certain objects provided by the  user of the URL. C.   A presigned URL allows access to private S3 buckets without requiring AWS   credentials. D.   A presigned URL includes encrypted credentials as part of the URL.    " + 
    "63.   Which of the following can be put behind a presigned URL? A.   An S3 object store B.   An EC2 instance with a web interface C.   An AWS CloudFront distribution D.   All of the above,Review Questions   13    " + 
    "64.   How long is a presigned URL valid? A.   60 seconds B.   60 minutes C.   24 hours D.   As long as it is configured to last    " + 
    "65.   Which of the following HTTP methods with regard to S3 have eventual consistency?  (Choose two.) A.      UPDATEs B.      DELETEs C.   PUTs of new objects D.   Over write PU Ts    " + 
    "66.   Which of the following behaviors is consistent with how S3 handles object operations on a  bucket? A.   A process writes a new object to Amazon S3 and immediately lists keys within its  bucket. The new object does not appear in the list of keys. B.   A process deletes an object, attempts to immediately read the deleted object, and S3  still returns the deleted data. C.   A process deletes an object and immediately lists the keys in the bucket. S3 returns a  list with the deleted object in the list. D.   All of the above    " + 
    "6 7.   In which regions does Amazon S3 offer eventual consistency for overwrite PUTs and  DELETEs? A.   All US regions B.   All US and EU regions C.   All regions D.   No regions, eventual consistency is not the model for overwrite PUTs.    " + 
    "68.   Which of the following storage media are object based? (Choose two.) A.     S3-IA B.      EBS C.      EFS D.   S3 standard    " + 
    "69.   EBS stands for what? A.   Elastic Based Storage B.   Elastic Block Storage C.   Extra Block Storage D.   Ephemeral Block Storage,14   Chapter 1   ■   Domain 1: Design Resilient Architectures     " + 
    "70.   What is the consistency model in S3 for PUTs of new objects? A.   Write after read consistency B.   Read after write consistency C.   Eventual consistency D.   Synchronous consistency    " + 
    "71.   How many PUTs per second does S3 support? A.      100 B.      1500 C.      3500 D.      5000    " + 
    "72.   You have been asked to create a new S3 bucket with the name prototypeBucket32 in the  US West region. What would the URL for this bucket be? A.   https://s3-us-east-1.amazonaws.com/prototypeBucket32 B.   https://s3-us-west-1.amazonaws.com/prototypeBucket32 C.   https://s3.prototypeBucket32-us-east-1.amazonaws.com/ D.   https://s3-prototypeBucket32.us-east-1.amazonaws.com/    " + 
    "73.   What unique domain name do S3 buckets created in US East (N. Virginia) have, as com- pared to other regions? A.     s3.amazonaws.com B.      s3-us-east-1.amazonaws.com C.      s3-us-east.amazonaws.com D.      s3-amazonaws.com    " + 
    "74.   Which of the following are valid domain names for S3 buckets? (Choose two.) A.     s3.us-east-1.amazonaws.com B.      s3-us-west-2.amazonaws.com C.      s3.amazonaws.com D.      s3-jp-west-2.amazonaws.com    " + 
    "75.   What are the two styles of URLs that AWS supports for S3 bucket access? (Choose two.) A.   Virtual-hosted-style URLs B.   Domain-hosted-style URLs C.   Apex zone record URLs D.   Path-style URLs,Review Questions   15    " + 
    "76.   Which of the following are valid URLs for accessing S3 buckets? (Choose two.) A.   https://s3-us-west-1-prototypeBucket32.amazonaws.com/ B.   https://s3-us-west-1.amazonaws.com/prototypeBucket32 C.   https://s3-mx-central-1.amazonaws.com/prototypeBucket32 D.   https://prototypeBucket32.s3-us-west-1.amazonaws.com    " + 
    "7 7.   What is an AWS storage gateway? A.   A device to reside at a customer site that is part of a VPN connection between an on- premises site and AWS B.   A device that enables an on-premises site to upload files to S3 faster than over the  public Internet C.   A device to facilitate large data migrations into S3 D.   A device that can be used to cache S3-stored objects at an on-premises site    " + 
    "78.   Which of the following statements is not true about an AWS storage gateway? A.   It is a virtual appliance. B.   It is available as both a physical and virtual appliance. C.   It caches data locally at a customer site. D.   It interacts with S3 buckets.    " + 
    "79.   Which of the following are not true about S3? (Choose two.) A.   Buckets are created in specific regions. B.   Bucket names exist in a per-region namespace. C.   Buckets are object-based. D.   Each S3 bucket stores up to 5 TB of object data.    " + 
    "80.   Which of the following consistency models are supported by S3? (Choose two.) A.   Read after write consistency B.   Synchronous consistency C.   Write after read consistency D.   Eventual consistency    " + 
    "81.   Every object in S3 has a  . (Choose two.) A.     Key B.      Value C.   Both A and B D.   Version ID,16   Chapter 1   ■   Domain 1: Design Resilient Architectures     " + 
    "82.   Which of the following is the best approach to ensuring that objects in your S3 buckets  are not accidentally deleted? A.   Restrictive bucket permissions B.   Enabling versioning on buckets C.   Enabling MFA Delete on buckets D.   All of these options are equally useful.    " + 
    "83.   What HTTP request header is used by MFA Delete requests? A.      x-delete B.      x-amz-mfa C.      x-aws-mfa D.      x-amz-delete    " + 
    "84.   Which of the following operations will take advantage of MFA Delete, if it is enabled?  (Choose two.) A.   Deleting an S3 bucket B.   Changing the versioning state of a bucket C.   Permanently deleting an object version D.   Deleting an object’s metadata    " + 
    "85.   When using an MFA Delete–enabled bucket to delete an object, from where does the  authentication code come? A.   A hardware or virtual MFA device B.   The token section of the AWS console C.   The AWS REST API under delete-codes in a bucket’s metadata D.   None of these    " + 
    "86.   Who can enable MFA Delete on an S3 bucket? A.   All authorized IAM users of the bucket B.   All authorized IAM users that can update the bucket C.   The bucket owner D.   The root account that owns the bucket    " + 
    "8 7.   Who can enable versioning on an S3 bucket? A.   All authorized IAM users of the bucket B.   A, C, and D C.   The bucket owner D.   The root account that owns the bucket,Review Questions   17    " + 
    "88.   Which of the following exist and are attached to an object stored in S3? (Choose two.) A.     Metadata B.      Data C.   Authentication ID D.   Version history    " + 
    "89.   Which of the following is the AWS mechanism for adding object metadata using the AWS  console? A.      Labels B.      Tags C.      Metadata D.   Object name    " + 
    "90.   Which of the following is the exception to S3 storing all versions of an object? A.   When an object is deleted via MFA Delete B.   When all of the versions of an object are deleted C.   When an object’s current version is deleted D.   There are no exceptions.    " + 
    "91.   You have an S3 bucket with versioning enabled. How can you turn off versioning? A.   Update the bucket properties in the AWS console and turn off versioning. B.   Versioning can only be turned off through the AWS CLI or API. Use your application  keys to change versioning to “off” on the bucket. C.   Send a message to the S3 bucket using the HTML request header x-amz-versioning  and the value of “off.” D.   You can’t turn off versioning once it has been enabled.    " + 
    "92.   CloudFront is a web service for distributing what type of content? (Choose two.) A.   Object-based storage B.   Static files C.   Script-generated or programmatically generated dynamic content D.   All of the above    " + 
    "93.   What are the sources of information that CloudFront serves data from called? A.   Service providers B.   Source servers C.   Static servers D.   Origin servers,18   Chapter 1   ■   Domain 1: Design Resilient Architectures     " +
    "94.   Which of the following are typical origin servers for a CloudFront distribution? (Choose  two.) A.   EC2 instances B.   Amazon Glacier archives C.   API Gateway D.   S3 buckets    " + 
    "95.   Which of the following are not origin servers for a CloudFront distribution? (Choose  two.) A.   Docker containers running on ECS B.   MySQL ResultSet C.   S3 buckets D.   Redshift workloads    " + 
    "96.   What is the location where content will be cached in a CloudFront distribution called? A.   Availability zone B.   Edge location C.   Remote location D.   Origin edge    " + 
    "97.   Which of the following are not origin servers for a CloudFront distribution? (Choose  two.) A.   Elastic load balancer B.   Route 53 recordsets C.   SQS subscription endpoint D.   SNS topic retrieval endpoint    " + 
    "98.   What is a collection of edge locations called? A.      Region B.   Availability zone C.      CloudFront D.      Distribution    " + 
    "99.   Rank the total number of regions, availability zones, and edge locations in order from the  least number to the greatest number. A.   Availability zones < regions < edge locations B.   Regions < availability zones < edge locations C.   Edge locations < regions < availability zones D.   Edge locations < availability zones < regions";

    const SOME_ANSWER_PAGES_FROM_FIRST_CHAPTER = 
    "182   Appendix   ■   Answers to Review Questions Domain 1: Design Resilient Architectures      " + 
    "1.   B.   This is a common question on AWS exams, and relates to your understanding of the  various S3 classes. S3 and S3-IA have the same durability, but the availability of S3 is one  9 greater than S3-IA. S3 has 99.99 availability, while S3-IA has 99.9 availability. Glacier  has much greater first-byte latency than S3, so both C and D are false.      " + 
    "2.   B.   Anytime the primary consideration is storage with a local data presence—where  data must be stored or seen to be stored locally—a storage gateway gives you the best  option. This reduces the choices to B and D. B will store the files in S3 and provide local  cached copies, while D will store the files locally and push them to S3 as a backup. Since  management is concerned about storage in the cloud of primary files, B is the best choice;  local files are the primary source of data, while still allowing the company to experiment  with cloud storage without “risking” its data being stored primarily in the cloud.      " + 
    "3.   B.   Many of these answers are nonsensical in terms of what AWS allows. The limits on size  related to S3 are for objects; an individual object can be as large as 5 TB. Both A and C,  then, are not useful (or possible). D proposes to increase the maximum object size to 50  GB, but the maximum object size is already 5 TB. Option B is correct; AWS recommends  using Multipart Upload for all objects larger than 100 MB.      " + 
    "4.   C, D.   PUTs of new objects have a read after write consistency. DELETEs and overwrite  PUTs have eventual consistency across S3.      " + 
    "5.   C.   First, note that “on standard class S3” is a red herring, and irrelevant to the question.  Second, objects on S3 can be 0 bytes. This is equivalent to using  touch  on a file and then  uploading that 0-byte file to S3.      " + 
    "6.   A.   This is a matter of carefully looking at each URL. Bucket names—when not used as  a website—always come after the fully qualified domain name (FQDN); in other words,  after the forward slash. That eliminates C. Additionally, the region always comes earlier  in the FQDN than amazonaws.com, eliminating D. This leaves A and B. Of the two, A  correctly has the complete region, us-east-2.       " + 
    "7.   C.   This is another question that is tricky unless you work through each part of the URL,  piece by piece. The first clue is that this is a website hosted on S3, as opposed to directly  accessing an S3 bucket. Where website hosting is concerned, the bucket name is  part of  the  FQDN; where direct bucket access is concerned, the bucket name comes  after  the FQDN.  This is an essential distinction. This means that A and B are invalid. Then, you need to  recall that the s3-website portion of the FQDN is always connected to the region; in other  words, it is not a subdomain. The only option where this is the case is C.      " + 
    "8.   A.   This is another case of rote memorization. S3 and S3-IA have the same durability;  however, the availability of S3 is higher (99.99 vs. the 99.9 of S3-IA). Both Glacier and  S3-IA have the same durability of standard S3, so both C and D are false.      " + 
    "9.   B.   This is an important distinction when understanding S3 classes. Standard S3, S3-IA,  and S3 One Zone-IA all are equally durable, although in One Zone-IA, data will be lost if ,Domain 1: Design Resilient Architectures   183 the availability zone is destroyed. Each class has different availability, though: S3 is 99.99,  S3-IA is 99.9, and S3 One Zone-IA is 99.5. Therefore, it is false that all have the same  availability (B).    " + 
    "10.   A, C.   The wording of this question is critical. S3 buckets are created within a region,  but the AWS console and your account will show you  all  S3 buckets at all times. While a  bucket is created in a specific region, names of buckets are also global. IAM permissions  are also global and affect all regions. RDS and EC2 instances are region specific, and only  appear in the regions in which they were created in the AWS console.     " + 
    "11.   A, D.   EBS volumes are block-based storage, meaning that A is correct and B is incorrect.  That leaves C and D. The default EBS volume is SSD, so C is false. However, EBS volumes  can be in a variety of types, including magnetic and SSD options, so D is true.    " + 
    "12.   D.   AMIs are not cross-region, regardless of account or security group. This makes B  and C invalid. A is a valid choice but will not preserve any of the permissions or roles  that allow the instance to connect to S3. Therefore, D is the correct option: manual  configuration of the AMI  after  it has been copied is required for correct operation.    " + 
    "13.   D.   This is a bit of a trick question if you’re not careful. While S3 allows for 0-byte objects,  and charges as such, S3-IA charges all objects as if they are  at least  128 KB in size. So  while you can store a smaller object in S3-IA, it will be considered 128 KB for pricing and  charging purposes.    " + 
    "14.   A, D.   A Multi-AZ setup is the easiest solution, and the most common. Turning on read  replicas (option B) is not a guarantee, as read replicas are not automatically installed in  different AZs or regions. However, with option D, a cross-region replica configuration  will ensure multiple regions are used. A storage gateway (option C) is backed by S3, not  RDS.    " + 
    "15.   A, D.   Launch configurations are concerned primarily with creating new instances while  staying abstract from the details of what is on those instances. So the AMI and IAM role  for an instance is a general configuration, applies to all created instances, and is correct (A  and D). The polling time for latency isn’t connected to launching new instances (although  it might be a trigger configured elsewhere). Each instance is associated with a different  EBS volume, so selecting an EBS volume for multiple instances doesn’t actually make  sense.    " + 
    "16.   D.   Launch configurations are where details are specified for creating (launching) new  instances (option D). Security groups have to do more with what traffic is allowed into  and out of the launched instances. The remaining two options—A and C—don’t make  sense in this context.     " + 
    "17.   D.   By default, EBS root volumes are terminated when the associated instance is  terminated. However, this is only the default value; therefore A is not correct. Option B  is not directly addressing the question; the EBS volume would still be deleted even if you  take a snapshot. Option C is not relevant, but option D is: You can use the AWS CLI (or  the console) to set the root volume to persist after instance termination.    " + 
    "18.   B.   EBS volumes are backed up to S3 incrementally.,184   Appendix   ■   Answers to Review Questions    " + 
    "19.   B.   EBS volumes can only attach to a single instance at one time. The other options are all  simply to distract.    " + 
    "20.   A, B.   All instances and most services in AWS provide tagging for metadata. Certificates  are related to SSL and help define the identity of a site or transmission, policies are related  to permissions and roles, and labels are not (currently) an AWS construct.    " + 
    "21.   A, B.   Valid concerns in this list include placing storage close to your users, to reduce  network latency, and distance from your operations center. This latter is a little less  obvious but is centered around disaster recovery scenarios: If a disaster destroyed your  operations center, you would not want your storage on AWS to be geographically in the  same area.    " + 
    "22.   B.   Every EC2 instance provides the option to specify an availability zone. While you don’t  have to specify something other than the default, instances are always provisioned in a  specific availability zone, which is user configurable.    " + 
    "23.   C.   Spread placement groups—which are relatively new to AWS—can be placed across  multiple availability zones. Cluster placement groups cannot, and  placement groups   generally refers to cluster placement groups.  Cross-region placement groups  is a made-up  term.    " + 
    "24.   C.   A customer gateway is the anchor on the customer side of an Amazon VPN  connection. A storage gateway is for caching or storing data and connecting to S3. A  virtual private gateway is an important part of a VPN connection but exists on the AWS  side of the connection. A virtual private network is actually what VPN stands for.    " + 
    "25.   B.   VPN connections between an on-premises site and AWS consist of a customer gateway  on the customer side and a virtual private gateway on the AWS side.    " + 
    "26.   B.   A typical VPN connection uses two different tunnels for redundancy. Both tunnels  move between the customer gateway and the virtual private gateway.    " + 
    "27.   D.   Traffic begins at the on-premises site, which means starting at a customer gateway.  Traffic then flows through the Internet and to the virtual private gateway at AWS. Then,  from the gateway, traffic can flow into an Amazon VPC.    " + 
    "28.   A, C.   Traffic across the Internet can only flow between public IP addresses in most  cases. For a VPN connection, you will need a customer gateway with a public IP address  as well as a virtual private gateway with a public IP address, both of which you may be  responsible for configuring. A VPC does not have an IP address of its own (making option  B incorrect), and VPN tunnels do not either (option D).    " + 
    "29.   A.   A storage gateway is the correct answer, as it is used for caching or storing data and  connecting to S3. A customer gateway is the anchor on the customer side of an Amazon  VPN connection. A virtual private gateway is used for connecting into AWS via a VPN,  and a virtual private network is actually what VPN stands for.    " + 
    "30.   A, B.   Both file and volume gateways offer solutions for connecting to cloud-based storage.  A cached gateway isn’t an AWS option, and a virtual private gateway is used in creating  VPN connections.,Domain 1: Design Resilient Architectures   185    " + 
    "31.   A.   Each of the options is a valid configuration for a storage gateway. Of the options, file  gateway provides an NFS-style protocol for transferring data to and from the gateway and  therefore is the best option.    " + 
    "32.   D.   This is relatively easy because the word  tape  actually appears in both the question and  the answer. A tape gateway backs up data in Amazon Glacier while providing a virtual  tape infrastructure that many existing tape backup systems can utilize.    " + 
    "33.   C.   A stored volume gateway stores data at the on-premises data store and backs up to S3  asynchronously to support disaster recovery. Most important, though, is that by storing  data locally, network latency is minimal. Of the available options, only a stored volume  gateway provides local data with this speed of access across an entire dataset.    " + 
    "34.   C.   Anytime very large data needs to be moved into AWS, consider Snowball. Snowball is  a physical device that allows for data to be physically sent to AWS rather than transferred  over a network. It is the only solution that will not potentially cause disruptive network  outages or slowdowns.    " +
    "35.   A, C.   A cached volume gateway stores the most commonly accessed data locally (option  D) while keeping the entire dataset in S3. This has the effect of reducing the cost of storage  on-site, because you need less (option B). Since both of these are true, you need to select  the other two options as reasons to  not  use a cached volumes gateway: A and C.    " + 
    "36.   A.   Be careful here. While it might seem at a glance that a tape gateway is best, most  backup solutions do not employ tape backups. They use NFS mounts and file-based  backups, which is exactly what a file gateway is best used for.    " + 
    "37.   B.   A cached volume gateway is ideal when a  portion  of a dataset is at issue. The most  used data will be cached, and therefore stored in the local cache on premises. If the entire  dataset is needed, then a stored volume gateway is a better choice.    " + 
    "38.   C.   If the entire dataset is needed, then a stored volume gateway is a better choice than  a cached volume gateway. The stored volume stores the entire dataset on premises and  therefore is very fast for all data access.    " +
    "39.   D.   A tape gateway is ideal for replacing off-site tape directories. The gateway is a virtual  tape directory and avoids the costs of transporting actual tapes to an expensive off-site  location.    " + 
    "40.   D.   This should be automatic: Glacier is the Amazon offering for long-term “on ice”  storage.    " + 
    "41.   B, D.   Launch configurations are specific to a region, as are EC2 instances. While S3  buckets are created in a region, their names are global. IAM users also exist across all of  your account.    " + 
    "42.   A.   HTTP 200 is the general return for success, and this is the case for S3 uploads as well.    " + 
    "43.   D.   This is easy to miss. All S3 storage classes (S3 standard, S3-IA, and S3 One Zone-IA)  share the same durability of 11 9s.,186   Appendix   ■   Answers to Review Questions    " + 
    "44.   D.   This is easy to miss. All S3 storage classes (S3 standard, S3-IA, and S3 One Zone-IA)  share the same durability of 11 9s.    " + 
    "45.   D.   All S3 storage classes (S3 standard, S3-IA, and S3 One Zone-IA) share the same  durability of 11 9s.    " + 
    "46.   A.   While all S3 storage classes share the same durability, they have varying availability.  S3-IA has 99.9%, while S3 One Zone-IA is less (99.5%), and S3 standard is higher  (99.99%).     " + 
    "47.   B.   While all S3 storage classes share the same durability, they have varying availability.  S3-IA has 99.9%, while S3 One Zone-IA is less (99.5%), and S3 standard is higher  (99.99%).    " + 
    "48.   C.   While all S3 storage classes share the same durability, S3 standard has the highest  availability, at 99.99%.    " + 
    "49.   D.   All of the S3 storage classes support both SSL for data in transit and encryption for  data at rest.    " + 
    "50.   D.   All of the S3 storage classes support both SSL for data in transit and encryption for  data at rest.    " + 
    "51.   D.   All S3 storage classes have buckets that can be created in a specific region. The objects  in the buckets are then stored in availability zones within that region, depending upon the  storage class.    " + 
    "52.   D.   While S3 does use availability zones to store objects in buckets, you do not choose the  availability zone yourself. Even S3 One Zone-IA does not allow you to specify the AZ  for use.    " + 
    "53.   A.   S3 storage is key based. Keys can be a string and the value is the uploaded object.    " +
    "54.   C, D.   S3 does not provide SSH or SFTP access, nor standard FTP access. You can access  your data through the AWS console and through a REST interface via HTTP.    " + 
    "55.   B, C.   S3 is built to automatically scale in times of heavy application usage. There is  no requirement to enable Auto Scaling (A); rather, this happens automatically (so B is  correct). Further, S3 tends to scale evenly across the AWS network (C). Option D is the  opposite of what AWS intends.    " + 
    "56.   B.   When evaluating S3 storage, all storage classes have the same durability. For cost,  though, S3 One Zone-IA is the clear winner. Only Glacier is potentially less expensive but  does not provide the same quick file access that S3 One Zone-IA does.     " + 
    "57.   D.   This is nearly a trick question. S3 in general is built for scalability, and the different  storage classes are not substantially different in terms of how they can scale. However,  without knowing how quickly data retrieval must be, and the priorities of the data, it is  impossible to choose between S3 standard and S3-IA, and in some cases, even Glacier.    " + 
    "58.   C.   By default, all AWS accounts can create up to 100 buckets. However, this limit can  easily be raised by AWS if you request an upgrade.,Domain 1: Design Resilient Architectures   187    " + 
    "59.   B.   S3 uploads are, by default, done via a single operation, usually via a single PUT  operation. AWS suggests that you can upload objects up to 100 MB before changing to  Multipart Upload.    " + 
    "60.   B.   Using the Multipart Upload is almost entirely a function of the size of the files being  uploaded. AWS recommends using it for any files greater than 100 MB, and 10 GB is  certainly large enough to benefit from Multipart Uploads.    " + 
    "61.   A, C.   Multipart Upload is, as should be the easiest answer, ideal for large objects on  stable networks (A). But it also helps handle less-reliable networks as smaller parts can fail  while others get through, reducing the overall failure rate (C). There is no cost associated  with data ingress (B), and D doesn’t make much sense at all!    " + 
    "62.   A, C.   Presigned URLs are created to allow users without AWS credentials to access  specific resources (option C). And it’s the creator of the URL (option A) that assigns these  permissions, rather than the user (option B). Finally, these credentials are associated with  the URL but are not encrypted into the URL itself.    " + 
    "63.   D.   Presigned URLs are not tied to specific AWS services. They are simply URLs that  can point at anything a normal URL can point at, except that the creator can associate  permissions and a timeout with the URL.    " + 
    "64.   D.   A presigned URL is always configured at creation for a valid Time to Live (often  referred to as TTL). This time can be very short, or quite long.    " + 
    "65.   B, D.   Overwrite PUTs and DELETEs have eventual consistency. PUTs of new objects have  write and then read consistency.    " + 
    "66.   D.   These are all consistent with S3 behavior. Option A could occur as the new object is  being propagated to additional S3 buckets. B and C could occur as a result of eventual  consistency, where a DELETE operation does not immediately appear.    " + 
    "6 7.   C.   All regions have eventual consistency for overwrite PUTs and DELETEs.    " + 
    "68.   A, D.   All S3 storage classes are object-based, while EBS and EFS are block-based.    " + 
    "69.   B.   EBS stands for Elastic Block Storage.    " + 
    "70.   B.   New objects uploaded via PUT are subject to read after write consistency. Overwrite  PUTs use the eventual consistency model.    " + 
    "71.   C.   This is important because it reflects a recent change by AWS. Until 2018, there was a  hard limit on S3 of 100 PUTs per second, but that limit has now been raised to 3500 PUTs  per second.    " + 
    "72.   B.   S3 buckets have names based upon the S3 identifier (s3), the region (us-west-1 in this  case), and the  amazonaws.com  domain. Then, the bucket name appears  after  the domain.  That results in B,  https://s3-us-west-1.amazonaws.com/prototypeBucket32 . Option  A has an incorrect region, and both C and D have the bucket name in the domain, which  is incorrect.,188   Appendix   ■   Answers to Review Questions    " + 
    "73.   A.   S3 buckets have names based upon the S3 identifier (s3), the region (us-east-1 in  this case), and the  amazonaws.com  domain. Then, the bucket name appears  after   the domain. That results in a URL like  https://s3-us-east-1.amazonaws.com/ prototypeBucket32 . However, buckets in US East are a special case and should use the  special, unique endpoint  s3.amazonaws.com  (option A).    " + 
    "74.   B, C.   Option A is not the correct format; s3 should be separated from the region with  a dash (-). Option B is valid, and option C is the correct unique URL for US East (N.  Virginia). Option D is the right format, but jp-west-2 is not an AWS region.    " + 
    "75.   A, D.   S3 supports two styles of bucket URLs: virtual-hosted-style and path-style   URLs. Virtual-hosted-style URLs are of the form  http://bucket.s3- aws-region   .amazonaws.com , and path-style URLs are the traditional URLs you’ve seen:   https://s3- aws-region .amazonaws.com/ bucket-name .    " + 
    "76.   B, D.   Option A is not a valid URL for S3. Option B is, using the path-style URLs that are  most common for S3 buckets. Option C uses a nonexistent region (mx-central-1). Option  D is valid and uses the virtual-hosted-style URL format.    " + 
    "7 7.   D.   AWS storage gateway is a virtual appliance that allows on-premises sites to interact  with S3 while still caching (in certain configurations) data locally.    " + 
    "78.   B.   AWS storage gateway is a virtual appliance and is not available as a hardware  appliance.    " + 
    "79.   B, D.   While S3 buckets are created in a specific region (A), the names of buckets are  global and must exist in a global namespace (so B is untrue). Buckets are object-based (so  C is true), and while a single object is limited at 5 TB, the buckets are unlimited in total  storage capacity (so D is false).    " + 
    "80.   A, D.   S3 supports read after write consistency for PUTs of new objects and eventual  consistency for overwrite PUTs and DELETEs.    " +
    "81.   C, D.   S3 objects have a key, a value, and a version ID, so the correct answers are C and D.    " + 
    "82.   C.   MFA Delete is the absolute best means of ensuring that objects are not accidentally  deleted. MFA—Multi-Factor Authentication—ensures that any object deletion requires  multiple forms of authentication.    " + 
    "83.   B.   All Amazon-specific request headers begin with x-amz. This is important to remember  as it will help eliminate lots of incorrect answers. This leaves only x-amz-mfa.    " + 
    "84.   B, C.   MFA Delete applies to deleting objects, not buckets (so option A is incorrect). It  affects changing the versioning state of a bucket or permanently deleting any object (or a  version of that object); this makes B and C correct. Deleting an object’s metadata while  leaving the object intact does not require MFA Delete.    " + 
    "85.   A.   This answer simply has to be memorized. MFA Delete authentication codes are pulled  from hardware or virtual MFA devices, like Google Authenticator on an iPhone.,Domain 1: Design Resilient Architectures   189    " + 
    "86.   D.   This is tricky and somewhat un-intuitive. Only the root account can enable MFA  Delete. Even the console user that created the bucket—if it isn’t the root user—cannot  enable MFA Delete on a bucket.    " + 
    "8 7.   B.   The bucket owner, root account, and all authorized IAM users of a bucket are allowed  to enable versioning.    " + 
    "88.   A, B.   Each object in S3 has a name, value (data), version ID, and metadata. The version  history of an object won’t exist unless versioning is turned on, so it’s not always a valid  answer.    " + 
    "89.   B.   All metadata in AWS is currently entered using tags, name-value pairs available  through the console.    " + 
    "90.   D.   All versions of an object are stored, regardless of how that object is deleted.    " + 
    "91.   D.   Once enabled, it is not possible to disable or turn off versioning on an S3 bucket.  While you can suspend versioning, this doesn’t actually turn versioning off, and old  versions are preserved.    " + 
    "92.   B, C.   CloudFront is intended to cache and deliver static files from your origin servers to  users or clients. Dynamic content is also servable through CloudFront from EC2 or other  web servers. Object-based storage doesn’t make sense in this context, as CloudFront is a  distribution mechanism, not a storage facility.    " + 
    "93.   D.   CloudFront serves content from origin servers, usually static files and dynamic  responses. These origin servers are often S3 buckets for static content and EC2 instances  for dynamic content.    " + 
    "94.   A, D.   CloudFront serves content from origin servers, usually static files and dynamic  responses. These origin servers are often S3 buckets for static content and EC2 instances  for dynamic content (options A and D).    " + 
    "95.   B, D.   CloudFront serves content from origin servers, usually static files and dynamic  responses. These origin servers are often S3 buckets for static content and EC2 instances  for dynamic content (meaning option C is valid). Containers can also be used in place  of EC2 instances, making option A valid as well. This leaves B and D as invalid origin  servers.    " + 
    "96.   B.   CloudFront stores content as cached content on edge locations across the world.    " + 
    "97.   C, D.   CloudFront is able to distribute content from an ELB, rather than directly  interfacing with S3, and can do the same with a Route 53 recordset. These allow the  content to come from multiple instances. This means that options C and D are invalid  origin servers and therefore the correct answers.    " + 
    "98.   D.   A CloudFront distribution is a collection of edge locations across the world.    " + 
    "99.   B.   First, you can eliminate any answer where fewer availability zones are indicated than  regions, because each region has multiple availability zones (A and D). This leaves B and  C. There are more edge locations than availability zones, which means that B is correct.,190   Appendix   ■   Answers to Review Questions   " + 
    "100.   A, B.   This question is simple if you remember that, from most to least, the ordering goes  edge locations (most) to availability zones to regions (least). Knowing that, options A and  B are correct.   " + 
    "101.   B, D.   Availability zones are not content storage devices; they are virtual data centers.  Edge locations are used by CloudFront distributions to store cached content (so correct).  Route 53 is the Amazon DNS service. EC2 instances can serve content from processes   (so also correct).   " + 
    "102.   A, D.   While edge locations are typically read from by clients, they are also writeable. You  can store objects on edge locations as well as read from them.   " + 
    "103.   A, C.   The obvious answer here is an S3 bucket. EC2 locations are compute, not storage,  and availability zones are virtual data centers. This leaves edge locations, which allow  objects to be written directly to them.   " + 
    "104.   A.   TTL is Time to Live, the amount of time an object is cached on a CloudFront edge  location.   " + 
    "105.   B, D.   You must perform  both  steps B and D, and you must perform B  before  D or the  banner ad could get re-cached. Also note that expiring a cached object manually incurs a  cost.   " + 
    "106.   B.   The default TTL for edge locations is 24 hours.   " + 
    "107.   B.   All new S3 buckets are private by default.   " + 
    "108.   B, C.   The correct answers are ACLs—access control lists—and bucket policies (B and C).  NACLs are network access lists, used for securing VPCs and individual instances, and  JSON is used for writing policies.   " + 
    "109.   C.   S3 bucket policies are written in JSON, the JavaScript Object Notation. XML is not  used much in AWS, and YAML is often used for CloudFormation. AML is made up!   " + 
    "110.   A.   All data is backed up to S3 asynchronously when a stored volume is used. This ensures  that no lag is incurred by clients that interact with the stored volumes on-site.   " + 
    "111.   A.   This is a little harder unless you’ve seen the term  virtual tape library (VTL)  before. A tape  volume is in fact a virtual tape library. Fortunately, even if you’ve never heard of a VTL, you  can reason it out based on the other incorrect options: A VPC is a virtual private cloud, a  VPN is a virtual private network, and NetBackup is an application, not a tape volume.   " + 
    "112 .   A.   This is an easy onE: Snowball is the AWS solution for transferring large datasets.   " + 
    "113.   D.   Snowball actually does not support any code. You just transfer your data to the device  and send it to Amazon. Additionally, CloudFormation is not a language; you use YAML  (for example) to write CloudFormation templates.   "; 
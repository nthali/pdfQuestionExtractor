const { QuestionDataExtractor, StringUtils, AnswerDataExtractor, QuizCreator, Quiz } = require('./pdfTextToQuizFormat');

test( 'createQuiz with questions and answers', () => {
    const quizCreator = new QuizCreator();
    expect( quizCreator.createQuiz( [sybexQuestionsFirstPage], [sybexAnswerPageText] ).toJson() ).toEqual( expectedQuizJsonForSybexPracticeTest_WITH_ANSWERS );
});

test( 'createQuiz for official study guide NO ANSWERS', () => {
    const quizCreator = new QuizCreator();
    expect( quizCreator.createQuiz( extractedTextLines, [] ).toJson() ).toEqual( expectedQuizJsonForOfficialStudyGuide );
});

test( 'createQuiz for sybex practice tests NO ANSWERS', () => {
    const quizCreator = new QuizCreator();
    expect( quizCreator.createQuiz( [sybexQuestionsFirstPage], [] ).toJson() ).toEqual( expectedQuizJsonForSybexPracticeTest_NO_ANSWERS );
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
        "    a: 'The availability of S3 and S3-IA is the same.',\n" +
        "    b: 'The durability of S3 and S3-IA is the same.',\n" +
        "    c: 'The latency of S3 and Glacier is the same.',\n" +
        "    d: 'The latency of S3 is greater than that of Glacier.'\n" +
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
    expect( quizCreator.createQuiz( [oneExtractedTextLine], [] ).toJson() ).toEqual( expectedQuizJsonWithIncomplete5thQ );
});

test( 'extract question data for string with only question and no choices extracts correctly', () => {
    const textWithOnlyQuestionAndNoChoices = '5 .  Your application stores critical data in Amazon Simple Storage Service (Amazon S3), which must be protected against inadvertent or intentional deletion. How can this data be protected? (Choose 2 answers)';
    const expectedQ = 'Your application stores critical data in Amazon Simple Storage Service (Amazon S3), which must be protected against inadvertent or intentional deletion. How can this data be protected? (Choose 2 answers)';
    
    const qExtractor = new QuestionDataExtractor();
    const q = qExtractor.extractQuestion( textWithOnlyQuestionAndNoChoices, 5 );
    expect( q[0] ).toEqual( expectedQ );
});

test( 'separateQuestionStringChunksForSybexPracticeExamText', () => {
    const qExtractor = new QuestionDataExtractor();
    const questionStringArray = qExtractor.separateQuestionStringChunksFromFullText( sybexQuestionsFirstPage );
    expect( questionStringArray.length ).toBe( 4 ); // 4 Questions
});

test( 'separateQuestionStringChunksFromFullText', () => {
    const fullText = "Review Questions 1 . In what ways does Amazon Simple Storage Service (Amazon S3) object storage differ from block and file storage? (Choose 2 answers) A . Amazon S3 stores data in fixed size blocks. B . Objects are identified by a numbered address. C . Objects can be any size. D . Objects contain both data and metadata. E . Objects are stored in buckets. 2 . Which of the following are not appropriates use cases for Amazon Simple Storage Service (Amazon S3)? (Choose 2 answers) A . Storing web content B . Storing a file system mounted to an Amazon Elastic Compute Cloud (Amazon EC2) instance C . Storing backups for a relational database D . Primary storage for a database E . Storing logs for analytics 3 . What are some of the key characteristics of Amazon Simple Storage Service (Amazon S3)? (Choose 3 answers) A . All objects have a URL. B . Amazon S3 can store unlimited amounts of data. C . Objects are world-readable by default. D . Amazon S3 uses a REST (Representational State Transfer) Application Program Interface (API). E . You must pre-allocate the storage in a bucket. 4 . Which features can be used to restrict access to Amazon Simple Storage Service (Amazon S3) data? (Choose 3 answers) A . Enable static website hosting on the bucket. B . Create a pre-signed URL for an object. C . Use an Amazon S3 Access Control List (ACL) on a bucket or object. D . Use a lifecycle	policy. E . Use an Amazon S3 bucket policy.";
    const expectedQuestionStrings = [
        "1 . In what ways does Amazon Simple Storage Service (Amazon S3) object storage differ from block and file storage? (Choose 2 answers) A . Amazon S3 stores data in fixed size blocks. B . Objects are identified by a numbered address. C . Objects can be any size. D . Objects contain both data and metadata. E . Objects are stored in buckets.",
        "2 . Which of the following are not appropriates use cases for Amazon Simple Storage Service (Amazon S3)? (Choose 2 answers) A . Storing web content B . Storing a file system mounted to an Amazon Elastic Compute Cloud (Amazon EC2) instance C . Storing backups for a relational database D . Primary storage for a database E . Storing logs for analytics",
        "3 . What are some of the key characteristics of Amazon Simple Storage Service (Amazon S3)? (Choose 3 answers) A . All objects have a URL. B . Amazon S3 can store unlimited amounts of data. C . Objects are world-readable by default. D . Amazon S3 uses a REST (Representational State Transfer) Application Program Interface (API). E . You must pre-allocate the storage in a bucket.",
        "4 . Which features can be used to restrict access to Amazon Simple Storage Service (Amazon S3) data? (Choose 3 answers) A . Enable static website hosting on the bucket. B . Create a pre-signed URL for an object. C . Use an Amazon S3 Access Control List (ACL) on a bucket or object. D . Use a lifecycle	policy. E . Use an Amazon S3 bucket policy."
    ];
    const qExtractor = new QuestionDataExtractor();
    const questionStringArray = qExtractor.separateQuestionStringChunksFromFullText( fullText );
    expect( questionStringArray.length ).toBe( 4 ); // 4 Questions
    questionStringArray.forEach( (questionStr, index) => {
        expect( questionStr ).toEqual( expectedQuestionStrings[index] );
    });
});

test( 'extract question chunks from text with incorrect q number', () => {
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
    const qStrArray = qExtractor.separateQuestionStringChunksFromFullText( sybexQuestionsProblemPage, 64 );
    expect( qStrArray.length ).toBe( 6 );
    expect( qStrArray[3] ).toEqual( '6 7.   In which regions does Amazon S3 offer eventual consistency for overwrite PUTs and  DELETEs? A.   All US regions B.   All US and EU regions C.   All regions D.   No regions, eventual consistency is not the model for overwrite PUTs.' );
});

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

test( 'extractAnswer single page', () => {
    const ansExtractor = new AnswerDataExtractor();
    const answers = ansExtractor.extractAnswers( [ sybexAnswerPageText ] );
    expect( answers ).toEqual([ 'B', 'B', 'B', [ 'C', 'D' ], 'C', 'A', 'C', 'A', 'B' ]);
});

test( 'extractAnswer second page', () => {
    const ansExtractor = new AnswerDataExtractor();
    const answers = ansExtractor.extractAnswers( [ sybexAnswer2ndPageText ], 10 );
    expect( answers ).toEqual([ [ 'A', 'C' ], [ 'A', 'D' ], 'D', 'D', [ 'A', 'D' ], [ 'A', 'D' ], 'D', 'D', 'B' ]);
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

const sybexAnswerPageText = 
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

const sybexAnswer2ndPageText = 
'Domain 1: Design Resilient Architectures 183' +
'the availability zone is destroyed. Each class has different availability, though: S3 is 99.99, S3-IA is 99.9, and S3 One Zone-IA is 99.5. Therefore, it is false that all have the same availability (B).' +
'10. A, C. The wording of this question is critical. S3 buckets are created within a region,' +
'but the AWS console and your account will show you all S3 buckets at all times. While a bucket is created in a specific region, names of buckets are also global. IAM permissions are also global and affect all regions. RDS and EC2 instances are region specific, and only appear in the regions in which they were created in the AWS console.' +
'11. A, D. EBS volumes are block-based storage, meaning that A is correct and B is incorrect. That leaves C and D. The default EBS volume is SSD, so C is false. However, EBS volumes can be in a variety of types, including magnetic and SSD options, so D is true.' +
'12. D. AMIs are not cross-region, regardless of account or security group. This makes B and C invalid. A is a valid choice but will not preserve any of the permissions or roles that allow the instance to connect to S3. Therefore, D is the correct option: manual configuration of the AMI after it has been copied is required for correct operation.' +
'13. D. This is a bit of a trick question if you’re not careful. While S3 allows for 0-byte objects, and charges as such, S3-IA charges all objects as if they are at least 128 KB in size. So while you can store a smaller object in S3-IA, it will be considered 128 KB for pricing and charging purposes.' +
'14. A, D. A Multi-AZ setup is the easiest solution, and the most common. Turning on read replicas (option B) is not a guarantee, as read replicas are not automatically installed in different AZs or regions. However, with option D, a cross-region replica configuration will ensure multiple regions are used. A storage gateway (option C) is backed by S3, not RDS.' +
'15. A, D. Launch configurations are concerned primarily with creating new instances while staying abstract from the details of what is on those instances. So the AMI and IAM role for an instance is a general configuration, applies to all created instances, and is correct (A and D). The polling time for latency isn’t connected to launching new instances (although it might be a trigger configured elsewhere). Each instance is associated with a different EBS volume, so selecting an EBS volume for multiple instances doesn’t actually make sense.' +
'16. D. Launch configurations are where details are specified for creating (launching) new instances (option D). Security groups have to do more with what traffic is allowed into and out of the launched instances. The remaining two options—A and C—don’t make sense in this context.' +
'17. D. By default, EBS root volumes are terminated when the associated instance is terminated. However, this is only the default value; therefore A is not correct. Option B is not directly addressing the question; the EBS volume would still be deleted even if you take a snapshot. Option C is not relevant, but option D is: You can use the AWS CLI (or the console) to set the root volume to persist after instance termination.' +
'18. B. EBS volumes are backed up to S3 incrementally.';

const sybexQuestionsFirstPage = 
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

const expectedQuizJsonForSybexPracticeTest_WITH_ANSWERS = 
    "const myQuestions = [\n" +
        "// Q1\n" +
        "{\n" +
        "  question: 'Which of the following statements regarding S3 storage classes is true?',\n" +
        "  choices: {\n" +
        "    a: 'The availability of S3 and S3-IA is the same.',\n" +
        "    b: 'The durability of S3 and S3-IA is the same.',\n" +
        "    c: 'The latency of S3 and Glacier is the same.',\n" +
        "    d: 'The latency of S3 is greater than that of Glacier.'\n" +
        "  },\n" +
        "  answer: 'B'\n" +
        "},\n" +
        "// Q2\n" +
        "{\n" +
        "  question: 'A small business specializing in video processing wants to prototype cloud storage in  order to lower its costs. However, management is wary of storing its client files in the  cloud rather than on premises. They are focused on cost savings and experimenting with  the cloud at this time. What is the best solution for their prototype?',\n" +
        "  choices: {\n" +
        "    a: 'Install a VPN, set up an S3 bucket for their files created within the last month, and  set up an additional S3-IA bucket for older files. Create a lifecycle policy in S3 to  move files older than 30 days into the S3-IA bucket nightly.',\n" +
        "    b: 'Install an AWS storage gateway using stored volumes.',\n" +
        "    c: 'Set up a Direct Connect and back all local hard drives up to S3 over the Direct   Connect nightly.',\n" +
        "    d: 'Install an AWS storage gateway using cached volumes.'\n" +
        "  },\n" +
        "  answer: 'B'\n" +
        "},\n" +
        "// Q3\n" +
        "{\n" +
        "  question: 'You have a group of web designers who frequently upload large zip files of images to S3,  often in excess of 5 GB. Recently, team members have reported that they are receiving the  error “Your proposed upload exceeds the maximum allowed object size.” What action  should you take to resolve the upload problems?',\n" +
        "  choices: {\n" +
        "    a: 'Increase the maximum allowed object size in the target S3 bucket used by the web  designers.',\n" +
        "    b: 'Ensure that your web designers are using applications or clients that take advantage  of the Multipart Upload API for all uploaded objects.',\n" +
        "    c: 'Contact AWS and submit a ticket to have your default S3 bucket size raised; ensure  that this is also applied to the target bucket for your web designers’ uploads.',\n" +
        "    d: 'Log in to the AWS console, select the S3 service, and locate your bucket. Edit the  bucket properties and increase the maximum object size to 50 GB.'\n" +
        "  },\n" +
        "  answer: 'B'\n" +
        "},\n" +
        "// Q4\n" +
        "{\n" +
        "  question: 'For which of the following HTTP methods does S3 have eventual consistency? (Choose  two.)',\n" +
        "  choices: {\n" +
        "    a: 'PUTs of new objects',\n" +
        "    b: 'UPDATEs',\n" +
        "    c: 'DELETEs',\n" +
        "    d: 'PUTs that overwrite existing objects'\n" +
        "  },\n" +
        "  answer: [ 'C', 'D' ]\n" +
        "}];"

const expectedQuizJsonForSybexPracticeTest_NO_ANSWERS = 
    "const myQuestions = [\n" +
        "// Q1\n" +
        "{\n" +
        "  question: 'Which of the following statements regarding S3 storage classes is true?',\n" +
        "  choices: {\n" +
        "    a: 'The availability of S3 and S3-IA is the same.',\n" +
        "    b: 'The durability of S3 and S3-IA is the same.',\n" +
        "    c: 'The latency of S3 and Glacier is the same.',\n" +
        "    d: 'The latency of S3 is greater than that of Glacier.'\n" +
        "  },\n" +
        "  answer: ''\n" +
        "},\n" +
        "// Q2\n" +
        "{\n" +
        "  question: 'A small business specializing in video processing wants to prototype cloud storage in  order to lower its costs. However, management is wary of storing its client files in the  cloud rather than on premises. They are focused on cost savings and experimenting with  the cloud at this time. What is the best solution for their prototype?',\n" +
        "  choices: {\n" +
        "    a: 'Install a VPN, set up an S3 bucket for their files created within the last month, and  set up an additional S3-IA bucket for older files. Create a lifecycle policy in S3 to  move files older than 30 days into the S3-IA bucket nightly.',\n" +
        "    b: 'Install an AWS storage gateway using stored volumes.',\n" +
        "    c: 'Set up a Direct Connect and back all local hard drives up to S3 over the Direct   Connect nightly.',\n" +
        "    d: 'Install an AWS storage gateway using cached volumes.'\n" +
        "  },\n" +
        "  answer: ''\n" +
        "},\n" +
        "// Q3\n" +
        "{\n" +
        "  question: 'You have a group of web designers who frequently upload large zip files of images to S3,  often in excess of 5 GB. Recently, team members have reported that they are receiving the  error “Your proposed upload exceeds the maximum allowed object size.” What action  should you take to resolve the upload problems?',\n" +
        "  choices: {\n" +
        "    a: 'Increase the maximum allowed object size in the target S3 bucket used by the web  designers.',\n" +
        "    b: 'Ensure that your web designers are using applications or clients that take advantage  of the Multipart Upload API for all uploaded objects.',\n" +
        "    c: 'Contact AWS and submit a ticket to have your default S3 bucket size raised; ensure  that this is also applied to the target bucket for your web designers’ uploads.',\n" +
        "    d: 'Log in to the AWS console, select the S3 service, and locate your bucket. Edit the  bucket properties and increase the maximum object size to 50 GB.'\n" +
        "  },\n" +
        "  answer: ''\n" +
        "},\n" +
        "// Q4\n" +
        "{\n" +
        "  question: 'For which of the following HTTP methods does S3 have eventual consistency? (Choose  two.)',\n" +
        "  choices: {\n" +
        "    a: 'PUTs of new objects',\n" +
        "    b: 'UPDATEs',\n" +
        "    c: 'DELETEs',\n" +
        "    d: 'PUTs that overwrite existing objects'\n" +
        "  },\n" +
        "  answer: ''\n" +
        "}];"

const expectedQuizJsonWithIncomplete5thQ = 
    "const myQuestions = [\n" +
        "// Q1\n" +
        "{\n" +
        "  question: 'In what ways does Amazon Simple Storage Service (Amazon S3) object storage differ from block and file storage? (Choose 2 answers)',\n" +
        "  choices: {\n" +
        "    a: 'Amazon S3 stores data in fixed size blocks.',\n" +
        "    b: 'Objects are identified by a numbered address.',\n" +
        "    c: 'Objects can be any size.',\n" +
        "    d: 'Objects contain both data and metadata.',\n" +
        "    e: 'Objects are stored in buckets.'\n" +
        "  },\n" +
        "  answer: ''\n" +
        "},\n" +
        "// Q2\n" +
        "{\n" +
        "  question: 'Which of the following are not appropriates use cases for Amazon Simple Storage Service (Amazon S3)? (Choose 2 answers)',\n" +
        "  choices: {\n" +
        "    a: 'Storing web content',\n" +
        "    b: 'Storing a file system mounted to an Amazon Elastic Compute Cloud (Amazon EC2) instance',\n" +
        "    c: 'Storing backups for a relational database',\n" +
        "    d: 'Primary storage for a database',\n" +
        "    e: 'Storing logs for analytics'\n" +
        "  },\n" +
        "  answer: ''\n" +
        "},\n" +
        "// Q3\n" +
        "{\n" +
        "  question: 'What are some of the key characteristics of Amazon Simple Storage Service (Amazon S3)? (Choose 3 answers)',\n" +
        "  choices: {\n" +
        "    a: 'All objects have a URL.',\n" +
        "    b: 'Amazon S3 can store unlimited amounts of data.',\n" +
        "    c: 'Objects are world-readable by default.',\n" +
        "    d: 'Amazon S3 uses a REST (Representational State Transfer) Application Program Interface (API).',\n" +
        "    e: 'You must pre-allocate the storage in a bucket.'\n" +
        "  },\n" +
        "  answer: ''\n" +
        "},\n" +
        "// Q4\n" +
        "{\n" +
        "  question: 'Which features can be used to restrict access to Amazon Simple Storage Service (Amazon S3) data? (Choose 3 answers)',\n" +
        "  choices: {\n" +
        "    a: 'Enable static website hosting on the bucket.',\n" +
        "    b: 'Create a pre-signed URL for an object.',\n" +
        "    c: 'Use an Amazon S3 Access Control List (ACL) on a bucket or object.',\n" +
        "    d: 'Use a lifecycle policy.',\n" +
        "    e: 'Use an Amazon S3 bucket policy.'\n" +
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

var extractedTextLines = [
    "Review	Questions 1 .	 In	what	ways	does	Amazon	Simple	Storage	Service	(Amazon	S3)	object	storage	differ from	block	and	file	storage?	(Choose	2	answers) A .	 Amazon	S3	stores	data	in	fixed	size	blocks. B .	 Objects	are	identified	by	a	numbered	address. C .	 Objects	can	be	any	size. D .	 Objects	contain	both	data	and	metadata. E .	 Objects	are	stored	in	buckets. 2 .	 Which	of	the	following	are	not	appropriates	use	cases	for	Amazon	Simple	Storage	Service (Amazon	S3)?	(Choose	2	answers) A .	 Storing	web	content B .	 Storing	a	file	system	mounted	to	an	Amazon	Elastic	Compute	Cloud	(Amazon	EC2) instance C .	 Storing	backups	for	a	relational	database D .	 Primary	storage	for	a	database E .	 Storing	logs	for	analytics 3 .	 What	are	some	of	the	key	characteristics	of	Amazon	Simple	Storage	Service	(Amazon S3)?	(Choose	3	answers) A .	 All	objects	have	a	URL. B .	 Amazon	S3	can	store	unlimited	amounts	of	data. C .	 Objects	are	world-readable	by	default. D .	 Amazon	S3	uses	a	REST	(Representational	State	Transfer)	Application	Program Interface	(API). E .	 You	must	pre-allocate	the	storage	in	a	bucket. 4 .	 Which	features	can	be	used	to	restrict	access	to	Amazon	Simple	Storage	Service	(Amazon S3)	data?	(Choose	3	answers) A .	 Enable	static	website	hosting	on	the	bucket. B .	 Create	a	pre-signed	URL	for	an	object. C .	 Use	an	Amazon	S3	Access	Control	List	(ACL)	on	a	bucket	or	object. D .	 Use	a	lifecycle	policy. E .	 Use	an	Amazon	S3	bucket	policy. 5 .	 Your	application	stores	critical	data	in	Amazon	Simple	Storage	Service	(Amazon	S3), which	must	be	protected	against	inadvertent	or	intentional	deletion.	How	can	this	data be	protected?	(Choose	2	answers) ",
    "A .	 Use	cross-region	replication	to	copy	data	to	another	bucket	automatically. B .	 Set	a	vault	lock. C .	 Enable	versioning	on	the	bucket. D .	 Use	a	lifecycle	policy	to	migrate	data	to	Amazon	Glacier. E .	 Enable	MFA	Delete	on	the	bucket. 6 .	 Your	company	stores	documents	in	Amazon	Simple	Storage	Service	(Amazon	S3),	but	it wants	to	minimize	cost.	Most	documents	are	used	actively	for	only	about	a	month,	then much	less	frequently.	However,	all	data	needs	to	be	available	within	minutes	when requested.	How	can	you	meet	these	requirements? A .	 Migrate	the	data	to	Amazon	S3	Reduced	Redundancy	Storage	(RRS)	after	30	days. B .	 Migrate	the	data	to	Amazon	Glacier	after	30	days. C .	 Migrate	the	data	to	Amazon	S3	Standard	–	Infrequent	Access	(IA)	after	30	days. D .	 Turn	on	versioning,	then	migrate	the	older	version	to	Amazon	Glacier. 7 .	 How	is	data	stored	in	Amazon	Simple	Storage	Service	(Amazon	S3)	for	high	durability? A .	 Data	is	automatically	replicated	to	other	regions. B .	 Data	is	automatically	replicated	within	a	region. C .	 Data	is	replicated	only	if	versioning	is	enabled	on	the	bucket. D .	 Data	is	automatically	backed	up	on	tape	and	restored	if	needed. 8 .	 Based	on	the	following	Amazon	Simple	Storage	Service	(Amazon	S3)	URL,	which	one	of the	following	statements	is	correct? https://bucket1.abc.com.s3.amazonaws.com/folderx/myfile.doc A .	 The	object	“myfile.doc”	is	stored	in	the	folder	“folderx”	in	the	bucket “bucket1.abc.com.” B .	 The	object	“myfile.doc”	is	stored	in	the	bucket	“bucket1.abc.com.” C .	 The	object	“folderx/myfile.doc”	is	stored	in	the	bucket	“bucket1.abc.com.” D .	 The	object	“myfile.doc”	is	stored	in	the	bucket	“bucket1.” 9 .	 To	have	a	record	of	who	accessed	your	Amazon	Simple	Storage	Service	(Amazon	S3)	data and	from	where,	you	should	do	what? A .	 Enable	versioning	on	the	bucket. B .	 Enable	website	hosting	on	the	bucket. C .	 Enable	server	access	logs	on	the	bucket. D .	 Create	an	AWS	Identity	and	Access	Management	(IAM)	bucket	policy. E .	 Enable	Amazon	CloudWatch	logs. 10 .	 What	are	some	reasons	to	enable	cross-region	replication	on	an	Amazon	Simple	Storage Service	(Amazon	S3)	bucket?	(Choose	2	answers) ",
    "A .	 You	want	a	backup	of	your	data	in	case	of	accidental	deletion. B .	 You	have	a	set	of	users	or	customers	who	can	access	the	second	bucket	with	lower latency. C .	 For	compliance	reasons,	you	need	to	store	data	in	a	location	at	least	300	miles	away from	the	first	region. D .	 Your	data	needs	at	least	five	nines	of	durability. 11 .	 Your	company	requires	that	all	data	sent	to	external	storage	be	encrypted	before	being sent.	Which	Amazon	Simple	Storage	Service	(Amazon	S3)	encryption	solution	will	meet this	requirement? A .	 Server-Side	Encryption	(SSE)	with	AWS-managed	keys	(SSE-S3) B .	 SSE	with	customer-provided	keys	(SSE-C) C .	 Client-side	encryption	with	customer-managed	keys D .	 Server-side	encryption	with	AWS	Key	Management	Service	(AWS	KMS)	keys	(SSE- KMS) 12 .	 You	have	a	popular	web	application	that	accesses	data	stored	in	an	Amazon	Simple Storage	Service	(Amazon	S3)	bucket.	You	expect	the	access	to	be	very	read-intensive, with	expected	request	rates	of	up	to	500	GETs	per	second	from	many	clients.	How	can you	increase	the	performance	and	scalability	of	Amazon	S3	in	this	case? A .	 Turn	on	cross-region	replication	to	ensure	that	data	is	served	from	multiple locations. B .	 Ensure	randomness	in	the	namespace	by	including	a	hash	prefix	to	key	names. C .	 Turn	on	server	access	logging. D .	 Ensure	that	key	names	are	sequential	to	enable	pre-fetch. 13 .	 What	is	needed	before	you	can	enable	cross-region	replication	on	an	Amazon	Simple Storage	Service	(Amazon	S3)	bucket?	(Choose	2	answers) A .	 Enable	versioning	on	the	bucket. B .	 Enable	a	lifecycle	rule	to	migrate	data	to	the	second	region. C .	 Enable	static	website	hosting. D .	 Create	an	AWS	Identity	and	Access	Management	(IAM)	policy	to	allow	Amazon	S3 to	replicate	objects	on	your	behalf. 14 .	 Your	company	has	100TB	of	financial	records	that	need	to	be	stored	for	seven	years	by law.	Experience	has	shown	that	any	record	more	than	one-year	old	is	unlikely	to	be accessed.	Which	of	the	following	storage	plans	meets	these	needs	in	the	most	cost efficient	manner? A .	 Store	the	data	on	Amazon	Elastic	Block	Store	(Amazon	EBS)	volumes	attached	to t2.micro	instances. B .	 Store	the	data	on	Amazon	Simple	Storage	Service	(Amazon	S3)	with	lifecycle	policies that	change	the	storage	class	to	Amazon	Glacier	after	one	year	and	delete	the	object ",
    "after	seven	years. C .	 Store	the	data	in	Amazon	DynamoDB	and	run	daily	script	to	delete	data	older	than seven	years. D .	 Store	the	data	in	Amazon	Elastic	MapReduce	(Amazon	EMR). 15 .	 Amazon	Simple	Storage	Service	(S3)	bucket	policies	can	restrict	access	to	an	Amazon	S3 bucket	and	objects	by	which	of	the	following?	(Choose	3	answers) A .	 Company	name B .	 IP	address	range C .	 AWS	account D .	 Country	of	origin E .	 Objects	with	a	specific	prefix 16 .	 Amazon	Simple	Storage	Service	(Amazon	S3)	is	an	eventually	consistent	storage	system. For	what	kinds	of	operations	is	it	possible	to	get	stale	data	as	a	result	of	eventual consistency?	(Choose	2	answers) A .	 GET	after	PUT	of	a	new	object B .	 GET	or	LIST	after	a	DELETE C .	 GET	after	overwrite	PUT	(PUT	to	an	existing	key) D .	 DELETE	after	PUT	of	new	object 17 .	 What	must	be	done	to	host	a	static	website	in	an	Amazon	Simple	Storage	Service (Amazon	S3)	bucket?	(Choose	3	answers) A .	 Configure	the	bucket	for	static	hosting	and	specify	an	index	and	error	document. B .	 Create	a	bucket	with	the	same	name	as	the	website. C .	 Enable	File	Transfer	Protocol	(FTP)	on	the	bucket. D .	 Make	the	objects	in	the	bucket	world-readable. E .	 Enable	HTTP	on	the	bucket. 18 .	 You	have	valuable	media	files	hosted	on	AWS	and	want	them	to	be	served	only	to authenticated	users	of	your	web	application.	You	are	concerned	that	your	content	could be	stolen	and	distributed	for	free.	How	can	you	protect	your	content? A .	 Use	static	web	hosting. B .	 Generate	pre-signed	URLs	for	content	in	the	web	application. C .	 Use	AWS	Identity	and	Access	Management	(IAM)	policies	to	restrict	access. D .	 Use	logging	to	track	your	content. 19 .	 Amazon	Glacier	is	well-suited	to	data	that	is	which	of	the	following?	(Choose	2	answers) A .	 Is	infrequently	or	rarely	accessed B .	 Must	be	immediately	available	when	needed ",
    "C .	 Is	available	after	a	three-	to	five-hour	restore	period D .	 Is	frequently	erased	within	30	days 20 .	 Which	statements	about	Amazon	Glacier	are	true?	(Choose	3	answers) A .	 Amazon	Glacier	stores	data	in	objects	that	live	in	archives. B .	 Amazon	Glacier	archives	are	identified	by	user-specified	key	names. C .	 Amazon	Glacier	archives	take	three	to	five	hours	to	restore. D .	 Amazon	Glacier	vaults	can	be	locked. E .	 Amazon	Glacier	can	be	used	as	a	standalone	service	and	as	an	Amazon	S3	storage class. "
];

const expectedQuizJsonForOfficialStudyGuide = "const myQuestions = [\n" +
    "// Q1\n" +
    "{\n" +
    "  question: 'In what ways does Amazon Simple Storage Service (Amazon S3) object storage differ from block and file storage? (Choose 2 answers)',\n" +
    "  choices: {\n" +
    "    a: 'Amazon S3 stores data in fixed size blocks.',\n" +
    "    b: 'Objects are identified by a numbered address.',\n" +
    "    c: 'Objects can be any size.',\n" +
    "    d: 'Objects contain both data and metadata.',\n" +
    "    e: 'Objects are stored in buckets.'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "},\n" +
    "// Q2\n" +
    "{\n" +
    "  question: 'Which of the following are not appropriates use cases for Amazon Simple Storage Service (Amazon S3)? (Choose 2 answers)',\n" +
    "  choices: {\n" +
    "    a: 'Storing web content',\n" +
    "    b: 'Storing a file system mounted to an Amazon Elastic Compute Cloud (Amazon EC2) instance',\n" +
    "    c: 'Storing backups for a relational database',\n" +
    "    d: 'Primary storage for a database',\n" +
    "    e: 'Storing logs for analytics'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "},\n" +
    "// Q3\n" +
    "{\n" +
    "  question: 'What are some of the key characteristics of Amazon Simple Storage Service (Amazon S3)? (Choose 3 answers)',\n" +
    "  choices: {\n" +
    "    a: 'All objects have a URL.',\n" +
    "    b: 'Amazon S3 can store unlimited amounts of data.',\n" +
    "    c: 'Objects are world-readable by default.',\n" +
    "    d: 'Amazon S3 uses a REST (Representational State Transfer) Application Program Interface (API).',\n" +
    "    e: 'You must pre-allocate the storage in a bucket.'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "},\n" +
    "// Q4\n" +
    "{\n" +
    "  question: 'Which features can be used to restrict access to Amazon Simple Storage Service (Amazon S3) data? (Choose 3 answers)',\n" +
    "  choices: {\n" +
    "    a: 'Enable static website hosting on the bucket.',\n" +
    "    b: 'Create a pre-signed URL for an object.',\n" +
    "    c: 'Use an Amazon S3 Access Control List (ACL) on a bucket or object.',\n" +
    "    d: 'Use a lifecycle policy.',\n" +
    "    e: 'Use an Amazon S3 bucket policy.'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "},\n" +
    "// Q5\n" +
    "{\n" +
    "  question: 'Your application stores critical data in Amazon Simple Storage Service (Amazon S3), which must be protected against inadvertent or intentional deletion. How can this data be protected? (Choose 2 answers)',\n" +
    "  choices: {\n" +
    "    a: 'Use cross-region replication to copy data to another bucket automatically.',\n" +
    "    b: 'Set a vault lock.',\n" +
    "    c: 'Enable versioning on the bucket.',\n" +
    "    d: 'Use a lifecycle policy to migrate data to Amazon Glacier.',\n" +
    "    e: 'Enable MFA Delete on the bucket.'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "},\n" +
    "// Q6\n" +
    "{\n" +
    "  question: 'Your company stores documents in Amazon Simple Storage Service (Amazon S3), but it wants to minimize cost. Most documents are used actively for only about a month, then much less frequently. However, all data needs to be available within minutes when requested. How can you meet these requirements?',\n" +
    "  choices: {\n" +
    "    a: 'Migrate the data to Amazon S3 Reduced Redundancy Storage (RRS) after 30 days.',\n" +
    "    b: 'Migrate the data to Amazon Glacier after 30 days.',\n" +
    "    c: 'Migrate the data to Amazon S3 Standard – Infrequent Access (IA) after 30 days.',\n" +
    "    d: 'Turn on versioning, then migrate the older version to Amazon Glacier.'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "},\n" +
    "// Q7\n" +
    "{\n" +
    "  question: 'How is data stored in Amazon Simple Storage Service (Amazon S3) for high durability?',\n" +
    "  choices: {\n" +
    "    a: 'Data is automatically replicated to other regions.',\n" +
    "    b: 'Data is automatically replicated within a region.',\n" +
    "    c: 'Data is replicated only if versioning is enabled on the bucket.',\n" +
    "    d: 'Data is automatically backed up on tape and restored if needed.'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "},\n" +
    "// Q8\n" +
    "{\n" +
    "  question: 'Based on the following Amazon Simple Storage Service (Amazon S3) URL, which one of the following statements is correct? https://bucket1.abc.com.s3.amazonaws.com/folderx/myfile.doc',\n" +
    "  choices: {\n" +
    "    a: 'The object “myfile.doc” is stored in the folder “folderx” in the bucket “bucket1.abc.com.”',\n" +
    "    b: 'The object “myfile.doc” is stored in the bucket “bucket1.abc.com.”',\n" +
    "    c: 'The object “folderx/myfile.doc” is stored in the bucket “bucket1.abc.com.”',\n" +
    "    d: 'The object “myfile.doc” is stored in the bucket “bucket1.”'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "},\n" +
    "// Q9\n" +
    "{\n" +
    "  question: 'To have a record of who accessed your Amazon Simple Storage Service (Amazon S3) data and from where, you should do what?',\n" +
    "  choices: {\n" +
    "    a: 'Enable versioning on the bucket.',\n" +
    "    b: 'Enable website hosting on the bucket.',\n" +
    "    c: 'Enable server access logs on the bucket.',\n" +
    "    d: 'Create an AWS Identity and Access Management (IAM) bucket policy.',\n" +
    "    e: 'Enable Amazon CloudWatch logs.'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "},\n" +
    "// Q10\n" +
    "{\n" +
    "  question: 'What are some reasons to enable cross-region replication on an Amazon Simple Storage Service (Amazon S3) bucket? (Choose 2 answers)',\n" +
    "  choices: {\n" +
    "    a: 'You want a backup of your data in case of accidental deletion.',\n" +
    "    b: 'You have a set of users or customers who can access the second bucket with lower latency.',\n" +
    "    c: 'For compliance reasons, you need to store data in a location at least 300 miles away from the first region.',\n" +
    "    d: 'Your data needs at least five nines of durability.'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "},\n" +
    "// Q11\n" +
    "{\n" +
    "  question: 'Your company requires that all data sent to external storage be encrypted before being sent. Which Amazon Simple Storage Service (Amazon S3) encryption solution will meet this requirement?',\n" +
    "  choices: {\n" +
    "    a: 'Server-Side Encryption (SSE) with AWS-managed keys (SSE-S3)',\n" +
    "    b: 'SSE with customer-provided keys (SSE-C)',\n" +
    "    c: 'Client-side encryption with customer-managed keys',\n" +
    "    d: 'Server-side encryption with AWS Key Management Service (AWS KMS) keys (SSE- KMS)'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "},\n" +
    "// Q12\n" +
    "{\n" +
    "  question: 'You have a popular web application that accesses data stored in an Amazon Simple Storage Service (Amazon S3) bucket. You expect the access to be very read-intensive, with expected request rates of up to 500 GETs per second from many clients. How can you increase the performance and scalability of Amazon S3 in this case?',\n" +
    "  choices: {\n" +
    "    a: 'Turn on cross-region replication to ensure that data is served from multiple locations.',\n" +
    "    b: 'Ensure randomness in the namespace by including a hash prefix to key names.',\n" +
    "    c: 'Turn on server access logging.',\n" +
    "    d: 'Ensure that key names are sequential to enable pre-fetch.'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "},\n" +
    "// Q13\n" +
    "{\n" +
    "  question: 'What is needed before you can enable cross-region replication on an Amazon Simple Storage Service (Amazon S3) bucket? (Choose 2 answers)',\n" +
    "  choices: {\n" +
    "    a: 'Enable versioning on the bucket.',\n" +
    "    b: 'Enable a lifecycle rule to migrate data to the second region.',\n" +
    "    c: 'Enable static website hosting.',\n" +
    "    d: 'Create an AWS Identity and Access Management (IAM) policy to allow Amazon S3 to replicate objects on your behalf.'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "},\n" +
    "// Q14\n" +
    "{\n" +
    "  question: 'Your company has 100TB of financial records that need to be stored for seven years by law. Experience has shown that any record more than one-year old is unlikely to be accessed. Which of the following storage plans meets these needs in the most cost efficient manner?',\n" +
    "  choices: {\n" +
    "    a: 'Store the data on Amazon Elastic Block Store (Amazon EBS) volumes attached to t2.micro instances.',\n" +
    "    b: 'Store the data on Amazon Simple Storage Service (Amazon S3) with lifecycle policies that change the storage class to Amazon Glacier after one year and delete the object after seven years.',\n" +
    "    c: 'Store the data in Amazon DynamoDB and run daily script to delete data older than seven years.',\n" +
    "    d: 'Store the data in Amazon Elastic MapReduce (Amazon EMR).'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "},\n" +
    "// Q15\n" +
    "{\n" +
    "  question: 'Amazon Simple Storage Service (S3) bucket policies can restrict access to an Amazon S3 bucket and objects by which of the following? (Choose 3 answers)',\n" +
    "  choices: {\n" +
    "    a: 'Company name',\n" +
    "    b: 'IP address range',\n" +
    "    c: 'AWS account',\n" +
    "    d: 'Country of origin',\n" +
    "    e: 'Objects with a specific prefix'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "},\n" +
    "// Q16\n" +
    "{\n" +
    "  question: 'Amazon Simple Storage Service (Amazon S3) is an eventually consistent storage system. For what kinds of operations is it possible to get stale data as a result of eventual consistency? (Choose 2 answers)',\n" +
    "  choices: {\n" +
    "    a: 'GET after PUT of a new object',\n" +
    "    b: 'GET or LIST after a DELETE',\n" +
    "    c: 'GET after overwrite PUT (PUT to an existing key)',\n" +
    "    d: 'DELETE after PUT of new object'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "},\n" +
    "// Q17\n" +
    "{\n" +
    "  question: 'What must be done to host a static website in an Amazon Simple Storage Service (Amazon S3) bucket? (Choose 3 answers)',\n" +
    "  choices: {\n" +
    "    a: 'Configure the bucket for static hosting and specify an index and error document.',\n" +
    "    b: 'Create a bucket with the same name as the website.',\n" +
    "    c: 'Enable File Transfer Protocol (FTP) on the bucket.',\n" +
    "    d: 'Make the objects in the bucket world-readable.',\n" +
    "    e: 'Enable HTTP on the bucket.'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "},\n" +
    "// Q18\n" +
    "{\n" +
    "  question: 'You have valuable media files hosted on AWS and want them to be served only to authenticated users of your web application. You are concerned that your content could be stolen and distributed for free. How can you protect your content?',\n" +
    "  choices: {\n" +
    "    a: 'Use static web hosting.',\n" +
    "    b: 'Generate pre-signed URLs for content in the web application.',\n" +
    "    c: 'Use AWS Identity and Access Management (IAM) policies to restrict access.',\n" +
    "    d: 'Use logging to track your content.'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "},\n" +
    "// Q19\n" +
    "{\n" +
    "  question: 'Amazon Glacier is well-suited to data that is which of the following? (Choose 2 answers)',\n" +
    "  choices: {\n" +
    "    a: 'Is infrequently or rarely accessed',\n" +
    "    b: 'Must be immediately available when needed',\n" +
    "    c: 'Is available after a three- to five-hour restore period',\n" +
    "    d: 'Is frequently erased within 30 days'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "},\n" +
    "// Q20\n" +
    "{\n" +
    "  question: 'Which statements about Amazon Glacier are true? (Choose 3 answers)',\n" +
    "  choices: {\n" +
    "    a: 'Amazon Glacier stores data in objects that live in archives.',\n" +
    "    b: 'Amazon Glacier archives are identified by user-specified key names.',\n" +
    "    c: 'Amazon Glacier archives take three to five hours to restore.',\n" +
    "    d: 'Amazon Glacier vaults can be locked.',\n" +
    "    e: 'Amazon Glacier can be used as a standalone service and as an Amazon S3 storage class.'\n" +
    "  },\n" +
    "  answer: ''\n" +
    "}];"
;
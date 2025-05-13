
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  isMember: 'isMember',
  role: 'role',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StudyMaterialScalarFieldEnum = {
  id: 'id',
  cId: 'cId',
  studyType: 'studyType',
  topic: 'topic',
  difficultyLevel: 'difficultyLevel',
  status: 'status',
  courseLayout: 'courseLayout',
  createdBy: 'createdBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CourseScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  title: 'title',
  description: 'description',
  imageUrl: 'imageUrl',
  price: 'price',
  isPublished: 'isPublished',
  categoryId: 'categoryId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CategoryScalarFieldEnum = {
  id: 'id',
  name: 'name'
};

exports.Prisma.AttachmentScalarFieldEnum = {
  id: 'id',
  name: 'name',
  url: 'url',
  courseId: 'courseId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ChapterScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  videoUrl: 'videoUrl',
  position: 'position',
  isPublished: 'isPublished',
  isFree: 'isFree',
  quizId: 'quizId',
  courseId: 'courseId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.QuizScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  chapterId: 'chapterId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MuxDataScalarFieldEnum = {
  id: 'id',
  assetId: 'assetId',
  playbackId: 'playbackId',
  chapterId: 'chapterId'
};

exports.Prisma.QuestionScalarFieldEnum = {
  id: 'id',
  quizId: 'quizId',
  text: 'text',
  questionType: 'questionType',
  points: 'points',
  position: 'position',
  correctAnswer: 'correctAnswer',
  explanation: 'explanation',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OptionScalarFieldEnum = {
  id: 'id',
  questionId: 'questionId',
  text: 'text',
  isCorrect: 'isCorrect',
  position: 'position',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserProgressScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  chapterId: 'chapterId',
  quizScore: 'quizScore',
  isCompleted: 'isCompleted',
  attempts: 'attempts',
  bestScore: 'bestScore',
  lastAttemptAt: 'lastAttemptAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PurchaseScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  courseId: 'courseId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StripeCustomerScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  stripeCustomer: 'stripeCustomer',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TeacherQualificationScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  fileUrl: 'fileUrl',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.UserOrderByRelevanceFieldEnum = {
  name: 'name',
  email: 'email'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.StudyMaterialOrderByRelevanceFieldEnum = {
  cId: 'cId',
  studyType: 'studyType',
  topic: 'topic',
  difficultyLevel: 'difficultyLevel',
  status: 'status',
  createdBy: 'createdBy'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.CourseOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  title: 'title',
  description: 'description',
  imageUrl: 'imageUrl',
  categoryId: 'categoryId'
};

exports.Prisma.CategoryOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name'
};

exports.Prisma.AttachmentOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name',
  url: 'url',
  courseId: 'courseId'
};

exports.Prisma.ChapterOrderByRelevanceFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  videoUrl: 'videoUrl',
  quizId: 'quizId',
  courseId: 'courseId'
};

exports.Prisma.QuizOrderByRelevanceFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  chapterId: 'chapterId'
};

exports.Prisma.MuxDataOrderByRelevanceFieldEnum = {
  id: 'id',
  assetId: 'assetId',
  playbackId: 'playbackId',
  chapterId: 'chapterId'
};

exports.Prisma.QuestionOrderByRelevanceFieldEnum = {
  id: 'id',
  quizId: 'quizId',
  text: 'text',
  questionType: 'questionType',
  correctAnswer: 'correctAnswer',
  explanation: 'explanation'
};

exports.Prisma.OptionOrderByRelevanceFieldEnum = {
  id: 'id',
  questionId: 'questionId',
  text: 'text'
};

exports.Prisma.UserProgressOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  chapterId: 'chapterId'
};

exports.Prisma.PurchaseOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  courseId: 'courseId'
};

exports.Prisma.StripeCustomerOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  stripeCustomer: 'stripeCustomer'
};

exports.Prisma.TeacherQualificationOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  fileUrl: 'fileUrl'
};
exports.UserRole = exports.$Enums.UserRole = {
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER'
};

exports.Prisma.ModelName = {
  User: 'User',
  StudyMaterial: 'StudyMaterial',
  Course: 'Course',
  Category: 'Category',
  Attachment: 'Attachment',
  Chapter: 'Chapter',
  Quiz: 'Quiz',
  MuxData: 'MuxData',
  Question: 'Question',
  Option: 'Option',
  UserProgress: 'UserProgress',
  Purchase: 'Purchase',
  StripeCustomer: 'StripeCustomer',
  TeacherQualification: 'TeacherQualification'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)

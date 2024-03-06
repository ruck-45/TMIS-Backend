let lastResetDate = new Date().getUTCDate();
let registerCounter = 0;
let jobCounter = 0;
let applicantCounter = 0;
let resumeCounter = 0;
const updateRegisterCounter = (req, res, next) => {
  registerCounter += 1;
  const currentDay = new Date().getUTCDate();

  if (currentDay !== lastResetDate) {
    registerCounter = 1;
    lastResetDate = currentDay;
  }

  req.body.registerCounter = registerCounter;
  next();
};

const updateJobRegisterCounter = (req, res, next) => {
  jobCounter += 1;
  const currentDay = new Date().getUTCDate();

  if (currentDay !== lastResetDate) {
    jobCounter = 1;
    lastResetDate = currentDay;
  }

  req.body.jobCounter = jobCounter;
  next();
};

const updateApplicantRegisterCounter = (req, res, next) => {
  applicantCounter += 1;
  const currentDay = new Date().getUTCDate();

  if (currentDay !== lastResetDate) {
    applicantCounter = 1;
    lastResetDate = currentDay;
  }

  req.body.applicantCounter = applicantCounter;
  next();
};


module.exports = {
  updateRegisterCounter,
  updateJobRegisterCounter,
  updateApplicantRegisterCounter,
};

const express = require('express'),
  router = express.Router(),
  {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
  } = require('../controllers/jobs');

router.route('/').get(getAllJobs).post(createJob);
router.route('/:jobId').get(getJob).patch(updateJob).delete(deleteJob);

module.exports = router;

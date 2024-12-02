const Job = require('../models/Job'),
  { StatusCodes } = require('http-status-codes'),
  { BadRequestError, NotFoundError } = require('../errors');

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt');
  res.status(StatusCodes.OK).json({ count: jobs.length, jobs });
};
const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { jobId },
  } = req;
  const jobFound = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  });
  if (!jobFound) {
    throw new NotFoundError('No job found for the provided ID');
  }
  res.status(StatusCodes.OK).json({ jobFound });
};
const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};
const updateJob = async (req, res) => {
  const {
    user: { userId },
    params: { jobId },
    body: { company, position },
  } = req;
  const jobFound = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  });
  if (!jobFound) {
    throw new NotFoundError('No job found for the provided ID');
  }
  if (company === '' || position === '') {
    throw new BadRequestError('Company and position are required');
  }
  const updatedJob = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    { company, position },
    { new: true, runValidators: true }
  );
  res.status(StatusCodes.OK).json(updatedJob);
};
const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { jobId },
  } = req;
  const deletedJob = await Job.findByIdAndDelete({
    _id: jobId,
    createdBy: userId,
  });
  if (!deletedJob) {
    throw new NotFoundError('No job found for the provided ID');
  }
  res.status(StatusCodes.OK).json({ deletedJob });
};
module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};

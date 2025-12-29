import Enquiry from "../models/enquiry.js";

export const createEnquiry = async (req, res) => {
  const enquiry = await Enquiry.create(req.body);
  res.json(enquiry);
};

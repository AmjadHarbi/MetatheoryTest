const MeetingHistory = require('../../model/schema/meeting')
const mongoose = require('mongoose');

const add = async (req, res) => {
   try {
    console.log('Incoming meeting:', req.body);

    const meeting = new MeetingHistory(req.body);
    await meeting.save();

    console.log('Meeting successfully saved:', meeting);

    res.status(201).json({ message: 'Perfect, Meeting created successfully', meeting });
  } catch (error) {
    console.error('Sorry, there is error in creating meeting:', error.message);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
}

const index = async (req, res) => {
   try {
    const meetings = await MeetingHistory.find({ deleted: false }).sort({ dateTime: -1 });
    console.log("✅ Populated Meeting:", meetings[0]);
  res.status(200).json({ data: Array.isArray(meetings) ? meetings : Object.values(meetings) });
    // res.status(200).json({ data: meetings });
  } catch (error) {
    console.error("Error fetching meetings:", error);
    res.status(500).json({ message: "Failed to fetch meetings" });
  }
}

const view = async (req, res) => {
     try {
    const meetings = await MeetingHistory.find({ deleted: false })
      .populate('attendes', 'name email') 
      .populate('attendesLead', 'name email')
      .populate('createBy', 'username email')
      .sort({ timestamp: -1 });

    res.status(200).json({ meetings });
  } catch (error) {
    console.error("Error fetching meetings:", error);
    res.status(500).json({ error: "Failed to fetch meetings" });
  }
}

const deleteData = async (req, res) => {
  try {
    const result = await MeetingHistory.updateOne(
      { _id: req.params.id },
      { $set: { deleted: true } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Meeting not found or already deleted' });
    }

    res.status(200).json({ message: 'Meeting deleted successfully' });
  } catch (error) {
    console.error("Error deleting meeting:", error);
    res.status(500).json({ error: 'Failed to delete meeting' });
  }
}

const deleteMany = async (req, res) => {
      try {
    const meetingIds = req.body; //array

    if (!Array.isArray(meetingIds) || meetingIds.length === 0) {
      return res.status(400).json({ message: 'Invalid request: meeting IDs required' });
    }

    const result = await MeetingHistory.updateMany(
      { _id: { $in: meetingIds } },
      { $set: { deleted: true } }
    );

    res.status(200).json({
      message: `${result.modifiedCount} meeting(s) deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting multiple meetings:", error);
    res.status(500).json({ error: 'Failed to delete meetings' });
  }
}

module.exports = { add, index, view, deleteData, deleteMany }
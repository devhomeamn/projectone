const Record = require('../models/recordModel');
const Section = require('../models/sectionModel');
const Subcategory = require('../models/subcategoryModel');

// ✅ Add new record
exports.addRecord = async (req, res) => {
  try {
    const { file_name, section_id, subcategory_id, rack_no, description, added_by } = req.body;

    const record = await Record.create({
      file_name,
      section_id,
      subcategory_id,
      rack_no,
      description,
      added_by
    });

    res.json({ message: '✅ Record added successfully', record });
  } catch (err) {
    console.error('❌ addRecord error:', err);
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get all records (with section & subcategory)
exports.getRecords = async (req, res) => {
  try {
    const records = await Record.findAll({
      include: [Section, Subcategory],
      order: [['id', 'DESC']]
    });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// ✅ Move record to central record room
exports.moveToCentral = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await Record.findByPk(id);

    if (!record) return res.status(404).json({ error: 'Record not found' });

    record.is_moved_to_central = true;
    await record.save();

    res.json({ message: '✅ Record moved to Central Record Room', record });
  } catch (err) {
    console.error('❌ moveToCentral error:', err);
    res.status(400).json({ error: err.message });
  }
};

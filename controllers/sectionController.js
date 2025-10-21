const Section = require('../models/sectionModel');
const Subcategory = require('../models/subcategoryModel');

exports.getSections = async (req, res) => {
  try {
    const sections = await Section.findAll({
      include: [{ model: Subcategory }]
    });
    res.json(sections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.addSection = async (req, res) => {
  try {
    const { name, description } = req.body;
    const section = await Section.create({ name, description });
    res.json(section);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.addSubcategory = async (req, res) => {
  try {
    const { sectionId, name } = req.body;
    const sub = await Subcategory.create({ section_id: sectionId, name });
    res.json(sub);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

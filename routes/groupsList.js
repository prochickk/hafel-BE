const express = require("express");
const router = express.Router();

const Regions = require('../module/Regions');

router.get("/", async (req, res) => {

    try {
        console.log('universities22')
        const groupsRawLists = await Regions.find({name :{$exists: true},section : {$exists: true},university : {$exists: true}})

        // Extract Unique Values with IDs from Array of Objects

        const uniqueNamesWithIds = [];
        const uniqueSectionssWithIds = [];
        const uniqueUniversitiesWithIds = [];

        groupsRawLists.forEach((obj) => {
        const { id, name, section, university } = obj;

        // Check for unique names
        const existingNameObject = uniqueNamesWithIds.find((item) => item.name === name);
        if (!existingNameObject) {
            uniqueNamesWithIds.push({ id, name });
        }

        // Check for unique Sectionss
        const existingSectionsObject = uniqueSectionssWithIds.find((item) => item.section === section);
        if (!existingSectionsObject) {
            uniqueSectionssWithIds.push({ id, section });
        }

        // Check for unique Universities
        const existingUniversitiesObject = uniqueUniversitiesWithIds.find((item) => item.university === university);
        if (!existingUniversitiesObject) {
            uniqueUniversitiesWithIds.push({ id, university });
        }
        });

        const groupsLists = {
                regions: uniqueNamesWithIds,
                sections: uniqueSectionssWithIds,
                universities: uniqueUniversitiesWithIds,
            }
       
        
        res.send(groupsLists);

    } catch (error) {
      console.log(error.message)
      return res.status(404).send(error.message)
    }
  });



module.exports = router;


const seedData = require('../../data/seedData.json');

const express = require('express');
const router = express.Router();

const snippets = seedData;

router.get('/',(req,res) =>{
    res.json(snippets)
})
router.post('/',(req,res)=>{
    const {language,code} = req.body;
    const newSnippet = {id:snippets.length+1,language,code};
    snippets.push(newSnippet);
    res.status(201).json(newSnippet)
})
router.get('/:id',(req,res) =>{
    const snippet = snippets.find(s=>s.id === parseInt(req.params.id))
    if(!snippet){
        res.status(404).send('snippet not found')
    }
    res.json(snippet);
})

module.exports = router;
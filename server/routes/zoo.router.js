const express = require('express');
const router = express.Router();
const pool = require('../modules/pool.js');

const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

router.get('/', (req, res) => {
    const sqlText = 'select species.species_name, class.class_name, species.id from species join class on species.class_id = class.id;'
    pool.query(sqlText)
        .then((response) => {
            res.send(response.rows)
        })
        .catch((error) => {
            console.log('error getting animals', error)
            res.sendStatus(500)
        })
});

router.post('/', (req, res) => {
    const sqlText = 'insert into species (species_name, class_id) values ($1, $2)';
    const sqlValues = [req.body.species_name, req.body.class_id]
    pool.query(sqlText, sqlValues)
        .then((response) => {
            res.sendStatus(201)
        })
        .catch((error) => {
            console.log('error adding new species', error)
            res.sendStatus(500)
        })
})

router.put('/:id', (req, res) => {
    console.log('req.params.id is:', req.params.id)
    const sqlText = `delete from species where species.id = $1`;
    const sqlData = [req.params.id]
    pool.query(sqlText, sqlData)
        .then((response) => {
            res.sendStatus(200)
        })
        .catch((error) => {
            console.log('error deleting animal', error)
            res.sendStatus(500)
        })
})

module.exports = router;
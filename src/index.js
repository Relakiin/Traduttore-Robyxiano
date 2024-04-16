import express from 'express'
import { translate } from './translate.js'

const app = express()
app.set('view engine', 'pug')
app.use(express.json())
app.use(
    express.urlencoded({
        extended: true,
    })
)

app.get('/', function (req, res) {
    let normalValue = req.query.normal
    let translateValue = req.query.translate
    let normToTra = true
    //way = true > Italiano - Robi | way = false > Robi - Italiano
    if (req.query.way === 'false') {
        normToTra = false
    }

    res.render('index', {
        normalValue: normalValue,
        translateValue: translateValue,
        normToTra: normToTra,
    })
})

app.post('/translate', function (req, res) {
    let normalValue = req.body.normal
    let translateValue = req.body.translate

    let normToTra = true
    if (!req.body.currentway) {
        normToTra = false
    }
    let newWay = !normToTra

    /*     console.log('\n###REQUEST BODY: ' + JSON.stringify(req.body))
    console.log('Testo normale: ' + normalValue)
    console.log('Testo tradotto: ' + translateValue)
    console.log('normToTra: ' + normToTra)
    console.log('New way: ' + newWay)
    console.log('Traduci? ' + req.body.traduci)
    console.log('Inverti? ' + req.body.inverti)
    console.log('\n') */

    if (req.body.traduci == undefined) {
        //inverti verso traduzione
        console.log(newWay ? "VERSO ATTUALE: DA ITALIANO A ROBY" : "VERSO ATTUALE: DA ROBY A ITALIANO")
        res.redirect(
            '/?normal=' +
                normalValue +
                '&translate=' +
                translateValue +
                '&way=' +
                newWay
        )
    } else {

        normToTra
            ? (translateValue = translate(normalValue, normToTra))
            : (normalValue = translate(translateValue, normToTra))

        res.redirect(
            '/?normal=' +
                normalValue +
                '&translate=' +
                translateValue +
                '&way=' +
                normToTra
        )
    }
})

app.listen(8080)

import { vocali, vocabolario, banned } from './constants.js'
export function translate(text, normToTra) {
    let finalString = ''
    let lineArray = text.split('\r\n')
    let regex = /\b\w+\b/gi
    const arrayIta = Array.from(vocabolario.keys())
    const arrayRob = Array.from(vocabolario.values())
    const fullArrayRob = []
    arrayRob.forEach((wordArray) => {
        wordArray.forEach((word) => {
            fullArrayRob.push(word)
        })
    })

    //MAPPA DEL VOCABOLARIO

    //KEYS
    //le key sono le parole in italiano che vanno rimpiazzate. sono tutte string eccetto quando bisogna trovare una frase con 2 o piu parole, in quel caso
    //è un array di string che corrispondono alle parole individuali in sequenza.

    //ESEMPIO: [ ['test', ['fatti', 'sotto']], ['appresentati'] ] => questo sostituirà la parola 'test' con 'appresentati'
    //e attiverà il controllo per la parola 'fatti' siccome non è una string ma un array

    //idea: ricavare un array di parole dalla regex e controllare la parola successiva.
    //ESEMPIO: "fatti sotto" => "appresentati"
    //array: ciao, fatti, sotto, ciao
    //trovata parola "fatti". la parola all'indice successivo è "sotto"?
    //si = sostituisci "fatti" e "sotto" nell'array con "appresentati"
    //no = aggiungi x

    //ESEMPIO: "ciao matteo" => "ciaox piccolo matt"
    //matteo è una chiave alla quale corrispondono: [ 'matteino', ['piccolo', 'matt'] ]
    //controlla se l'indice scelto dal randomizer corrisponde ad un array
    //si = sostituisci "matteo" con i contenuti dell'array
    //no = sostituisci "matteo" con la string corrispondente

    //VALUES
    //le values sono le parole in robyxiano che corrispondono all'italiano. ad ogni key corrisponde un array di string, che contiene tutte
    //traduzioni valide per quella parola, la traduzione viene scelta in modo randomico.

    //idea: nell'array di string aggiungere un ulteriore array per quando ad una parola corrisponde una frase.
    //ESEMPIO: Matteo => Piccolo Matt
    //a 'matteo' corrispondono: [ 'matteino', ['piccolo', 'matt'] ]

    //array frase esempio: ciaox, piccolo, matt, come, vax
    //la parola "piccolo" corrisponde al primo indice dell'array piccolo matt. la parola dopo è matt?
    //si = rimpiazza "piccolo" e "matt" con "matteo"
    //no = segui la logica normale

    if (normToTra) {
        console.log('\nDA NORMALE A TRADOTTO\n')
        //splitta il testo in righe
        console.log('### RIGHE TESTO: ' + lineArray.length)

        lineArray.forEach((line) => {
            //RIMPIAZZA LE PAROLE

            for (let [wordIta, wordRob] of vocabolario.entries()) {
                line = line.replaceAll(regex, (wordFound) => {
                    let replacingWord = wordFound

                    if (
                        !banned.includes(wordFound.toLowerCase()) &&
                        !arrayIta.includes(wordFound.toLowerCase()) &&
                        !fullArrayRob.includes(wordFound.toLowerCase()) &&
                        vocali.includes(replacingWord.slice(-1).toLowerCase())
                    ) {
                        replacingWord += 'x'
                    } else if (wordFound.toLowerCase() === wordIta.toLowerCase()) {
                        let index = Math.floor(Math.random() * wordRob.length)
                        let dictionaryWord = wordRob[index]
                        if (wordFound.charAt(0) === wordFound.charAt(0).toUpperCase()) {
                            dictionaryWord = dictionaryWord.charAt(0).toUpperCase() + dictionaryWord.slice(1)
                        }
                        console.log('[ DICTIONARY RANDOM SEED: ' + index)
                        console.log('Replacing -> ' + wordFound + ' <- with -> ' + dictionaryWord + ' <- ]')
                        replacingWord = dictionaryWord
                    }

                    return replacingWord
                })
            }

            finalString += line + '\n'
        })

        text = finalString.slice(0, -1)
        console.log('Frase tradotta: ' + text)
    } else {
        console.log('\nDA TRADOTTO A NORMALE\n')

        lineArray.forEach((line) => {
            for (let [wordIta, wordRob] of vocabolario.entries()) {
                //lo sto hardcodeando non mi interessa!!!!
                let ascii = line.replace(/ /gi, '%20')
                let replace = ascii.replace(/piccolo%20matt/gi, 'Matteo')
                line = replace.replace(/%20/gi, ' ')

                line = line.replaceAll(regex, (wordFound) => {
                    let replacingWord = wordFound

                    wordRob.forEach((word) => {
                        if (replacingWord.toLowerCase() === word.toLowerCase()) {
                            let dictionaryWord = wordIta
                            if (replacingWord.charAt(0) === replacingWord.charAt(0).toUpperCase()) {
                                dictionaryWord = dictionaryWord.charAt(0).toUpperCase() + dictionaryWord.slice(1)
                            }

                            console.log('[ Replacing -> ' + wordFound + ' <- with -> ' + dictionaryWord + ' <- ]')
                            replacingWord = dictionaryWord
                        } else if (replacingWord.slice(-1) === 'x' && !fullArrayRob.includes(replacingWord)) {
                            replacingWord = replacingWord.slice(0, -1)
                        }
                    })

                    return replacingWord
                })
            }
            finalString += line + '\n'
        })

        text = finalString.slice(0, -1)
        console.log('Frase tradotta: ' + text)
    }

    return text
}

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

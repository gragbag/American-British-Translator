const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')
const britishToAmericanSpelling = Object.fromEntries(Object.entries(americanToBritishSpelling).map(([key, value]) => [value, key]));

class Translator {
    americanToBritish(text) {
        let splitText = text.match(/\b(\w+)\b/g);

        for (let i = 0; i < splitText.length; i++) {
            let currentWord = splitText[i];
            let twoWordTest = (i < splitText.length - 1) ? currentWord + " " + splitText[i + 1] : "";
            let threeWordTest = (i < splitText.length - 2) ? twoWordTest + " " + splitText[i + 2] : "";

            let translatedWord = currentWord;

            let lowerCaseWord = currentWord.toLowerCase();
            let lowerCaseTest2 = twoWordTest.toLowerCase();
            let lowerCaseTest3 = threeWordTest.toLowerCase();
            
            translatedWord = this.checkBritishTranslations(lowerCaseWord);
            let translatedTest2 = this.checkBritishTranslations(lowerCaseTest2);
            let translatedTest3 = this.checkBritishTranslations(lowerCaseTest3);


            if (translatedTest3 && translatedTest3 !== lowerCaseTest3) {
                translatedWord = '<span class="highlight">' + translatedTest3 + '</span>';
                text = text.replaceAll(threeWordTest, translatedWord);
            } else if (translatedTest2 && translatedTest2 !== lowerCaseTest2) {
                translatedWord = '<span class="highlight">' + translatedTest2 + '</span>';
                text = text.replaceAll(twoWordTest, translatedWord);
            } else if (translatedWord !== lowerCaseWord) {
                let titleCheck = translatedWord;
                let textToBeReplaced = currentWord;
                translatedWord = '<span class="highlight">' + translatedWord + '</span>';

                if (titleCheck.charAt(0) === titleCheck.charAt(0).toUpperCase()) {
                    textToBeReplaced += ".";
                }

                text = text.replaceAll(textToBeReplaced, translatedWord);
            }
        }

        text = this.translateToBritishTime(text);

        return text;
    }

    britishToAmerican(text) {
        let splitText = text.match(/\b(\w)+\b/g);

        for (let i = 0; i < splitText.length; i++) {
            let currentWord = splitText[i];
            let twoWordTest = (i < splitText.length - 1) ? currentWord + " " + splitText[i + 1] : "";
            let threeWordTest = (i < splitText.length - 2) ? twoWordTest + " " + splitText[i + 2] : "";

            let translatedWord = currentWord;

            let lowerCaseWord = currentWord.toLowerCase();
            let lowerCaseTest2 = twoWordTest.toLowerCase();
            let lowerCaseTest3 = threeWordTest.toLowerCase();
            
            translatedWord = this.checkAmericanTranslations(lowerCaseWord);
            let translatedTest2 = this.checkAmericanTranslations(lowerCaseTest2);
            let translatedTest3 = this.checkAmericanTranslations(lowerCaseTest3);

            if (translatedTest3 && translatedTest3 !== lowerCaseTest3) {
                translatedWord = '<span class="highlight">' + translatedTest3 + '</span>';
                text = text.replaceAll(threeWordTest, translatedWord);
            } else if (translatedTest2 && translatedTest2 !== lowerCaseTest2) {
                translatedWord = '<span class="highlight">' + translatedTest2 + '</span>';
                text = text.replaceAll(twoWordTest, translatedWord);
            } else if (translatedWord !== lowerCaseWord) {
                translatedWord = '<span class="highlight">' + translatedWord + '</span>';
                text = text.replaceAll(currentWord, translatedWord);
            }
        }

        text = this.translateToAmericanTime(text);

        return text;
    }

    checkBritishTranslations(word) {
        if (!word) {
            return;
        }

        let britishTranslation = word;

        britishTranslation = this.translateToBritish(word);

        if (britishTranslation === word) {
            britishTranslation = this.translateToBritishSpelling(word);
        }

        if (britishTranslation === word) {
            britishTranslation = this.translateToBritishTitles(word);
        }
        
        return britishTranslation;
    }

    translateToBritish(word) {
        let britishWord = word;
        if (americanOnly.hasOwnProperty(word)) {
            britishWord = americanOnly[word];
        }

        return britishWord
    }

    translateToBritishSpelling(word) {
        let britishSpelling = word;
        if (americanToBritishSpelling.hasOwnProperty(word)) {
            britishSpelling = americanToBritishSpelling[word];
        }

        return britishSpelling;
    }

    translateToBritishTitles(word) {
        let britishTitle = word;

        let americanTitle = word + ".";

        if (americanToBritishTitles.hasOwnProperty(americanTitle)) {
            britishTitle = americanToBritishTitles[americanTitle];
            britishTitle = britishTitle.charAt(0).toUpperCase() + britishTitle.slice(1);
        }

        return britishTitle;
    }

    translateToBritishTime(text) {
        const timeMatches = text.matchAll(/(\d?\d):(\d\d)/g);
        let match = timeMatches.next();
        while (!match.done) {
            text = text.replaceAll(match.value[0], '<span class="highlight">' + match.value[1] + '.' + match.value[2] + '</span>');
            match = timeMatches.next();
        }

        return text;
    }

    checkAmericanTranslations(word) {
        if (!word) {
            return;
        }


        let amercianTranslation = word;

        amercianTranslation = this.translateToAmerican(word);

        if (amercianTranslation === word) {
            amercianTranslation = this.translateToAmericanSpelling(word);
        }

        if (amercianTranslation === word) {
            amercianTranslation = this.translateToAmericanTitles(word);
        }
        
        return amercianTranslation;
    }

    translateToAmerican(word) {
        let americanWord = word;
        if (britishOnly.hasOwnProperty(word)) {
            americanWord = britishOnly[word];
        }

        return americanWord;
    }

    translateToAmericanSpelling(word) {
        let americanSpelling = word;

        if (britishToAmericanSpelling.hasOwnProperty(word)) {
            americanSpelling = britishToAmericanSpelling[word];
        }

        return americanSpelling;
    }

    translateToAmericanTitles(word) {
        let americanTitle = word;
        let titleCheck = word + ".";

        if (americanToBritishTitles.hasOwnProperty(titleCheck)) {
            americanTitle = titleCheck;
            americanTitle = americanTitle.charAt(0).toUpperCase() + americanTitle.slice(1);
        }

        return americanTitle;
    }

    translateToAmericanTime(text) {
        const timeMatches = text.matchAll(/(\d?\d).(\d\d)/g);
        let match = timeMatches.next();
        while (!match.done) {
            text = text.replaceAll(match.value[0], '<span class="highlight">' + match.value[1] + ':' + match.value[2] + '</span>');
            match = timeMatches.next();
        }

        return text;
    }
}

module.exports = Translator;
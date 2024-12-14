const fs = require('fs');
const path = require("path");

function removeFromString(str, filterArray) {
    let regex = new RegExp("\\b" + filterArray.join('|') + "\\b", "gi")
    return str.replace(regex, '')
}

function sortArrayByLength(arr, descending = false) {
    return arr.sort(function (a, b) {
        if (descending)
            return b.length - a.length || b.localeCompare(a);
        else
            return a.length - b.length || a.localeCompare(b);
    });
}

function toLowerCaseArray(items) {
    var lowerCaseItems = [];
    for (var i = 0; i < items.length; i++) {
        lowerCaseItems.push(items[i].toLowerCase());
    }

    return lowerCaseItems;
}

function trimChar(origString, charToTrim) {
    // Escape special characters for use in a regular expression
    charToTrim = charToTrim.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    var regEx = new RegExp("^[" + charToTrim + "]+|[" + charToTrim + "]+$", "g");
    return origString.replace(regEx, "");
};

function cleanFileName(string) {
    let wordsFilter = ['x264', 'x265', 'H264', 'WEBRip', '1080p', '1080', '720p', '720',
        '480p', 'WEB', 'CAKES', 'VXT', 'BluRay', 'HardSub', 'SoftSub', '10bit', 'AAC', 'Subbed', 'Sub',
        'DL', 'BrRip', 'DVDrip', '6CH', 'PSA', 'HEVC', '2CH', 'NF', 'Pahe', 'AM', 'webdl', 'web-dl', 'DH',
        'com', 'ir', 'AAC5.1', 'AAC5', 'rmt', 'Farsi', 'Dubbed'],

        siteNamesFilter = ['RARBG', 'Film2Media', 'Film2Movie', 'My-Film', 'MovieCottage', 'DonyayeSerial', 'UPTV.co',
            'SkyFilm', 'DigiMoviez', 'Film9', 'AioFilm', 'YIFY', 'FilmKio', 'Film2serial', 'sorenfilm',
            'AioFilm.com', 'AvaMovie', 'HexDL.com', 'Hex', 'ZarFilm', 'Nikimovie', 'AceMovies', 'SubsPlease', 'YTS.MX'];

    wordsFilter = toLowerCaseArray(sortArrayByLength(wordsFilter, true));
    siteNamesFilter = sortArrayByLength(siteNamesFilter, true);

    //string = removeFromString(string, wordsFilter);
    string = removeFromString(string, siteNamesFilter);

    //string = string.split(/(?=[A-Z])/);
    //string = string.join('-');

    string = string
        .trim()
        .replace(/\.+/g, ' ')
        //.replace(/\-+/g, ' ')
        .replace(/\_+/g, ' ')
        //.toLowerCase()
        //.replace(/ /g, '-')
        .replace(/[^A-Za-z0-9- ]/g, '')
        .replace(/\s+/g, ' ')
        .replace(/[S|s]?0*(\d+)?[E|e]0*(\d+)/g, function (v) { return v.toUpperCase(); })
        .trim();

    let words = string.split(" "),
        cleanWords = [];

    words = words.filter(function (el) {
        return el != null;
    });

    for (let i = 0; i < words.length; i++) {
        if (!wordsFilter.includes(words[i].toLowerCase()))
            cleanWords.push(words[i][0].toUpperCase() + words[i].substr(1));
    }

    words = cleanWords.join(" ").trim();
    for (i = 1; i <= 3; i++) {
        words = (trimChar(words, '-')).trim();
    }
    return words;
}

document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

document.addEventListener('drop', (event) => {
    event.preventDefault();
    event.stopPropagation();

    let fileArr = [],
        fileListMessage = document.getElementById('file-list');

    fileListMessage.innerText = 'Renaming...';

    for (const f of event.dataTransfer.files) {
        if (!(fs.lstatSync(f.path).isDirectory() || fs.lstatSync(f.path).isFile()))
            continue;

        let fileParse = path.parse(f.path),
            fileName = fileParse.name,
            fileExt = fileParse.ext;

        if (fs.lstatSync(f.path).isDirectory()) {
            fileName += fileExt;
            fileExt = '';
        }

        let newFileName = cleanFileName(fileName);

        if (newFileName != fileName) {
            fs.rename(f.path, fileParse.dir + path.sep + newFileName + fileExt, function (err) {
                if (err)
                    fileListMessage.innerText = err
            });

            fileArr.push(f.path);
        }
    }

    setTimeout(function () {
        if (fileListMessage.innerText == 'Renaming...')
            fileListMessage.innerText = `Rename ${fileArr.length} File/Directory`;
    }, 1000);
});

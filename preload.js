const fs = require('fs');
const path = require("path");

function removeFromString(arr, str) {
    let regex = new RegExp("\\b" + arr.join('|') + "\\b", "gi")
    return str.replace(regex, '')
}

function trimChar(origString, charToTrim) {
    // Escape special characters for use in a regular expression
    charToTrim = charToTrim.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    var regEx = new RegExp("^[" + charToTrim + "]+|[" + charToTrim + "]+$", "g");
    return origString.replace(regEx, "");
};

function cleanFileName(string) {
    let wordFilter = ['RARBG', 'x264', 'x265', 'H264', 'WEBRip', '1080p', '720p',
        '480p', 'WEB', 'CAKES', 'VXT', 'BluRay', 'SoftSub', '10bit', 'AAC', 'Sub',
        'DL', 'BrRip', 'DVDrip', '6CH'],
        siteNameFilter = ['Film2Media', 'Film2Movie', 'My-Film', 'MovieCottage', 'DonyayeSerial', 'UPTV.co', 'SkyFilm', 'DigiMoviez', 'Film9', 'AioFilm', 'com', 'ir', 'YIFY', 'FilmKio', 'Film2serial'];

    string = removeFromString(wordFilter, string);
    string = removeFromString(siteNameFilter, string);

    // string = string.split(/(?=[A-Z])/);
    // string = string.join('-');

    string = string
        .trim()
        .replace(/\.+/g, ' ')
        //.replace(/\-+/g, ' ')
        .replace(/\_+/g, ' ')
        // .toLowerCase()
        .replace(/[^A-Za-z0-9- ]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    let words = string.split(" ");

    words = words.filter(function (el) {
        return el != null;
    });

    for (let i = 0; i < words.length; i++) {
        if (words[i][0])
            words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }

    words = words.join(" ");
    words = (trimChar(words, '-')).trim();

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

        if (newFileName != fileName + fileExt) {
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

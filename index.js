const request = require('request');
const {parse} = require('node-html-parser');
const fs = require('fs'); 

const { Wilma2SID } = require('./auth.json');
const { resolve } = require('path');

const getSubjectList = () => {
    return new Promise((resolve, reject) => {
        request(`https://espoo.inschool.fi/catalog/`, {
            'method': 'GET',
            'headers': {
                'Cookie': `Wilma2SID=${Wilma2SID}`
            },
            'followRedirect': false
        }, (err, res) => {
            if (err) throw err; // top-tier error handling [if Wilma is down handling is our least worry]
            if(res.statusCode != 200) return reject({err: 'failed to fetch data', status: res.statusCode});
            const result = {}

            const document = parse(res.body);
            document.getElementsByTagName('tr').filter(tr => tr.childNodes.length == 5).forEach(tr => {
                const [code, name] = tr.childNodes.filter(td => td.textContent.trim());

                result[`[${code.textContent.trim()}] ${name.textContent.trim()}`] = {
                    hash: name.childNodes[0].attrs['href'].split('/').reverse()[0]
                }
            })
            return resolve(result);
        });
    })
}

const fetchCourses = (hash) => {
    return new Promise((resolve, reject) => {
        request(`https://espoo.inschool.fi/catalog/${hash}`, {
            'method': 'GET',
            'headers': {
                'Cookie': `Wilma2SID=${Wilma2SID}`
            },
            'followRedirect': false
        }, (err, res) => {
            if (err) throw err; // top-tier error handling [if Wilma is down handling is our least worry]
            if(res.statusCode != 200) return reject({err: 'failed to fetch data', status: res.statusCode});
            const result = {}

            const document = parse(res.body);
            document.getElementsByTagName('tr').filter(tr => tr.childNodes.length == 5).forEach(tr => {
                const [code, name] = tr.childNodes.filter(td => td.textContent.trim());

                if(code.attrs['class'].split(' ').length > 0) {
                    result[code.textContent.trim()] = {
                        hash: name.childNodes[0].attrs['href'].split('/').reverse()[0],
                        name: name.textContent.trim(),
                        type: code.attrs['class'].split(' ')[0].trim().replace('cc-c', 'c-type')
                    }
                }
            })
            return resolve(result);
        });
    });
}

const fetchCourse = (hash) => {
    return new Promise((resolve, reject) => {
        request(`https://espoo.inschool.fi/catalog/${hash}`, {
            'method': 'GET',
            'headers': {
                'Cookie': `Wilma2SID=${Wilma2SID}`
            },
            'followRedirect': false
        }, (err, res) => {
            if (err) throw err;
            const result = {}

            const document = parse(res.body);
            if(code.attrs['class'].split(' ').length > 0) {
                document.getElementsByTagName('table')[1].getElementsByTagName('tr').forEach(tr => {
                    const [key, raw] = tr.childNodes;
                    const value = raw.textContent.trim();
                    result[key.textContent.trim()] = !Number.isNaN(Number.parseFloat(value)) ? Number.parseFloat(value) : value;
                })
            }

            // Why is this even a thing?
            delete result['Ilmoittautuneita'];

            return resolve(result);
        });
    })
}


const main = async () => {
    getSubjectList()
    .then(async (map) => {
        for await (const subject of Object.keys(map)) {
            const courses = await fetchCourses(map[subject].hash);

            for await (const code of Object.keys(courses)) {
                courses[code] = {...courses[code], ...(await fetchCourse(courses[code].hash))};
                console.log([subject, code])
            }

            map[subject] = courses;
            
            console.log(subject);
        }
        fs.writeFileSync('./lops.json', JSON.stringify(map), {encoding: 'utf-8'});
        console.log('Done!');
    })
}

main();
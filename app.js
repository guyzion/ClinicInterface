const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!');
    console.log('hiiiiii');
    var fs = require('fs');
    fs.readFile('ex.txt', 'utf8', function(err, data) {
        if (err) throw err;
        console.log(data);
        var json = {};
        var fields = ['date', 'hour', 'num', 'gk', 'clinic_status','pharm_status', 'family_doctor', 'nurse', 'kids_doctor', 'ladies_doctor'];
        fields.forEach(field =>{
            var end = data.indexOf(';');
            var val = data.substring(0, end);
            json[field] = val;
            data = data.substring(end+1, data.length);
        })
        var to_send = JSON.stringify(json);
        fs.writeFileSync('to_send.json', to_send);
    });

});

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`))
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(express.static('foto'));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pbo5'
});

connection.connect((err) => {
    if(err) {
        console.error("Terjadi kesalahan dalam kondeksi ke MySQL:", err.stack);
        return;
    }
    console.log("Koneksi MySQL berhasil dengan id" + connection.threadId)
});

app.set('view engine', 'ejs');

//(Create, Read, Update, Delete)

app.get('/', (req, res) => {
   const query = 'SELECT * FROM pulau'; 
   connection.query(query, (err, results) => {
        res.render('index', {pulau:results});
   });
});

app.post('/add', (req, res) => {
    const {name, lokasi, harga, phone} = req.body;
    const query = 'INSERT INTO pulau (name, lokasi, harga, phone) VALUES (?,?,?,?)';
    connection.query(query, [name, lokasi, harga, phone], (err, result) => {
        if (err) {
            console.error("Terjadi kesalahan saat menambahkan data:", err);
            return res.status(500).send("Gagal menambahkan data");
        }
        res.redirect('/');
    });
});


app.get('/edit/:id', (req, res) => {
    const query = 'SELECT * FROM pulau WHERE id = ?';
    connection.query(query, [req.params.id], (err, result) => {
        if (err) throw err;
        res.render('edit', {pulau:result[0]});
    });
})

app.post('/update/:id', (req, res) =>{
    const {name, lokasi, harga, phone} = req.body;
    const query = 'UPDATE pulau SET name = ?, lokasi = ?, harga = ?, phone = ? WHERE id = ?';
    connection.query(query,[name, lokasi, harga, phone, req.params.id], (err, result) =>{
        if (err) throw err;
        res.redirect('/');
    });
})

app.get('/delete/:id', (req, res) => {
    const query = 'DELETE FROM pulau WHERE id = ?';
    connection.query(query, [req.params.id], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
})

app.listen(3000,() =>{
    console.log("Server berjalan di prt 3000, buka web melalui http://localhost:3000 ")
});
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();

// MongoDB bağlantısı için gerekli olan URI adresi
const MONGODB_URI = 'mongodb://localhost/chatgpt';

// MongoDB'ye bağlanmak için mongoose kullanıyoruz
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB bağlantısı başarılı'))
    .catch((error) => console.log('MongoDB bağlantısı başarısız', error));

// Kullanıcı modeli için mongoose şeması oluşturuyoruz
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
});

// Kullanıcı modeli oluşturuyoruz
const User = mongoose.model('User', userSchema);

// Kullanıcının oturum açmasını sağlayacak olan JWT doğrulama mekanizması
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        req.user = user;
        next();
    });
};

// Yeni kullanıcı kaydı oluşturma işlemi
app.post('/register', async (req, res) => {
    try {
        // Kullanıcı parolasını bcrypt ile şifreliyoruz
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Kullanıcı bilgilerini MongoDB veritabanına kaydediyoruz
        const user = new User({
            username: req.body.username,
            password: hashedPassword,
        });

        await user.save();
        res.status(201).send('Kayıt başarılı');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Kullanıcının oturum açma işlemi
app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username }).exec();

        if (!user) {
            return res.status(400).send('Kullanıcı bulunamadı');
        }

        // Kullanıcının girdiği parolayı, MongoDB'de kayıtlı olan bcrypt ile şifreli parola ile karşılaştırıyoruz
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);

        // Şifre eşleşmiyorsa 401 hatası döndürüyoruz
        if (!passwordMatch) {
            return res.status(401).send('Parola yanlış');
        }

        // Kullanıcı adı ve şifre doğru ise JWT token oluşturuyoruz
        const accessToken = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        res.json({ accessToken: accessToken });
    } catch (error) {
        res.status(400).send(error.message);
    }
});



const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const officialController = require('../controllers/officialController');
const authMiddleware = require('../middlewares/authMiddleware');
const permissionMiddleware = require('../middlewares/verifierPermission');

// Configuration multer pour l'upload officiel : images + PDF
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, 'official-' + uniqueSuffix + ext);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Seules les images et les PDF sont acceptés.'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10 Mo max (PDF)
});

// Accepte le champ historique 'image' (+ 'images') jusqu'à 20 images, et 'pdf' / 'file' (PDF)
const uploadOfficial = upload.fields([
    { name: 'image', maxCount: 20 },
    { name: 'images', maxCount: 20 },
    { name: 'pdf', maxCount: 1 },
    { name: 'file', maxCount: 1 },
]);

// Flux officiel (auth requis)
router.get('/', authMiddleware, officialController.getOfficials);
router.get('/:id', authMiddleware, officialController.getOfficialById);
// Publication officielle : permission publish_official (Admin uniquement)
router.post('/', authMiddleware, permissionMiddleware('publish_official'), uploadOfficial, officialController.createOfficial);
router.put('/:id', authMiddleware, permissionMiddleware('publish_official'), officialController.updateOfficial);
router.delete('/:id', authMiddleware, permissionMiddleware('publish_official'), officialController.deleteOfficial);

// Erreurs multer (filtre type / taille) → réponse JSON propre
router.use((err, req, res, next) => {
    if (err && res.headersSent) {
        return next(err);
    }
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: "Le fichier ne peut pas dépasser 10 Mo." });
        }
        return res.status(400).json({ message: err.message });
    }
    if (err && err.message === 'Seules les images et les PDF sont acceptés.') {
        return res.status(400).json({ message: err.message });
    }
    next(err);
});

module.exports = router;
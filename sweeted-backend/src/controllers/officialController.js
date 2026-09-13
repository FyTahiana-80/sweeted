const Officiel = require('../models/official');
const OfficielImage = require('../models/officialImage');
const File = require('../models/file');
const Notification = require('../models/notification');
const path = require('path');
const fs = require('fs');
const xss = require('xss');

const EXTRAIT_MAX = 120;
const MAX_IMAGES = 20;

// Fichiers uploadés par multer : compat single ('image') + fields ('image'/'pdf'/'file')
function getUploadedFiles(req) {
    if (req.file) return [req.file];
    if (Array.isArray(req.files)) return req.files;
    if (req.files && typeof req.files === 'object') {
        return [...(req.files.image || []), ...(req.files.images || []), ...(req.files.pdf || []), ...(req.files.file || [])];
    }
    return [];
}

function cleanupFiles(files) {
    for (const f of files) {
        try {
            if (f && f.path && fs.existsSync(f.path)) fs.unlinkSync(f.path);
        } catch (ignored) {}
    }
}

exports.getOfficials = async (req, res) => {
    try {
        const officials = await Officiel.findAll();
        res.status(200).json(officials);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des publications officielles.", error });
    }
};

exports.getOfficialById = async (req, res) => {
    try {
        const official = await Officiel.findByIdWithFiles(req.params.id);
        if (!official) {
            return res.status(404).json({ message: "Publication officielle introuvable." });
        }
        res.status(200).json(official);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de la publication officielle.", error });
    }
};

exports.createOfficial = async (req, res) => {
    const uploaded = getUploadedFiles(req);
    const imageFiles = uploaded.filter(f => f.mimetype && f.mimetype.startsWith('image/')).slice(0, MAX_IMAGES);
    const pdfFile = uploaded.find(f => f.mimetype === 'application/pdf') || null;
    try {
        const { content } = req.body;

        if (!content?.trim() && imageFiles.length === 0 && !pdfFile) {
            cleanupFiles(uploaded);
            return res.status(400).json({ message: "La publication doit contenir du texte, des images ou un PDF." });
        }
        if (content && content.length > 2000) {
            cleanupFiles(uploaded);
            return res.status(400).json({ message: "Le contenu ne peut pas dépasser 2000 caractères." });
        }
        if (uploaded.filter(f => f.mimetype && f.mimetype.startsWith('image/')).length > MAX_IMAGES) {
            cleanupFiles(uploaded);
            return res.status(400).json({ message: `Maximum ${MAX_IMAGES} images par publication.` });
        }

        const sanitizedContent = content ? xss(content.trim()) : '';

        // Compat : la 1re image reste dans Officiel.image_url, toutes vont en Officiel_images
        let imageUrl = null;
        if (imageFiles.length > 0) {
            imageUrl = `/uploads/${imageFiles[0].filename}`;
        }

        const result = await Officiel.create(req.user.id, sanitizedContent, imageUrl);
        const officialId = result.insertId;

        for (let i = 0; i < imageFiles.length; i++) {
            await OfficielImage.create(officialId, `/uploads/${imageFiles[i].filename}`, i);
        }

        // PDF joint : stocké sur disque (multer) + référencé en table `file`
        if (pdfFile) {
            await File.createOfficialAttachment(req.user.id, {
                originalname: pdfFile.originalname,
                mimetype: pdfFile.mimetype,
                size: pdfFile.size,
                path: `/uploads/${pdfFile.filename}`,
                officialId,
            });
        }

        const extrait = sanitizedContent
            ? (sanitizedContent.length > EXTRAIT_MAX ? sanitizedContent.slice(0, EXTRAIT_MAX) + '...' : sanitizedContent)
            : (imageFiles.length > 0 ? `Nouvelle publication officielle avec ${imageFiles.length} image(s).` : (pdfFile ? `Nouveau document officiel : ${pdfFile.originalname}` : 'Nouvelle publication officielle de la Direction ISPM.'));
        await Notification.fanOut('official', extrait, officialId);

        res.status(201).json({ message: "Publication officielle créée !", id: officialId });
    } catch (error) {
        cleanupFiles(uploaded);
        res.status(500).json({ message: "Erreur lors de la création de la publication officielle.", error });
    }
};

exports.updateOfficial = async (req, res) => {
    try {
        const { id } = req.params;
        const { content, is_pinned } = req.body;

        const official = await Officiel.findById(id);
        if (!official) {
            return res.status(404).json({ message: "Publication officielle introuvable." });
        }
        if (!content?.trim()) {
            return res.status(400).json({ message: "Le contenu ne peut pas être vide." });
        }
        if (content.length > 2000) {
            return res.status(400).json({ message: "Le contenu ne peut pas dépasser 2000 caractères." });
        }

        await Officiel.update(id, xss(content.trim()), is_pinned ? 1 : 0);
        res.status(200).json({ message: "Publication officielle mise à jour !" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de la publication officielle.", error });
    }
};

exports.deleteOfficial = async (req, res) => {
    try {
        const { id } = req.params;

        const official = await Officiel.findById(id);
        if (!official) {
            return res.status(404).json({ message: "Publication officielle introuvable." });
        }

        if (official.image_url) {
            const imagePath = path.join(__dirname, '..', '..', official.image_url);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // Supprime les images multiples (disque + table Officiel_images)
        await OfficielImage.deleteByOfficial(official.id);
        // Supprime aussi les PDF / fichiers joints (disque + table `file`)
        await File.deleteByOfficial(official.id);
        await Notification.deleteByOfficialPost(id);
        await Officiel.delete(id);
        res.status(200).json({ message: "Publication officielle supprimée !" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de la publication officielle.", error });
    }
};
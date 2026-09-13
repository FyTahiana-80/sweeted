const Post = require('../models/post');
const PostImage = require('../models/postImage');
const File = require('../models/file');
const path = require('path');
const fs = require('fs');
const xss = require('xss');

const MAX_IMAGES = 20;

function uploadedFiles(req) {
    if (!req.files) return [];
    if (Array.isArray(req.files)) return req.files;
    return [...(req.files.image || []), ...(req.files.images || []), ...(req.files.file || [])];
}

exports.createPost = async (req, res) => {
    try {
        const { content } = req.body;
        const userId = req.user.id;
        const all = uploadedFiles(req);
        const imageFiles = all.filter(f => f.mimetype && f.mimetype.startsWith('image/'));
        const attachment = req.files && req.files.file ? req.files.file[0] : null;

        const cleanup = () => {
            all.forEach(file => {
                if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);
            });
        };

        if (!content?.trim() && imageFiles.length === 0 && !attachment) {
            cleanup();
            return res.status(400).json({ message: "Le post doit contenir du texte, des images ou un PDF." });
        }
        if (content && content.length > 2000) {
            cleanup();
            return res.status(400).json({ message: "Le contenu ne peut pas dépasser 2000 caractères." });
        }
        if (imageFiles.length > MAX_IMAGES) {
            cleanup();
            return res.status(400).json({ message: `Maximum ${MAX_IMAGES} images par post.` });
        }
        if (imageFiles.some(f => f.size > 5 * 1024 * 1024)) {
            cleanup();
            return res.status(400).json({ message: "Chaque image ne peut pas dépasser 5 Mo." });
        }

        const sanitizedContent = content ? xss(content.trim()) : '';

        // Compat : la 1re image reste dans Posts.image_url, toutes vont en Post_images
        let imageUrl = null;
        if (imageFiles.length > 0) {
            imageUrl = `/uploads/${imageFiles[0].filename}`;
        }

        const postResult = await Post.create(userId, sanitizedContent, imageUrl);

        for (let i = 0; i < imageFiles.length; i++) {
            await PostImage.create(postResult.insertId, `/uploads/${imageFiles[i].filename}`, i);
        }

        if (attachment) {
            await File.createPostAttachment(userId, {
                originalname: attachment.originalname,
                mimetype: attachment.mimetype,
                size: attachment.size,
                path: `/uploads/${attachment.filename}`,
                postId: postResult.insertId
            });
        }

        res.status(201).json({ message: "Post créé avec succès !", id: postResult.insertId });
    } catch (error) {
        if (req.files) {
            uploadedFiles(req).forEach(file => {
                if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);
            });
        }
        res.status(500).json({ message: "Erreur lors de la création du post.", error });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;
        const userId = req.user ? req.user.id : null;
        const posts = await Post.findAll(limit, offset, userId);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des posts.", error });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user ? req.user.id : null;
        const post = await Post.findById(id, userId);
        if (!post) {
            return res.status(404).json({ message: "Post non trouvé." });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du post.", error });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        if (!content?.trim()) {
            return res.status(400).json({ message: "Le contenu du post ne peut pas être vide." });
        }
        if (content.length > 2000) {
            return res.status(400).json({ message: "Le contenu ne peut pas dépasser 2000 caractères." });
        }

        const post = await Post.findById(id);
        if (!post || post.id_user !== userId) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier ce post." });
        }

        const sanitizedContent = xss(content.trim());
        await Post.update(id, sanitizedContent);
        res.status(200).json({ message: "Post mis à jour avec succès !" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du post.", error });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const post = await Post.findById(id);
        const isOwner = post && post.id_user === userId;
        const isMod = ['Admin', 'Modérateur'].includes(req.user.role);
        if (!post || (!isOwner && !isMod)) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer ce post." });
        }

        if (post.image_url) {
            const imagePath = path.join(__dirname, '..', '..', post.image_url);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // Supprime les images multiples (disque + table Post_images)
        await PostImage.deleteByPost(post.id);
        await File.deleteByPost(id);
        await Post.delete(id);
        res.status(200).json({ message: "Post supprimé avec succès !" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du post.", error });
    }
};

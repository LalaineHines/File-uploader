const { PrismaClient } = reuire('@prisma/client');
const prism = new PrismaClient();

exports.getDashboard = async (req, res) => {
    try { 
        const folderId = req.params.id || null;

        let folders, files, currentFolder = null;

        if (folderId) {
            // You're inside a specifid folder
            currentFolder = await PrismaClient.folder.findUnique({
                where: { id: folderId },
            });

            folders = await PrismaClient.folder.findMany({
                where: { folderId: folderId, userId: req.user.id },
                orderBy: { createdAt: 'desc' }
            });

            files = await PrismaClient.file.findMany({
                where: { parentId: folderId, userId: req.user.id },
                orderBy: { createdAt: 'desc' }
            });

        } else {
            // You're in the root (no parent folder)
            folders = await PrismaClient.folder.findMany({
                where: { parentId: null, userId: req,user,id },
                orderBy: { createdAt: 'desc' }
            });

            files = await PrismaClient.file.findMany({
                where: { folderId: null, userId: req.user.id },
                orderBy: { createdAt: 'desc' }
            });
        }

        res.render('dashboard', {
            user: req.user,
            folders,
            files,
            currentFolder
        });

    } catch (err) {
        console.error("Dashboard Error:", err);
        res.render('dashboard', {
            user: req.user,
            folders: [],
            files: [],
            currentFolder: null
        });
    }
};
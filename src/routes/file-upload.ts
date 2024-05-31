import { Router, Request, Response } from 'express';
import fs from 'fs';
import multer, { DiskStorageOptions, MulterRequest } from 'multer';

const router = Router();

const UPLOAD_DESTINATION = 'public';

const storage = multer.diskStorage({
    destination: (req: Request, file, cb: (error: Error | null, destination: string) => void) => {
        let destination : string = UPLOAD_DESTINATION;

        if (req.query.destination) {
            destination += req.query.destination
        }

        if (!fs.existsSync(destination)) {
            fs.mkdirSync(destination, { recursive: true });
        }

        cb(null, destination);
    },
    filename: (req: Request, file, cb: (error: Error | null, filename: string) => void) => {
        const ext = file.originalname.split('.').pop();
        cb(null, `${Date.now()}.${ext}`);
    },
});

const upload = multer({ storage });

router.post('/', upload.single('file'), (req: MulterRequest, res: Response) => {
    try {
        const fileUrl = `${req.protocol}://${req.get('host')}/${req.file.path}`;
        res.status(200).send({ url: fileUrl });
    } catch(error) {
        res.status(500).json({ message: 'File upload failed' });
    }
});

export default router;

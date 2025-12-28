import { UnprocessableEntityException } from "@nestjs/common";
import { existsSync, mkdirSync } from "fs";
import { diskStorage } from "multer";

const multerOptions = {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = "uploads/images";
        if (!existsSync(uploadPath)) {
          mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
      }
    }),
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (["jpg", "jpeg"].some(mimetype => `image/${mimetype}` === file.mimetype)) {
        return cb(null, true);
      } else {
        cb(new UnprocessableEntityException("Wrong file type"), false);
      }
    },
  };

  export default multerOptions;
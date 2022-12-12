import { faker } from '@faker-js/faker';

export function editFileName(req, file: Express.Multer.File, callback) {
  const name = faker.random.alphaNumeric(20);
  const fileExt = file.originalname.split('.').pop();
  const filename = name + '.' + fileExt;
  // console.log(file.filename);
  callback(null, filename);
}

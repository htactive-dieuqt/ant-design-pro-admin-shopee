import request from 'umi-request';
import { firebaseDB, firebaseStorage } from '@/Firebase/firebase';

export async function queryRule() {
  let dataSource = [];
  const ref = await firebaseDB.ref('products');
  ref.on('value', (snapshot) => {
    const result = snapshot.val();
    dataSource = Object.keys(result).map((key) => ({ id: key, ...result[key] }));
  });
  const pageSize = 10;
  return {
    data: dataSource,
    total: 100,
    success: true,
    pageSize,
    current: 0,
  };
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'delete' },
  });
}

export async function addRule(params) {
  const ref = await firebaseDB.ref('products');
  ref.push({
    ...params,
  });
}

export async function addImage(image) {
  const uploadTask = firebaseStorage.ref(`/images_Product/${image.uid}/`).put(image);
  await uploadTask.on(
    'state_changed',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (snapshot) => {
      // eslint-disable-next-line no-console
      console.log(snapshot);
    },
    (error) => {
      // eslint-disable-next-line no-console
      console.log(error, 'dieu');
    },
    () => {
      firebaseStorage
        .ref('/images_Product')
        .child(image.uid)
        .getDownloadURL()
        .then((url) => {
          // eslint-disable-next-line no-console
          console.log(url);
        });
    },
  );
}

export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'update' },
  });
}

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
  console.log(image.id);
  const uploadTask = await firebaseStorage.ref(`images_Category/${image.id}`).put(image);
  uploadTask.on(
    'state_change',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (snapshot) => {
      console.log(snapshot.val());
    },
    (error) => {
      console.log(error, 'hello');
    },
    () => {
      firebaseStorage
        .ref('images_Category')
        .child(image.id)
        .getDownloadURL()
        .then((url) => {
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

import request from 'umi-request';
import { firebaseDB, firebaseStorage } from '@/Firebase/firebase';

export async function queryRule() {
  let dataSource = [];
  const ref = await firebaseDB.ref('category');
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

export async function removeRule(key) {
  key.find((item) => item.id === key);
  if (key) {
    await firebaseDB.ref(`category/`).child(key).remove();
  }
}

export async function addRule(a) {
  const ref = await firebaseDB.ref('category');
  ref.push({
    ...a,
  });
}

export async function addImage(image) {
  const uploadTask = firebaseStorage.ref(`/images_Category/${image.uid}/`).put(image);
  await uploadTask.on(
    'state_changed',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (snapshot) => {
      console.log(snapshot);
    },
    (error) => {
      console.log(error, 'hello');
    },
    () => {
      firebaseStorage
        .ref('/images_Category')
        .child(image.uid)
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

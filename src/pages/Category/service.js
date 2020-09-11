import request from 'umi-request';
import { firebaseDB } from '@/Firebase/firebase';

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
  // const ref = await firebaseDB.ref('category');
  // ref.child(key).remove();
}

export async function addRule(a) {
  const ref = await firebaseDB.ref('category');
  ref.push({
    ...a,
  });
}

export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'update' },
  });
}

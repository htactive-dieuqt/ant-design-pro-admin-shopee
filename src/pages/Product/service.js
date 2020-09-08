import request from 'umi-request';
import {firestore} from '@/Firebase';

export async function queryRule() {
  const productRef = await firestore.collection('productVd')
  .get()
  .then(pro => {
      return pro.docs.map(doc => {
          return {
              key: doc.id,
              ...doc.data()
          };
      });
  });
  return productRef;
}
export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'delete' },
  });
}
export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'post' },
  });
}
export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'update' },
  });
}

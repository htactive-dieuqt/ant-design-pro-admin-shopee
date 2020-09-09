import request from 'umi-request';
// import { firebaseDB } from '@/Firebase/firebase';

export async function queryRule(params) {
  return request('/api/rule', {
    params,
  });
  // const productRef = await firebaseDB.ref('productVd')
  //   .get()
  //   .then(pro => {
  //     return pro.docs.map(doc => {
  //       return {
  //         key: doc.id,
  //         ...doc.data()
  //       };
  //     });
  //   });
  // return productRef;


  // const ref = await firebaseDB.ref('productVd');
  // ref.on('value', (snapshot) => {
  //   const stated = snapshot.val();
  //   if (stated) {
      // console.log(stated);
      //  return stated;
  //   }
  // })
  // console.log('ref',ref);

  //   })

  //   console.log('productRef',productRef);
  // return productRef;
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

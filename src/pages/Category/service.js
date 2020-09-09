import request from 'umi-request';
import { firebaseDB } from '@/Firebase/firebase';

export async function queryRule() {
  let dataSource = []
  const ref = await firebaseDB.ref('category');
  ref.on('value', (snapshot) => {
    const result = snapshot.val();
    dataSource = Object.keys(result).map(key => ({ id: key, ...result[key] }))
  })
  const pageSize = 10;
  return {
    data: dataSource,
    total: 100,
    success: true,
    pageSize,
    current: 1,
  };
}
export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'delete' },
  });
}

export async function addRule() {
  const ref = await firebaseDB.ref('category');

  ref.onSnapshot(snapshot => {
    const categories = [];
    snapshot.forEach(doc => {
      const category = doc.data();
      category.id = doc.id;
      if (!category.completed) categories.push(category);
    });
  })
}

// export async function addRule( ) {
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const initialTutorialState = {
//   id: null,
//   category: ''
// }

// const newTodoItem = {
//   // eslint-disable-next-line no-undef
//   category: category.name
// }

// const ref = await firebaseDB.ref('category');
// ref.add(newTodoItem)
//   .then((doc) => {
//     const responseTodoItem = newTodoItem;
//     responseTodoItem.id = doc.id;
//     return response.json(responseTodoItem); 
//   })
//   .catch((err) => {
//     console.error(err);
//   });
// }

export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'update' },
  });
}

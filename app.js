// Paste your firebaseConfig here from the Firebase console
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  const taskInput = document.getElementById('taskInput');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const taskList = document.getElementById('taskList');
  
  // Add task
  addTaskBtn.addEventListener('click', () => {
    const task = taskInput.value.trim();
    if(task) {
      db.collection('tasks').add({
        text: task,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      taskInput.value = '';
    }
  });
  
  // Real-time listener for tasks
  db.collection('tasks').orderBy('timestamp')
    .onSnapshot(snapshot => {
      taskList.innerHTML = ''; // Clear the list
      snapshot.forEach(doc => {
        const li = document.createElement('li');
        li.textContent = doc.data().text;
  
        // Add delete button
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.style.marginLeft = '10px';
        delBtn.onclick = () => {
          db.collection('tasks').doc(doc.id).delete();
        };
  
        li.appendChild(delBtn);
        taskList.appendChild(li);
      });
    });
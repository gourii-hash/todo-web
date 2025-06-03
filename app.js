document.addEventListener('DOMContentLoaded', () => {
  const firebaseConfig = {
    apiKey: "AIzaSyAi2A5pVPcyc0nKnmAXW2m_NP8sHLVzpm4",
    authDomain: "todo-firebase-demo-f60e7.firebaseapp.com",
    projectId: "todo-firebase-demo-f60e7",
    storageBucket: "todo-firebase-demo-f60e7.appspot.com",
    messagingSenderId: "193519005562",
    appId: "1:193519005562:web:fd2da723a5d9a2888170c3",
    measurementId: "G-6MLW3PQ6Q5"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const auth = firebase.auth();
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const signupBtn = document.getElementById('signupBtn');
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const authSection = document.getElementById('authSection');
  const appSection = document.getElementById('appSection');
  const taskInput = document.getElementById('taskInput');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const taskList = document.getElementById('taskList');

  logoutBtn.style.backgroundColor = '#dc3545';
  logoutBtn.style.marginLeft = '10px';
  logoutBtn.style.borderRadius = '5px';
  logoutBtn.style.padding = '10px';
  logoutBtn.style.border = 'none';
  logoutBtn.style.color = 'white';
  logoutBtn.style.cursor = 'pointer';

  signupBtn.addEventListener('click', () => {
    auth.createUserWithEmailAndPassword(email.value, password.value)
      .catch(error => alert(error.message));
  });
  loginBtn.addEventListener('click', () => {
    auth.signInWithEmailAndPassword(email.value, password.value)
      .catch(error => alert(error.message));
  });

  // Log out
  logoutBtn.addEventListener('click', () => {
    auth.signOut()
      .then(() => {
        console.log("User signed out successfully");
      })
      .catch((error) => {
        console.error("Error signing out:", error.message);
      });
  });

  // Listen to auth state changes
  auth.onAuthStateChanged(user => {
    if (user) {
      authSection.style.display = 'none';
      appSection.style.display = 'block';
      logoutBtn.style.display = 'inline-block';

      // Real-time listener for this user's tasks
      db.collection('tasks')
        .where('uid', '==', user.uid)
        .orderBy('timestamp')
        .onSnapshot(snapshot => {
          taskList.innerHTML = '';
          snapshot.forEach(doc => {
            const li = document.createElement('li');
            li.textContent = doc.data().text;

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

    } else {
      authSection.style.display = 'block';
      appSection.style.display = 'none';
      logoutBtn.style.display = 'none';
    }
  });

  // Add task
  addTaskBtn.addEventListener('click', () => {
    console.log("Add button clicked");
    console.log("Current user:", auth.currentUser);
    const task = taskInput.value.trim();
    if(task) {
      db.collection('tasks').add({
        text: task,
        uid: auth.currentUser.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        console.log("Task added successfully");
      })
      .catch(error => {
        console.error("Error adding task:", error.message);
      });
      taskInput.value = '';
    }
  });
});
